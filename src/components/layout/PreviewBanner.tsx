import { getClaimsMode, unverifiedCount } from '@/lib/claims'

/**
 * Staging only (Technical plan §4.3): tells the client reviewer how many
 * registry claims are still unverified and will be removed at launch.
 */
export function PreviewBanner() {
  if (getClaimsMode() !== 'preview') return null
  const n = unverifiedCount()
  if (n === 0) return null

  return (
    <div role="status" className="bg-kraft-200 text-ink">
      <p className="container-site py-2 text-spec">
        Preview: {n} {n === 1 ? 'claim in the registry is' : 'claims in the registry are'} unverified. Any shown
        here will be removed at launch unless evidence arrives.
      </p>
    </div>
  )
}
