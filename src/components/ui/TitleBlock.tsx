import type { ReactNode } from 'react'
import { claims, type ClaimId, type ClaimValue } from '@/data/claims'
import { getClaimsMode, isPublishable, isRenderable, statusOf } from '@/lib/claims'
import { cn } from '@/lib/utils'
import type { ClaimsMode } from '@/types/claims'

export interface TitleBlockCell {
  claim: ClaimId
  label: string
  render: (value: never) => ReactNode
}

/** Typed cell builder: the render function receives the claim's own value type. */
export function cell<K extends ClaimId>(
  claim: K,
  label: string,
  render: (value: ClaimValue<K>) => ReactNode,
): TitleBlockCell {
  return { claim, label, render: render as (value: never) => ReactNode }
}

interface TitleBlockProps {
  cells: TitleBlockCell[]
  /** Render nothing below this many cells (e.g. hero strip ≥ 3) */
  min?: number
  /** At most this many cells are shown (2–4, Design §7.2) */
  max?: 2 | 3 | 4
  theme?: 'light' | 'dark'
  /** 'sm' for a title block set inside a drawing sheet */
  size?: 'md' | 'sm'
  mode?: ClaimsMode
  className?: string
}

/**
 * TitleBlock (Design §7.2): key–value grid with hairline rules, no fills,
 * no radius, tabular numerals. Renders only cells whose claims may appear,
 * so it narrows gracefully instead of showing holes.
 */
export function TitleBlock({ cells, min = 1, max = 4, theme = 'light', size = 'md', mode, className }: TitleBlockProps) {
  const resolvedMode = mode ?? getClaimsMode()
  const visible = cells.filter((c) => isRenderable(claims[c.claim], resolvedMode)).slice(0, max)
  if (visible.length < min) return null

  const isDark = theme === 'dark'
  // One row from 768 px; inside a drawing sheet ('sm') the column is narrow,
  // so it stays 2×2 until 1440 px
  const wide = size === 'sm' ? 'xl' : 'md'
  const cols = {
    md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' },
    xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' },
  }[wide][visible.length as 1 | 2 | 3 | 4]
  const rowRules = {
    md: { left: 'md:border-l md:pl-4', noTop: 'md:border-t-0' },
    xl: { left: 'xl:border-l xl:pl-4', noTop: 'xl:border-t-0' },
  }[wide]

  return (
    <dl
      className={cn(
        'grid grid-cols-2 border-t',
        cols,
        isDark ? 'border-line-dark' : 'border-line',
        className,
      )}
    >
      {visible.map((c, i) => {
        const claim = claims[c.claim]
        const flagged = resolvedMode === 'development' && !isPublishable(claim)
        return (
          <div
            key={c.claim}
            data-claim={flagged ? c.claim : undefined}
            title={flagged ? `${c.claim} · ${statusOf(claim)} — hidden at launch unless verified` : undefined}
            className={cn(
              'flex flex-col gap-1 pr-4',
              size === 'sm' ? 'py-3' : 'py-4',
              // hairline between cells: every cell after the first in its row
              i % 2 === 1 && 'border-l pl-4',
              i > 0 && rowRules.left,
              i > 1 && ['border-t', rowRules.noTop],
              isDark ? 'border-line-dark' : 'border-line',
              flagged && 'outline-2 -outline-offset-2 outline-dashed outline-kraft-400',
            )}
          >
            <dt className={cn('text-label font-semibold uppercase', isDark ? 'text-on-dark-muted' : 'text-muted')}>
              {c.label}
            </dt>
            <dd className={cn('tabular font-medium', size === 'sm' ? 'text-spec' : 'text-value', isDark ? 'text-on-dark' : 'text-ink')}>
              {c.render(claim.value as never)}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
