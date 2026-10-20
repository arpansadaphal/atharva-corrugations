import { headerSafe } from './email'

/**
 * Mail transport (TD-04: Resend over its HTTP API, no SDK). Without an API
 * key, preview and development log the send instead; production refuses,
 * so a missing key can never silently drop leads. Logs carry the
 * reference and outcome only, never the payload (Technical §7.8).
 */

export interface Mail {
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  replyTo?: string
  subject: string
  html: string
  text: string
}

export class MailError extends Error {}

export async function sendMail(mail: Mail, opts: { reference: string; production: boolean; env?: Env }) {
  const env = opts.env ?? process.env
  const clean = (list?: string[]) => list?.map(headerSafe).filter(Boolean)

  if (!env.RESEND_API_KEY) {
    if (opts.production) throw new MailError('RESEND_API_KEY is not set')
    console.info(`[mail:log] ${opts.reference} → ${mail.to.join(', ')} (no RESEND_API_KEY; not sent)`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: headerSafe(mail.from),
      to: clean(mail.to),
      cc: clean(mail.cc),
      bcc: clean(mail.bcc),
      reply_to: mail.replyTo ? headerSafe(mail.replyTo) : undefined,
      subject: headerSafe(mail.subject),
      html: mail.html,
      text: mail.text,
    }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new MailError(`Resend responded ${res.status}`)
}

/** Environment variables; a plain record so tests can pass partial sets */
type Env = Record<string, string | undefined>
