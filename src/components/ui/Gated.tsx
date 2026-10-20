import type { ReactNode } from 'react'
import { claims, type ClaimId, type ClaimValue } from '@/data/claims'
import { getClaimsMode, isPublishable, isRenderable, statusOf } from '@/lib/claims'
import type { ClaimsMode } from '@/types/claims'

interface GatedProps<K extends ClaimId> {
  claim: K
  children: ReactNode | ((value: ClaimValue<K>) => ReactNode)
  /** Wrapper element for the development outline; match the children's flow */
  as?: 'span' | 'div'
  /** Override for tests; defaults to the environment */
  mode?: ClaimsMode
}

/**
 * Renders its children only when the claim may appear (Technical plan §4.3).
 * Production: confirmed claims only, otherwise nothing at all (never a
 * placeholder, Sitemap §1.2). Development: unverified claims are outlined
 * with their ID and status so they are easy to spot.
 */
export function Gated<K extends ClaimId>({ claim: id, children, as: Tag = 'span', mode }: GatedProps<K>) {
  const resolvedMode = mode ?? getClaimsMode()
  const c = claims[id]
  if (!isRenderable(c, resolvedMode)) return null

  const content = typeof children === 'function' ? children(c.value as ClaimValue<K>) : children

  if (resolvedMode === 'development' && !isPublishable(c)) {
    return (
      <Tag
        data-claim={id}
        data-claim-status={statusOf(c)}
        title={`${id} · ${statusOf(c)} — hidden at launch unless verified`}
        className="outline-2 outline-offset-2 outline-dashed outline-kraft-400"
      >
        {content}
      </Tag>
    )
  }

  return <>{content}</>
}
