import { getClaim, getClaimsMode, isRenderable } from '@/lib/claims'
import type { ClaimsMode } from '@/types/claims'
import { EcoVadisCard, IsoCertificateCard } from './CertificateCard'

/**
 * Trust and recognition (Sitemap §6.1 H7): certificate and rating cards on
 * slate-50, verified items only. If none remain, the whole section is
 * omitted. Recognition letters and customer logos join once permissions
 * exist (Q-16).
 */
export function TrustRow({ mode }: { mode?: ClaimsMode }) {
  const m = mode ?? getClaimsMode()
  const any = isRenderable(getClaim('F-40'), m) || isRenderable(getClaim('F-42'), m)
  if (!any) return null

  return (
    <section data-surface="light" className="section-padding bg-paper-50">
      <div className="container-site flex flex-col gap-8">
        <h2 className="text-label font-semibold text-muted uppercase">Certificates and ratings</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <IsoCertificateCard mode={m} />
          <EcoVadisCard mode={m} />
        </div>
      </div>
    </section>
  )
}
