import { contactAutoReply, contactTeamEmail } from './email'
import { sendMail } from './mailer'
import { makeReference } from './reference'
import type { RfqConfig } from './rfq-config'
import { fieldErrors, screenEnvelope, type RfqResult } from './rfq-handler'
import { contactSchema } from './rfq-schema'
import { verifyTurnstile } from './turnstile'

/**
 * General enquiry behind POST /api/contact (Sitemap §6.8 K2, §7.3): the same
 * screening as quote requests, then an email to the general address with
 * an archive copy, and a short auto-reply. Reference prefix ACG.
 */
export async function handleContact(
  payload: unknown,
  deps: { config: RfqConfig; production: boolean; now?: Date; send?: typeof sendMail; verify?: typeof verifyTurnstile },
): Promise<RfqResult> {
  const { config, production, now = new Date(), send = sendMail, verify = verifyTurnstile } = deps

  const screened = await screenEnvelope(payload, config.formEnabled, verify)
  if ('reject' in screened) return screened.reject

  const parsed = contactSchema.safeParse(screened.envelope.data)
  if (!parsed.success) return { status: 400, body: { ok: false, code: 'INVALID', fields: fieldErrors(parsed.error.issues) } }

  const reference = makeReference(now, undefined, 'ACG')
  const ctx = {
    reference,
    replyPromise: config.replyPromise ? `${config.replyPromise}${config.hours ? ` (${config.hours})` : ''}` : 'as soon as we can',
    plantAddress: config.plantAddress,
  }
  const r = config.contactRouting

  try {
    await send(
      { from: config.routing.from, to: r.to, bcc: r.bcc, replyTo: parsed.data.email, ...contactTeamEmail(parsed.data, ctx) },
      { reference, production },
    )
  } catch (e) {
    console.error(`[contact] ${reference} team email failed: ${(e as Error).message}`)
    return { status: 502, body: { ok: false, code: 'MAIL_FAILED' } }
  }
  try {
    await send(
      { from: config.routing.from, to: [parsed.data.email], replyTo: r.replyTo, ...contactAutoReply(parsed.data, ctx) },
      { reference, production },
    )
  } catch (e) {
    console.error(`[contact] ${reference} auto-reply failed: ${(e as Error).message}`)
  }

  console.info(`[contact] ${reference} sent`)
  return { status: 200, body: { ok: true, reference } }
}
