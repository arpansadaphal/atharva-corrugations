'use client'

import { ChevronDown, LoaderCircle, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type FieldErrors } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { track, readUtm } from '@/lib/analytics'
import { summaryRows } from '@/lib/email'
import {
  DELIVERY_LOCATION_REQUIRED,
  DIMENSION_LIMITS_MM,
  ENQUIRY_TYPES,
  FAMILY_OPTIONS,
  MAX_QUANTITIES,
  PRINTING_OPTIONS,
  REPEAT_OPTIONS,
  SPECIAL_NEEDS,
  makeRfqSchema,
  type RfqData,
  type RfqInput,
} from '@/lib/rfq-schema'
import { cn } from '@/lib/utils'
import { whatsappUrl } from '@/lib/whatsapp'
import { Choice, ErrorText, Field, controlClass, fieldId } from './fields'
import { flatErrors, zodResolver } from './zod-resolver'

export interface RfqFormProps {
  boardOptions: { value: string; label: string }[]
  boardValues: string[]
  industries: string[]
  whatsappNumber?: string
  whatsappDisplay?: string
  phoneDisplay?: string
  phoneDigits?: string
  replyPromise?: string
  privacyHref: string
  privacyContact?: string
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; reference: string; rows: [string, string][]; subject: string }
  | { kind: 'error' }

const TIMEOUT_MS = 15_000

/** Wall-clock reads kept out of render (they only run in effects and handlers) */
const clock = () => Date.now()

const SPEC_FIELDS = ['lengthMm', 'widthMm', 'heightMm', 'board', 'printing', 'specialNeeds', 'deliveryLocation']

/**
 * Quote request form (Sitemap §6.9, §7). One page, three groups; few
 * required fields. Validation runs here and again on the server with the
 * same schema. Input is never cleared on failure.
 */
export function RfqForm(props: RfqFormProps) {
  const { boardOptions, boardValues, industries, whatsappNumber, whatsappDisplay, phoneDisplay, phoneDigits, replyPromise } = props
  const schema = useMemo(() => makeRfqSchema({ boardValues, industries }), [boardValues, industries])

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RfqInput, unknown, RfqData>({
    resolver: zodResolver<RfqInput, RfqData>(schema),
    defaultValues: {
      enquiryType: 'quote',
      family: '' as RfqInput['family'],
      quantities: [{ qty: '' as unknown as number }],
      repeat: '' as RfqInput['repeat'],
      specialNeeds: [],
      board: '',
      industry: '',
      printing: '',
    },
    shouldFocusError: false,
  })
  // Up to three rows tracked by count, not useFieldArray: its random row IDs
  // are not allowed while the page is prerendered (Cache Components)
  const [qtyRows, setQtyRows] = useState(1)
  const addQuantity = () => setQtyRows((n) => Math.min(n + 1, MAX_QUANTITIES))
  const removeQuantity = (index: number) => {
    const rows = (getValues('quantities') ?? []).slice(0, qtyRows)
    const next = rows.filter((_, i) => i !== index)
    setValue('quantities', next)
    setQtyRows(next.length)
  }

  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [summary, setSummary] = useState<[string, string][]>([])
  const [specOpen, setSpecOpen] = useState(false)
  const startedAt = useRef(0)
  const started = useRef(false)
  const honeypot = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // Prefill from the entry point (Sitemap §7.1) and start the fill timer
  useEffect(() => {
    startedAt.current = clock()
    const params = new URLSearchParams(window.location.search)
    const family = params.get('family')
    if (family && FAMILY_OPTIONS.some((o) => o.value === family)) setValue('family', family as RfqInput['family'])
    const format = params.get('format')
    if (format && /^[a-z0-9-]{1,60}$/.test(format)) setValue('format', format)
    const type = params.get('type')
    if (type === 'sample') {
      setValue('enquiryType', 'sample')
      track('sample_request_start', { page: '/request-quote' })
    }
    if (type === 'custom') setValue('entry', 'custom')
  }, [setValue])

  useEffect(() => {
    if (status.kind === 'success') successRef.current?.focus()
    if (status.kind === 'error') errorRef.current?.focus()
  }, [status.kind])

  useEffect(() => {
    if (summary.length > 0) summaryRef.current?.focus()
  }, [summary])

  const drawingInstead = useWatch({ control, name: 'sendDrawingInstead' })

  const onStart = () => {
    if (started.current) return
    started.current = true
    track('rfq_start', { page: '/request-quote', family: getValues('family') || undefined })
  }

  const onInvalid = (errs: FieldErrors<RfqInput>) => {
    const list = flatErrors(errs)
    if (list.some(([path]) => SPEC_FIELDS.includes(path.split('.')[0]))) setSpecOpen(true)
    setSummary(list)
  }

  const onValid = async (data: RfqData) => {
    setSummary([])
    setStatus({ kind: 'submitting' })
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          data: getValues(),
          website: honeypot.current?.value ?? '',
          elapsedMs: clock() - startedAt.current,
          source: { page: document.referrer ? new URL(document.referrer).pathname : undefined, utm: readUtm(window.location.search) },
        }),
      })
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; code?: string; fields?: Record<string, string> }

      if (res.ok && body.ok && body.reference) {
        const subject = FAMILY_OPTIONS.find((o) => o.value === data.family && data.family !== 'help')?.label.toLowerCase() ?? 'corrugated packaging'
        setStatus({ kind: 'success', reference: body.reference, rows: summaryRows(data), subject })
        track('rfq_submit_success', { reference: body.reference, family: data.family, enquiry_type: data.enquiryType })
        return
      }
      if (res.status === 400 && body.fields) {
        Object.entries(body.fields).forEach(([path, message]) => setError(path as never, { type: 'server', message }))
        setStatus({ kind: 'idle' })
        onInvalid(Object.fromEntries(Object.entries(body.fields).map(([k, m]) => [k, { message: m }])) as FieldErrors<RfqInput>)
        return
      }
      throw new Error(body.code ?? `HTTP ${res.status}`)
    } catch (e) {
      setStatus({ kind: 'error' })
      track('rfq_submit_error', { error_code: (e as Error).name === 'AbortError' ? 'TIMEOUT' : (e as Error).message })
    } finally {
      clearTimeout(timer)
    }
  }

  // ── Success: the form is replaced by a confirmation (Sitemap §7.5) ──────
  if (status.kind === 'success') {
    const waHref = whatsappNumber ? whatsappUrl(whatsappNumber, { token: status.reference, subject: status.subject }) : undefined
    return (
      <div className="flex flex-col gap-6">
        <h2 ref={successRef} tabIndex={-1} className="text-h3 font-medium text-ink outline-none">
          Thank you. Your reference is <span className="tabular whitespace-nowrap">{status.reference}</span>.
        </h2>
        <p className="measure">
          We have emailed you a copy.{replyPromise && ` Our team will reply within ${replyPromise}.`}
          {whatsappDisplay
            ? ` Have a drawing, dieline or photograph? WhatsApp it to ${whatsappDisplay} with your reference, or reply to our email with the file attached.`
            : ' Have a drawing, dieline or photograph? Reply to our email with the file attached.'}
        </p>
        {waHref && (
          <div>
            <Button href={waHref} variant="outline" target="_blank" rel="noopener noreferrer" data-event="whatsapp_click" data-location="rfq-success">
              Send a drawing on WhatsApp
            </Button>
          </div>
        )}
        <div>
          <h3 className="text-label font-semibold text-muted uppercase">What you sent</h3>
          <dl className="mt-3 border-t border-line">
            {status.rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 border-b border-line py-3 md:grid-cols-3">
                <dt className="text-spec font-medium text-ink">{k}</dt>
                <dd className="text-spec break-words md:col-span-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }

  const submitting = status.kind === 'submitting'
  const err = (path: string) => {
    const parts = path.split('.')
    let node: unknown = errors
    for (const p of parts) node = (node as Record<string, unknown> | undefined)?.[p]
    return (node as { message?: string } | undefined)?.message
  }

  return (
    <form noValidate onSubmit={(e) => handleSubmit(onValid, onInvalid)(e)} onFocus={onStart} className="flex flex-col gap-10">
      {summary.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border-l-4 border-error bg-paper-50 p-4 outline-none">
          <h2 className="text-copy font-semibold text-ink">
            Please check {summary.length === 1 ? 'one field' : `${summary.length} fields`}
          </h2>
          <ul className="mt-2 flex flex-col gap-1">
            {summary.map(([path, message]) => (
              <li key={path}>
                <a href={`#${fieldId(path)}`} className="text-spec text-error underline underline-offset-4">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset disabled={submitting} className="flex flex-col gap-10">
        {/* ── A. Requirement ─────────────────────────────────────────── */}
        <fieldset className="flex flex-col gap-6">
          <legend className="mb-6 text-h3 font-medium text-ink">Your requirement</legend>

          <fieldset aria-describedby={err('enquiryType') ? `${fieldId('enquiryType')}-error` : undefined}>
            <legend className="text-spec font-medium text-ink">
              Type of enquiry <span className="font-normal text-muted">(required)</span>
            </legend>
            <div id={fieldId('enquiryType')} className="mt-1 flex flex-wrap gap-x-6">
              {ENQUIRY_TYPES.map((o) => (
                <Choice key={o.value} type="radio" value={o.value} label={o.label} {...register('enquiryType')} />
              ))}
            </div>
            {err('enquiryType') && <ErrorText id={`${fieldId('enquiryType')}-error`}>{err('enquiryType')}</ErrorText>}
          </fieldset>

          <Field name="family" label="Packaging type" required error={err('family')}>
            {(a) => (
              <select {...a} {...register('family')} className={controlClass}>
                <option value="" disabled>
                  Choose a packaging type
                </option>
                {FAMILY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field
            name="packing"
            label="What are you packing?"
            required
            hint="For example: compressor housing, about 40 kg."
            error={err('packing')}
          >
            {(a) => <textarea {...a} {...register('packing')} rows={2} maxLength={300} className={controlClass} />}
          </Field>

          <Field name="weightKg" label="Product weight (kg)" hint="Helps us choose the board strength." error={err('weightKg')} className="md:max-w-60">
            {(a) => <input {...a} {...register('weightKg')} type="text" inputMode="decimal" className={cn(controlClass, 'tabular')} />}
          </Field>

          <div className="flex flex-col gap-3">
            {Array.from({ length: qtyRows }, (_, i) => (
              <Field
                key={i}
                name={`quantities.${i}.qty`}
                label={i === 0 ? 'Quantity per order' : `Quantity ${i + 1}`}
                required={i === 0}
                hint={i === 0 ? 'Add more than one quantity if you want to compare prices.' : undefined}
                error={err(`quantities.${i}.qty`)}
              >
                {(a) => (
                  <div className="flex items-end gap-3 md:max-w-80">
                    <input {...a} {...register(`quantities.${i}.qty`)} type="text" inputMode="numeric" className={cn(controlClass, 'tabular')} />
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => removeQuantity(i)}
                        className="inline-flex size-11 shrink-0 items-center justify-center text-muted hover:text-error"
                      >
                        <X aria-hidden="true" className="size-5" />
                        <span className="sr-only">Remove quantity {i + 1}</span>
                      </button>
                    )}
                  </div>
                )}
              </Field>
            ))}
            {qtyRows < MAX_QUANTITIES && (
              <button
                type="button"
                onClick={addQuantity}
                className="inline-flex min-h-11 items-center gap-2 self-start text-ui font-medium text-accent hover:text-accent-hover"
              >
                <Plus aria-hidden="true" className="size-4" />
                Add another quantity
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field name="repeat" label="How often" required error={err('repeat')}>
              {(a) => (
                <select {...a} {...register('repeat')} className={controlClass}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {REPEAT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field name="requiredBy" label="Required-by date" hint="The date you need the boxes in hand." error={err('requiredBy')}>
              {(a) => <input {...a} {...register('requiredBy')} type="date" className={controlClass} />}
            </Field>
          </div>
        </fieldset>

        {/* ── B. Specification (optional; collapsible on mobile) ─────── */}
        <fieldset className="flex flex-col gap-6">
          <legend className="sr-only">Specification (optional)</legend>
          <div className="flex items-baseline justify-between gap-4">
            <p aria-hidden="true" className="text-h3 font-medium text-ink">
              Specification <span className="text-copy font-normal text-muted">(optional)</span>
            </p>
            <button
              type="button"
              aria-expanded={specOpen}
              aria-controls="rfq-spec"
              onClick={() => setSpecOpen((o) => !o)}
              className="inline-flex min-h-11 items-center gap-1 text-ui font-medium text-accent lg:hidden"
            >
              {specOpen ? 'Hide' : 'Add details'}
              <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform', specOpen && 'rotate-180')} />
            </button>
          </div>

          <div id="rfq-spec" className={cn(specOpen ? 'flex' : 'hidden', 'flex-col gap-6 lg:flex')}>
            <div className="flex flex-col gap-3">
              <p className="text-spec font-medium text-ink">Internal size, length × width × height (mm)</p>
              <p id="rfq-dims-hint" className="text-spec text-muted">
                Measure inside the box, in millimetres. Between {DIMENSION_LIMITS_MM.min} and {DIMENSION_LIMITS_MM.max} mm each.
              </p>
              <div className="grid grid-cols-3 gap-4 md:max-w-md">
                {(['lengthMm', 'widthMm', 'heightMm'] as const).map((k, i) => (
                  <Field key={k} name={k} label={['Length', 'Width', 'Height'][i]} error={err(k)}>
                    {(a) => (
                      <input
                        {...a}
                        {...register(k)}
                        aria-describedby={[a['aria-describedby'], 'rfq-dims-hint'].filter(Boolean).join(' ')}
                        disabled={drawingInstead}
                        type="text"
                        inputMode="numeric"
                        className={cn(controlClass, 'tabular')}
                      />
                    )}
                  </Field>
                ))}
              </div>
              <Choice type="checkbox" label="I will send a drawing or sample instead" {...register('sendDrawingInstead')} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field name="board" label="Board preference" error={err('board')}>
                {(a) => (
                  <select {...a} {...register('board')} className={controlClass}>
                    <option value="">Choose one</option>
                    {boardOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field name="printing" label="Printing" error={err('printing')}>
                {(a) => (
                  <select {...a} {...register('printing')} className={controlClass}>
                    <option value="">Choose one</option>
                    {PRINTING_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>

            <fieldset>
              <legend className="text-spec font-medium text-ink">Special needs</legend>
              <div className="mt-1 grid gap-x-6 md:grid-cols-2">
                {SPECIAL_NEEDS.map((o) => (
                  <Choice key={o.value} type="checkbox" value={o.value} label={o.label} {...register('specialNeeds')} />
                ))}
              </div>
            </fieldset>

            <Field
              name="deliveryLocation"
              label="Delivery location"
              required={DELIVERY_LOCATION_REQUIRED}
              hint="City and state."
              error={err('deliveryLocation')}
              className="md:max-w-md"
            >
              {(a) => <input {...a} {...register('deliveryLocation')} type="text" autoComplete="address-level2" className={controlClass} />}
            </Field>
          </div>
        </fieldset>

        {/* ── C. Contact ─────────────────────────────────────────────── */}
        <fieldset className="flex flex-col gap-6">
          <legend className="mb-6 text-h3 font-medium text-ink">Your details</legend>
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="name" label="Name" required error={err('name')}>
              {(a) => <input {...a} {...register('name')} type="text" autoComplete="name" className={controlClass} />}
            </Field>
            <Field name="company" label="Company" required error={err('company')}>
              {(a) => <input {...a} {...register('company')} type="text" autoComplete="organization" className={controlClass} />}
            </Field>
            <Field name="email" label="Email" required error={err('email')}>
              {(a) => <input {...a} {...register('email')} type="email" autoComplete="email" className={controlClass} />}
            </Field>
            <div className="flex flex-col gap-1">
              <Field name="phone" label="Phone" required error={err('phone')}>
                {(a) => <input {...a} {...register('phone')} type="tel" autoComplete="tel" className={cn(controlClass, 'tabular')} />}
              </Field>
              <Choice type="checkbox" label="This number is on WhatsApp" {...register('phoneOnWhatsApp')} />
            </div>
            <Field name="designation" label="Designation" error={err('designation')}>
              {(a) => <input {...a} {...register('designation')} type="text" autoComplete="organization-title" className={controlClass} />}
            </Field>
            <Field name="industry" label="Industry" error={err('industry')}>
              {(a) => (
                <select {...a} {...register('industry')} className={controlClass}>
                  <option value="">Choose one</option>
                  {industries.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
          <Field name="notes" label="Notes" error={err('notes')}>
            {(a) => <textarea {...a} {...register('notes')} rows={4} maxLength={2000} className={controlClass} />}
          </Field>

          {/* Honeypot: hidden from people and assistive technology; must stay empty */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="rfq-website">Website</label>
            <input ref={honeypot} id="rfq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
        </fieldset>
      </fieldset>

      {status.kind === 'error' && (
        <div ref={errorRef} tabIndex={-1} role="alert" className="border-l-4 border-error bg-paper-50 p-4 outline-none">
          <p className="text-copy text-ink">
            We could not send your enquiry. Your details are still on this page. Please try again
            {whatsappNumber && whatsappDisplay && (
              <>
                , or message us on WhatsApp at{' '}
                <a
                  href={whatsappUrl(whatsappNumber, { token: 'WEB-QUOTE', subject: 'corrugated packaging' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-4"
                >
                  {whatsappDisplay}
                </a>
              </>
            )}
            {phoneDisplay && phoneDigits && (
              <>
                , or call{' '}
                <a href={`tel:+91${phoneDigits}`} className="text-accent underline underline-offset-4">
                  {phoneDisplay}
                </a>
              </>
            )}
            .
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-line pt-6">
        <p className="measure text-spec text-muted">
          Atharva Corrugations uses these details only to reply to your enquiry.
          {props.privacyContact && ` To ask us to delete them, email ${props.privacyContact}.`} Read our{' '}
          <Link href={props.privacyHref} className="text-accent underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
        <div>
          <Button type="submit" size="lg" disabled={submitting} aria-disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
                Sending…
              </>
            ) : (
              'Send quote request'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
