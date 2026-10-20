import { z } from 'zod'
import { families } from '@/data/products'

/**
 * Quote request schema (Sitemap §7.2, Technical §7.2). The same schema runs
 * in the browser and in /api/rfq. Options that depend on verified facts
 * (board choices, industries) are passed in by the server, so a value that
 * is not shown on the page is not accepted either.
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

const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]]

// ── Field rules ───────────────────────────────────────────────────────────

const NO_HTML = /<\s*[a-z!/?]/i

/** Trimmed text with a length range; rejects markup (Sitemap §7.4) */
export const text = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, min <= 1 ? `Enter ${label}` : `${capitalise(label)} needs at least ${min} characters`)
    .max(max, `${capitalise(label)} can be at most ${max} characters`)
    .refine((v) => !NO_HTML.test(v), 'Please remove the < and > characters')

export const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${capitalise(label)} can be at most ${max} characters`)
    .refine((v) => !NO_HTML.test(v), 'Please remove the < and > characters')
    .optional()
    .or(z.literal(''))

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
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

/** Empty string → undefined; otherwise a number (NaN fails validation) */
const numberish = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : typeof v === 'number' ? v : Number(v)),
  z.number({ error: 'Enter a number' }).optional(),
)

const dimension = (label: string) =>
  numberish.refine(
    (v) => v === undefined || (v >= DIMENSION_LIMITS_MM.min && v <= DIMENSION_LIMITS_MM.max),
    `${label} must be between ${DIMENSION_LIMITS_MM.min} and ${DIMENSION_LIMITS_MM.max} mm`,
  )

export interface RfqSchemaOptions {
  boardValues: string[]
  industries: string[]
}

export function makeRfqSchema({ boardValues, industries }: RfqSchemaOptions) {
  return z
    .object({
      // A. Requirement
      enquiryType: z.enum(values(ENQUIRY_TYPES), { error: 'Choose the type of enquiry' }),
      family: z.enum(values(FAMILY_OPTIONS), { error: 'Choose a packaging type' }),
      format: z
        .string()
        .regex(/^[a-z0-9-]{1,60}$/)
        .optional()
        .or(z.literal('')),
      entry: z.enum(ENTRY_VALUES).optional().or(z.literal('')),
      packing: text(10, 300, 'what you are packing'),
      weightKg: numberish.refine((v) => v === undefined || (v > 0 && v <= 100_000), 'Enter a weight above 0 kg'),
      quantities: z
        .array(
          z.object({
            qty: z.preprocess(
              (v) => (v === '' || v === undefined ? undefined : Number(v)),
              z
                .number({ error: 'Enter a quantity' })
                .int('Enter a whole number')
                .positive('Enter a quantity above 0')
                .max(MAX_QUANTITY, 'Enter a smaller quantity'),
            ),
          }),
        )
        .min(1, 'Enter a quantity')
        .max(MAX_QUANTITIES),
      repeat: z.enum(values(REPEAT_OPTIONS), { error: 'Choose how often you need it' }),
      requiredBy: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date')
        .optional()
        .or(z.literal('')),

      // B. Specification
      sendDrawingInstead: z.boolean().optional(),
      lengthMm: dimension('Length'),
      widthMm: dimension('Width'),
      heightMm: dimension('Height'),
      board: z
        .string()
        .refine((v) => v === '' || boardValues.includes(v), 'Choose a board option from the list')
        .optional(),
      printing: z.enum(values(PRINTING_OPTIONS)).optional().or(z.literal('')),
      specialNeeds: z.array(z.enum(values(SPECIAL_NEEDS))).optional(),
      deliveryLocation: DELIVERY_LOCATION_REQUIRED
        ? text(2, 120, 'the delivery city and state')
        : optionalText(120, 'delivery location'),

      // C. Contact
      name: text(2, 120, 'your name'),
      company: text(2, 120, 'your company'),
      email: z.string().trim().max(254).pipe(z.email('Enter a valid email address')),
      phone: z.string().trim().refine(isValidPhone, 'Enter a 10-digit mobile number, or an international number starting with +'),
      phoneOnWhatsApp: z.boolean().optional(),
      designation: optionalText(120, 'designation'),
      industry: z
        .string()
        .refine((v) => v === '' || industries.includes(v), 'Choose an industry from the list')
        .optional(),
      notes: optionalText(2000, 'notes'),
    })
    .superRefine((v, ctx) => {
      if (v.sendDrawingInstead) return
      const dims = [v.lengthMm, v.widthMm, v.heightMm]
      const given = dims.filter((d) => d !== undefined).length
      if (given > 0 && given < 3) {
        ;(['lengthMm', 'widthMm', 'heightMm'] as const).forEach((key, i) => {
          if (dims[i] === undefined) {
            ctx.addIssue({ code: 'custom', path: [key], message: 'Enter all three dimensions, or none' })
          }
        })
      }
    })
}

export type RfqInput = z.input<ReturnType<typeof makeRfqSchema>>
export type RfqData = z.output<ReturnType<typeof makeRfqSchema>>

/** General enquiry from the Contact page (Sitemap §6.8 K2): name, company, email, phone, message */
export const contactSchema = z.object({
  name: text(2, 120, 'your name'),
  company: text(2, 120, 'your company'),
  email: z.string().trim().max(254).pipe(z.email('Enter a valid email address')),
  phone: z.string().trim().refine(isValidPhone, 'Enter a 10-digit mobile number, or an international number starting with +'),
  message: text(10, 2000, 'your message'),
})

export type ContactInput = z.input<typeof contactSchema>
export type ContactData = z.output<typeof contactSchema>

/** Fields sent alongside the form data; checked on the server only */
export const rfqEnvelopeSchema = z.object({
  data: z.unknown(),
  /** Honeypot: must be empty */
  website: z.string().max(200).optional(),
  /** Time the form was open before submit, measured in the browser */
  elapsedMs: z.number().nonnegative(),
  turnstileToken: z.string().max(4096).optional(),
  source: z
    .object({
      page: z.string().max(200).optional(),
      utm: z.record(z.string().max(40), z.string().max(200)).optional(),
    })
    .optional(),
})

export type RfqEnvelope = z.infer<typeof rfqEnvelopeSchema>
