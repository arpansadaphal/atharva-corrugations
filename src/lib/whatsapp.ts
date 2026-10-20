import { families } from '@/data/products'

/**
 * WhatsApp links with a pre-filled message and source token (Sitemap §7.6,
 * Technical §10). Sales read the token to see which page started the chat.
 *
 * Tokens from Technical §10, plus WEB-PRODUCTS, WEB-INDUSTRIES,
 * WEB-QUALITY, WEB-ABOUT and WEB-QUOTE for the pages that list omits.
 */

const PAGE_TOKENS: Record<string, string> = {
  '/': 'WEB-HOME',
  '/products': 'WEB-PRODUCTS',
  '/industries': 'WEB-INDUSTRIES',
  '/custom-packaging': 'WEB-CUSTOM',
  '/manufacturing-and-quality': 'WEB-QUALITY',
  '/about': 'WEB-ABOUT',
  '/contact': 'WEB-CONTACT',
  '/request-quote': 'WEB-QUOTE',
}

export const FLOATING_TOKEN = 'WEB-FLOAT'
const DEFAULT_SUBJECT = 'corrugated packaging'

export interface WhatsAppContext {
  token: string
  /** What the quote is for, in running text */
  subject: string
}

/** Token and subject for a pathname; family pages name their family. */
export function contextForPath(pathname: string): WhatsAppContext {
  const path = pathname.replace(/\/+$/, '') || '/'
  const family = families.find((f) => path === `/products/${f.slug}`)
  if (family) return { token: family.token, subject: family.shortName }
  return { token: PAGE_TOKENS[path] ?? 'WEB-OTHER', subject: DEFAULT_SUBJECT }
}

/** Message template from Content §10.3. */
export function whatsappMessage({ token, subject }: WhatsAppContext): string {
  return `Hello Atharva Corrugations, I would like a quote for ${subject}. Ref: ${token}.`
}

/** `9960378111` → https://wa.me/919960378111?text=… */
export function whatsappUrl(number: string, context: WhatsAppContext): string {
  const digits = number.replace(/\D/g, '').slice(-10)
  return `https://wa.me/91${digits}?text=${encodeURIComponent(whatsappMessage(context))}`
}
