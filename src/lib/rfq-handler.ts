import { autoReply, teamEmail } from './email'
import { sendMail } from './mailer'
import { makeReference } from './reference'
import type { RfqConfig } from './rfq-config'
import { MIN_FILL_MS, makeRfqSchema, rfqEnvelopeSchema, type RfqEnvelope } from './rfq-schema'
import { verifyTurnstile } from './turnstile'

/**
 * The quote-request flow behind POST /api/rfq (Technical §7.1), kept free of
 * Next.js so it can be unit-tested. Error codes are generic on purpose:
 * they never reveal which abuse check failed (Technical §7.6).
 */

export type RfqResult =
  | { status: 200; body: { ok: true; reference: string } }
  | { status: 400; body: { ok: false; code: 'INVALID'; fields: Record<string, string> } }
  | { status: 422 | 502 | 503; body: { ok: false; code: 'REJECTED' | 'MAIL_FAILED' | 'FORM_OFFLINE' } }

export interface RfqDeps {
  config: RfqConfig
  production: boolean
  now?: Date
  send?: typeof sendMail
  verify?: typeof verifyTurnstile
}

const REJECTED = { status: 422, body: { ok: false, code: 'REJECTED' } } as const

/**
 * Checks shared by every enquiry form: form online, envelope shape,
 * honeypot, minimum fill time and Turnstile. Returns the envelope, or the
 * response to send.
 */
export async function screenEnvelope(
  payload: unknown,
  formEnabled: boolean,
  verify: typeof verifyTurnstile,
): Promise<{ envelope: RfqEnvelope } | { reject: RfqResult }> {
  if (!formEnabled) return { reject: { status: 503, body: { ok: false, code: 'FORM_OFFLINE' } } }
  const parsed = rfqEnvelopeSchema.safeParse(payload)
  if (!parsed.success) return { reject: REJECTED }
  const { website, elapsedMs, turnstileToken } = parsed.data
  // A human who autofilled the hidden field sees the error state with
  // WhatsApp and phone links, so nothing is lost silently
  if (website || elapsedMs < MIN_FILL_MS || !(await verify(turnstileToken))) return { reject: REJECTED }
  return { envelope: parsed.data }
}

/** Field errors keyed by path, first message per field */
export function fieldErrors(issues: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const issue of issues) fields[issue.path.map(String).join('.')] ??= issue.message
  return fields
}

export async function handleRfq(payload: unknown, deps: RfqDeps): Promise<RfqResult> {
  const { config, production, now = new Date(), send = sendMail, verify = verifyTurnstile } = deps

  const screened = await screenEnvelope(payload, config.formEnabled, verify)
  if ('reject' in screened) return screened.reject
  const { source } = screened.envelope

  const parsed = makeRfqSchema({ boardValues: config.boardValues, industries: config.industries }).safeParse(screened.envelope.data)
  if (!parsed.success) return { status: 400, body: { ok: false, code: 'INVALID', fields: fieldErrors(parsed.error.issues) } }

  const reference = makeReference(now)
  const ctx = {
    reference,
    replyPromise: config.replyPromise
      ? `${config.replyPromise}${config.hours ? ` (${config.hours})` : ''}`
      : 'as soon as we can',
    whatsappDisplay: config.whatsappDisplay,
    plantAddress: config.plantAddress,
    sourcePage: source?.page,
    utm: source?.utm,
  }
  const { routing } = config

  // The team email (with the archive copy) is the lead; if it fails, the
  // customer must see the error state and use WhatsApp or the phone
  try {
    await send(
      { from: routing.from, to: routing.to, cc: routing.cc, bcc: routing.bcc, replyTo: parsed.data.email, ...teamEmail(parsed.data, ctx) },
      { reference, production },
    )
  } catch (e) {
    console.error(`[rfq] ${reference} team email failed: ${(e as Error).message}`)
    return { status: 502, body: { ok: false, code: 'MAIL_FAILED' } }
  }

  // The auto-reply is a courtesy: the lead is already safe if it fails
  try {
    await send({ from: routing.from, to: [parsed.data.email], replyTo: routing.replyTo, ...autoReply(parsed.data, ctx) }, { reference, production })
  } catch (e) {
    console.error(`[rfq] ${reference} auto-reply failed: ${(e as Error).message}`)
  }

  console.info(`[rfq] ${reference} sent`)
  return { status: 200, body: { ok: true, reference } }
}
