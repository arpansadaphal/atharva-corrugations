import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Form field primitives (Design §8 RfqForm, §14): labels always visible
 * above the control, bottom-border controls in --line-ui (4.76:1), errors
 * in text with an icon-free marker, linked through aria-describedby.
 */

export const fieldId = (name: string) => `rfq-${name.replace(/\./g, '-')}`

export const controlClass =
  'block min-h-11 w-full rounded-none border-0 border-b-2 border-line-ui bg-transparent px-0 py-2 text-copy text-ink placeholder:text-muted focus:border-accent aria-[invalid=true]:border-error disabled:opacity-60'

interface FieldProps {
  name: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: (aria: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
  className?: string
}

export function Field({ name, label, required, hint, error, children, className }: FieldProps) {
  const id = fieldId(name)
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-spec font-medium text-ink">
        {label}
        {required && <span className="font-normal text-muted"> (required)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-spec text-muted">
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  )
}

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-spec font-medium text-error">
      <span aria-hidden="true">✕ </span>
      {children}
    </p>
  )
}

export function Choice({
  type,
  label,
  ...input
}: { type: 'radio' | 'checkbox'; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-copy text-ink">
      <input type={type} className="size-5 shrink-0 accent-accent" {...input} />
      {label}
    </label>
  )
}
