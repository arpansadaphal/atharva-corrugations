/**
 * Enquiry reference `ACQ-YYMMDD-XXXX` (Technical §7.7): date in India time,
 * four random Crockford base-32 characters, created on the server, never
 * derived from personal data. General enquiries from the Contact page use
 * the prefix ACG so sales can tell them apart.
 */

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

export function makeReference(
  now: Date,
  random: Uint8Array = crypto.getRandomValues(new Uint8Array(4)),
  prefix: 'ACQ' | 'ACG' = 'ACQ',
): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  const suffix = Array.from(random.slice(0, 4), (b) => ALPHABET[b % 32]).join('')
  return `${prefix}-${get('year')}${get('month')}${get('day')}-${suffix}`
}

export const REFERENCE_PATTERN = /^AC[QG]-\d{6}-[0-9A-HJKMNP-TV-Z]{4}$/
