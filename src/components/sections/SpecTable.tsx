import type { TitleBlockCell } from '@/components/ui/TitleBlock'
import { getClaim, getClaimsMode, isRenderable, reviewAttrs } from '@/lib/claims'
import type { ClaimsMode } from '@/types/claims'

/**
 * Construction and board table (Sitemap §6.3 F3): one row per confirmed
 * field, real table semantics, tabular numerals. Renders nothing when no
 * field is confirmed.
 */
export function SpecTable({
  specs,
  caption,
  mode,
  theme = 'light',
}: {
  specs: TitleBlockCell[]
  caption: string
  mode?: ClaimsMode
  theme?: 'light' | 'dark'
}) {
  const m = mode ?? getClaimsMode()
  const rows = specs.filter((s) => isRenderable(getClaim(s.claim), m))
  if (rows.length === 0) return null
  const dark = theme === 'dark'
  return (
    <table className="w-full max-w-2xl border-collapse text-left text-copy">
      <caption className="sr-only">{caption}</caption>
      <tbody className={dark ? 'border-t border-line-dark' : 'border-t border-line'}>
        {rows.map((s) => (
          <tr key={`${s.claim}-${s.label}`} className={dark ? 'border-b border-line-dark' : 'border-b border-line'} {...reviewAttrs(getClaim(s.claim), m)}>
            <th scope="row" className={`w-40 py-3 pr-6 align-top text-label font-semibold uppercase ${dark ? 'text-on-dark-muted' : 'text-muted'}`}>
              {s.label}
            </th>
            <td className={`tabular py-3 ${dark ? 'text-on-dark' : 'text-ink'}`}>{s.render(getClaim(s.claim).value as never)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
