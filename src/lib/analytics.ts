/**
 * Conversion events (Technical §10, Sitemap §7.9). Sent to GA4 only after
 * the visitor accepts analytics (TD-06); always recorded in
 * window.acplEvents, a local list that never leaves the browser, so the
 * wiring can be tested without analytics. Never pass personal data.
 */

export type EventName =
  | 'rfq_start'
  | 'rfq_submit_success'
  | 'rfq_submit_error'
  | 'sample_request_start'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'product_cta_click'

type Params = Record<string, string | number | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    acplEvents?: { event: EventName; params: Params }[]
  }
}

export function track(event: EventName, params: Params = {}) {
  if (typeof window === 'undefined') return
  ;(window.acplEvents ??= []).push({ event, params })
  window.gtag?.('event', event, params)
}

export const CONSENT_KEY = 'acpl-analytics-consent'
export const CONSENT_SETTINGS_EVENT = 'acpl:consent-settings'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const UTM_STORAGE = 'acpl-utm'

function utmFrom(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  return Object.fromEntries(UTM_KEYS.flatMap((k) => (params.get(k) ? [[k, params.get(k)!.slice(0, 200)]] : [])))
}

/** On landing: keep the first UTM values of the session (Technical §10) */
export function captureUtm(search: string) {
  const utm = utmFrom(search)
  if (Object.keys(utm).length === 0) return
  try {
    if (!sessionStorage.getItem(UTM_STORAGE)) sessionStorage.setItem(UTM_STORAGE, JSON.stringify(utm))
  } catch {
    // storage unavailable (private mode): UTM simply is not carried
  }
}

/** UTM values from this URL, falling back to those captured earlier in the session */
export function readUtm(search: string): Record<string, string> {
  const fromUrl = utmFrom(search)
  if (Object.keys(fromUrl).length > 0) return fromUrl
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE) ?? '{}')
  } catch {
    return {}
  }
}

/** The source token in a pre-filled WhatsApp link ("… Ref: WEB-HOME.") */
export function whatsappToken(href: string): string | undefined {
  try {
    return /Ref: ([A-Z0-9-]+)\./.exec(new URL(href).searchParams.get('text') ?? '')?.[1]
  } catch {
    return undefined
  }
}
