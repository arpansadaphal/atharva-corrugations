import { families } from '@/data/products'

/**
 * Quote-form options and limits (Sitemap §7.2). Kept free of zod so the
 * form can render without loading the validation library; the schema in
 * rfq-schema.ts is fetched when the visitor first focuses a field.
 */

/**
 * Delivery location: optional in Strategy §5.4, required in Sitemap §7.2.
 * Owner decision pending (audit item F-3); optional until then.
 */
export const DELIVERY_LOCATION_REQUIRED = false

/** Provisional "sensible limits" for internal dimensions (Sitemap §7.4 gives none) */
export const DIMENSION_LIMITS_MM = { min: 10, max: 5000 } as const
export const MAX_QUANTITY = 10_000_000
export const MAX_QUANTITIES = 3
/** Submissions faster than this are treated as automated */
export const MIN_FILL_MS = 3000

export const ENQUIRY_TYPES = [
  { value: 'quote', label: 'Quote' },
  { value: 'product', label: 'Product enquiry' },
  { value: 'sample', label: 'Sample request' },
] as const

export const FAMILY_OPTIONS = [
  ...families.map((f) => ({ value: f.slug as string, label: f.name })),
  { value: 'help', label: 'Not sure, help me choose' },
]

export const REPEAT_OPTIONS = [
  { value: 'one-time', label: 'One-time' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'ongoing', label: 'Ongoing' },
] as const

export const PRINTING_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: '1', label: '1 colour' },
  { value: '2-4', label: '2 to 4 colours' },
  { value: 'advice', label: 'Need advice' },
] as const

export const SPECIAL_NEEDS = [
  { value: 'moisture', label: 'Moisture resistance' },
  { value: 'export', label: 'Export shipment' },
  { value: 'stacking', label: 'Stacking or pallet load' },
  { value: 'die-cut', label: 'Die-cut shape' },
  { value: 'inserts', label: 'Inserts or partitions' },
  { value: 'other', label: 'Other' },
] as const

/** Entry points that change how sales read the request (Sitemap §7.1) */
export const ENTRY_VALUES = ['custom'] as const

export const BOARD_NOT_SURE = 'not-sure'

/** '3 ply' style options from verified ply counts */
export function boardOptionsFrom(ply: readonly number[] | undefined) {
  return [
    { value: BOARD_NOT_SURE, label: 'Not sure' },
    ...(ply ?? []).map((n) => ({ value: `${n}-ply`, label: `${n} ply` })),
  ]
}

/** Spaces, hyphens and brackets removed (Technical §7.2) */
export function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, '')
}

const INDIAN_MOBILE = /^(?:\+91|0)?[6-9]\d{9}$/
const INTERNATIONAL = /^\+\d{8,15}$/

export function isValidPhone(raw: string): boolean {
  const p = normalisePhone(raw)
  return INDIAN_MOBILE.test(p) || INTERNATIONAL.test(p)
}
