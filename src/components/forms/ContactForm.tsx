'use client'

import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { contactSchema, type ContactData, type ContactInput } from '@/lib/rfq-schema'
import { whatsappUrl } from '@/lib/whatsapp'
import { Field, controlClass, fieldId } from './fields'
import { flatErrors, zodResolver } from './zod-resolver'

export interface ContactFormProps {
  whatsappNumber?: string
  whatsappDisplay?: string
  phoneDisplay?: string
  phoneDigits?: string
  replyPromise?: string
  privacyHref: string
}

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success'; reference: string } | { kind: 'error' }

const TIMEOUT_MS = 15_000
/** Wall-clock reads kept out of render (they only run in effects and handlers) */
const clock = () => Date.now()

/**
 * General enquiry (Sitemap §6.8 K2): name, company, email, phone, message.
 * Same behaviour as the quote form: error summary that takes focus, input
 * kept on failure with WhatsApp and phone offered, 15 s timeout.
 */
export function ContactForm({ whatsappNumber, whatsappDisplay, phoneDisplay, phoneDigits, replyPromise, privacyHref }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({ resolver: zodResolver<ContactInput, ContactData>(contactSchema), shouldFocusError: false })

  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [summary, setSummary] = useState<[string, string][]>([])
  const startedAt = useRef(0)
  const honeypot = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startedAt.current = clock()
  }, [])
  useEffect(() => {
    if (status.kind === 'success') successRef.current?.focus()
    if (status.kind === 'error') errorRef.current?.focus()
  }, [status.kind])
  useEffect(() => {
    if (summary.length > 0) summaryRef.current?.focus()
  }, [summary])

  const onInvalid = (errs: FieldErrors<ContactInput>) => setSummary(flatErrors(errs))

  const onValid = async () => {
    setSummary([])
    setStatus({ kind: 'submitting' })
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ data: getValues(), website: honeypot.current?.value ?? '', elapsedMs: clock() - startedAt.current }),
      })
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; fields?: Record<string, string> }
      if (res.ok && body.ok && body.reference) {
        setStatus({ kind: 'success', reference: body.reference })
        return
      }
      if (res.status === 400 && body.fields) {
        Object.entries(body.fields).forEach(([path, message]) => setError(path as keyof ContactInput, { type: 'server', message }))
        setStatus({ kind: 'idle' })
        setSummary(Object.entries(body.fields))
        return
      }
      throw new Error(`HTTP ${res.status}`)
    } catch {
      setStatus({ kind: 'error' })
    } finally {
      clearTimeout(timer)
    }
  }

  if (status.kind === 'success') {
    return (
      <div className="flex flex-col gap-4" aria-live="polite">
        <h3 ref={successRef} tabIndex={-1} className="text-h3 font-medium text-ink outline-none">
          Thank you. Your reference is <span className="tabular whitespace-nowrap">{status.reference}</span>.
        </h3>
        <p className="measure">
          We have emailed you a copy.{replyPromise && ` We reply within ${replyPromise}.`}
        </p>
      </div>
    )
  }

  const submitting = status.kind === 'submitting'

  return (
    <form noValidate onSubmit={(e) => handleSubmit(onValid, onInvalid)(e)} className="flex flex-col gap-6">
      {summary.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border-l-4 border-error bg-paper-50 p-4 outline-none">
          <h3 className="text-copy font-semibold text-ink">
            Please check {summary.length === 1 ? 'one field' : `${summary.length} fields`}
          </h3>
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

      <fieldset disabled={submitting} className="grid gap-6 md:grid-cols-2">
        <legend className="sr-only">Your message</legend>
        <Field name="name" label="Name" required error={errors.name?.message}>
          {(a) => <input {...a} {...register('name')} type="text" autoComplete="name" className={controlClass} />}
        </Field>
        <Field name="company" label="Company" required error={errors.company?.message}>
          {(a) => <input {...a} {...register('company')} type="text" autoComplete="organization" className={controlClass} />}
        </Field>
        <Field name="email" label="Email" required error={errors.email?.message}>
          {(a) => <input {...a} {...register('email')} type="email" autoComplete="email" className={controlClass} />}
        </Field>
        <Field name="phone" label="Phone" required error={errors.phone?.message}>
          {(a) => <input {...a} {...register('phone')} type="tel" autoComplete="tel" className={controlClass} />}
        </Field>
        <Field name="message" label="Message" required error={errors.message?.message} className="md:col-span-2">
          {(a) => <textarea {...a} {...register('message')} rows={5} maxLength={2000} className={controlClass} />}
        </Field>
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Website</label>
          <input ref={honeypot} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>

      {status.kind === 'error' && (
        <div ref={errorRef} tabIndex={-1} role="alert" className="border-l-4 border-error bg-paper-50 p-4 outline-none">
          <p>
            We could not send your message. Your details are still on this page. Please try again
            {whatsappNumber && whatsappDisplay && (
              <>
                , or message us on WhatsApp at{' '}
                <a
                  href={whatsappUrl(whatsappNumber, { token: 'WEB-CONTACT', subject: 'corrugated packaging' })}
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

      <p className="measure text-spec text-muted">
        Atharva Corrugations uses these details only to reply to your message. Read our{' '}
        <Link href={privacyHref} className="text-accent underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
      <div>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
              Sending…
            </>
          ) : (
            'Send message'
          )}
        </Button>
      </div>
    </form>
  )
}
