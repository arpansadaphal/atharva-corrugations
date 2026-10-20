import { gatedValue, getClaimsMode } from './claims'
import { formatPhone } from './format'
import { BOARD_NOT_SURE, boardOptionsFrom } from './rfq-schema'
import type { ClaimsMode } from '@/types/claims'

/**
 * Quote-flow settings resolved on the server through the claims gate, so
 * the page and the API agree on what is offered and accepted. Never import
 * this from a client component (check-claims enforces it for the gate).
 */
export function rfqConfig(mode: ClaimsMode = getClaimsMode(), env: Env = process.env) {
  const phones = gatedValue('F-12', mode)
  const emails = gatedValue('F-13', mode)
  const hours = gatedValue('F-14', mode)
  const replyDays = gatedValue('F-16', mode)
  const address = gatedValue('F-05', mode)
  const boardOptions = boardOptionsFrom(gatedValue('F-20', mode))

  return {
    /** Forms stay offline in production until the privacy policy is published (Sitemap §2, E-08) */
    formEnabled: mode !== 'production' || gatedValue('F-66', mode) !== undefined,
    boardOptions,
    boardValues: [BOARD_NOT_SURE, ...boardOptions.map((o) => o.value)].filter((v, i, a) => a.indexOf(v) === i),
    industries: gatedValue('F-45', mode) ?? [],
    whatsappNumber: phones?.whatsapp,
    phoneDisplay: phones ? formatPhone(phones.main) : undefined,
    phoneDigits: phones?.main,
    whatsappDisplay: phones ? formatPhone(phones.whatsapp) : undefined,
    salesEmail: emails?.sales,
    hours: hours ? `${hours.days}, ${hours.hours}` : undefined,
    replyPromise: replyDays ? `${replyDays} working days` : undefined,
    plantAddress: address ? `${address.line1}, ${address.line2}, ${address.city} ${address.postalCode}` : undefined,
    /** Routing (Sitemap §7.3, SD-08): sales@ primary, named contact in copy; env overrides */
    routing: {
      to: (env.RFQ_TO ?? emails?.sales ?? '').split(',').filter(Boolean),
      cc: (env.RFQ_CC ?? emails?.general ?? '').split(',').filter(Boolean),
      bcc: (env.ARCHIVE_BCC ?? '').split(',').filter(Boolean),
      from: env.MAIL_FROM ?? 'Atharva Corrugations <onboarding@resend.dev>',
      replyTo: emails?.sales,
    },
  }
}

export type RfqConfig = ReturnType<typeof rfqConfig>

/** Environment variables; a plain record so tests can pass partial sets */
type Env = Record<string, string | undefined>
