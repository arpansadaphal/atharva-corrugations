import type { TitleBlockCell } from '@/components/ui/TitleBlock'
import { getClaim, getClaimsMode, isRenderable } from '@/lib/claims'
import type { ClaimsMode } from '@/types/claims'

/**
 * Construction and board table (Sitemap §6.3 F3): one row per confirmed
 * field, real table semantics, tabular numerals. Renders nothing when no
 * field is confirmed.
 */
export function SpecTable({ specs, caption, mode }: { specs: TitleBlockCell[]; caption: string; mode?: ClaimsMode }) {
  const m = mode ?? getClaimsMode()
  const rows = specs.filter((s) => isRenderable(getClaim(s.claim), m))
  if (rows.length === 0) return null
  return (
    <table className="w-full max-w-2xl border-collapse text-left text-copy">
      <caption className="sr-only">{caption}</caption>
      <tbody className="border-t border-line">
        {rows.map((s) => (
          <tr key={`${s.claim}-${s.label}`} className="border-b border-line">
            <th scope="row" className="w-40 py-3 pr-6 align-top text-label font-semibold text-muted uppercase">
              {s.label}
            </th>
            <td className="tabular py-3 text-ink">{s.render(getClaim(s.claim).value as never)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
