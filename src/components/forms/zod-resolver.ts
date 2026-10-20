import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import type { ZodType } from 'zod'

/** zod → react-hook-form resolver: nested error paths become nested errors */
export function zodResolver<In extends FieldValues, Out>(schema: ZodType<Out, In>): Resolver<In, unknown, Out> {
  return async (values) => {
    const result = await schema.safeParseAsync(values)
    if (result.success) return { values: result.data, errors: {} }
    const errors: Record<string, unknown> = {}
    for (const issue of result.error.issues) {
      let node = errors
      issue.path.forEach((key, i) => {
        const k = String(key)
        if (i === issue.path.length - 1) node[k] ??= { type: issue.code, message: issue.message }
        else node = (node[k] ??= {}) as Record<string, unknown>
      })
    }
    return { values: {}, errors: errors as FieldErrors<In> }
  }
}

/** Flatten nested errors into [path, message] pairs for an error summary */
export function flatErrors(errors: FieldErrors, prefix = ''): [string, string][] {
  return Object.entries(errors).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (!value || typeof value !== 'object') return []
    if ('message' in value && typeof value.message === 'string') return [[path, value.message] as [string, string]]
    return flatErrors(value as FieldErrors, path)
  })
}
