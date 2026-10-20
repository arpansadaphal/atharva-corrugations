/**
 * Display formats from CORRUGATIONS_CONTENT_AND_ASSET_REQUIREMENTS.md §10.2.
 */

/** '9960378111' → '+91 99603 78111' */
export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(-10)
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`
}

/** '9960378111' → 'tel:+919960378111' */
export function telHref(digits: string): string {
  return `tel:+91${digits.replace(/\D/g, '').slice(-10)}`
}
