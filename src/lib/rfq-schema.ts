import { z } from 'zod'
import {
  DELIVERY_LOCATION_REQUIRED,
  DIMENSION_LIMITS_MM,
  ENQUIRY_TYPES,
  ENTRY_VALUES,
  FAMILY_OPTIONS,
  MAX_QUANTITIES,
  MAX_QUANTITY,
  PRINTING_OPTIONS,
  REPEAT_OPTIONS,
  SPECIAL_NEEDS,
  isValidPhone,
} from './rfq-options'

// Options and limits live in rfq-options.ts (no zod); re-exported here for server code
export * from './rfq-options'

// zod would otherwise try to compile validators with `new Function`, which
// the Content-Security-Policy forbids (no 'unsafe-eval'): every form page
// would log a violation. Interpreted validation is fast enough for a form.
z.config({ jitless: true })

/**
 * Quote request schema (Sitemap §7.2, Technical §7.2). The same schema runs
 * in the browser and in /api/rfq. Options that depend on verified facts
 * (board choices, industries) are passed in by the server, so a value that
 * is not shown on the page is not accepted either. The browser loads this
 * module only when the visitor starts filling a form (first-load budget,
 * Technical §8).
 */

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
