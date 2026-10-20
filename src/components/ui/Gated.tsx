import { cloneElement, isValidElement, type ReactNode } from 'react'
import { claims, type ClaimId, type ClaimValue } from '@/data/claims'
import { getClaimsMode, isPublishable, isRenderable, statusOf } from '@/lib/claims'
import type { ClaimsMode } from '@/types/claims'

interface GatedProps<K extends ClaimId> {
  claim: K
  children: ReactNode | ((value: ClaimValue<K>) => ReactNode)
  /** Wrapper element for the review marker; match the children's flow */
  as?: 'span' | 'div'
  /** Override for tests; defaults to the environment */
  mode?: ClaimsMode
}

/**
 * Renders its children only when the claim may appear (Technical plan §4.3).
 * Production: confirmed claims only, otherwise nothing at all (never a
 * placeholder, Sitemap §1.2). Preview and development: unconfirmed claims
 * are marked for the client review (outlined; listed on /review).
 */
export function Gated<K extends ClaimId>({ claim: id, children, as: Tag = 'span', mode }: GatedProps<K>) {
  const resolvedMode = mode ?? getClaimsMode()
  const c = claims[id]
  if (!isRenderable(c, resolvedMode)) return null

  const content = typeof children === 'function' ? children(c.value as ClaimValue<K>) : children

  // Review marker (preview and development), outlined by globals.css. A single
  // DOM element carries the marker itself, so lists and tables keep valid
  // children; anything else gets a `display: contents` wrapper, which keeps
  // the layout exactly as in production
  if (resolvedMode !== 'production' && !isPublishable(c)) {
    const marker = { 'data-review-claim': id, 'data-claim-status': statusOf(c) }
    if (isValidElement(content) && typeof content.type === 'string') return cloneElement(content, marker)
    return (
      <Tag {...marker} className="contents">
        {content}
      </Tag>
    )
  }

  return <>{content}</>
}
