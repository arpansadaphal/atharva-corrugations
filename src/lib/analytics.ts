/**
 * Conversion events (Technical §10, Sitemap §7.9). Pushes to the dataLayer
 * when analytics is loaded (M7, behind consent); a no-op until then.
 * Never pass personal data.
 */

type EventName = 'rfq_start' | 'rfq_submit_success' | 'rfq_submit_error' | 'sample_request_start'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: EventName, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer?.push({ event, ...params })
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const UTM_STORAGE = 'acpl-utm'

/** UTM values from this URL, falling back to those captured earlier in the session */
export function readUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  const fromUrl = Object.fromEntries(UTM_KEYS.flatMap((k) => (params.get(k) ? [[k, params.get(k)!.slice(0, 200)]] : [])))
  if (Object.keys(fromUrl).length > 0) return fromUrl
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE) ?? '{}')
  } catch {
    return {}
  }
}
