import Link from 'next/link'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TitleBlock, cell } from '@/components/ui/TitleBlock'
import { getClaim, getClaimsMode, isRenderable } from '@/lib/claims'
import { cn } from '@/lib/utils'
import type { ClaimsMode } from '@/types/claims'

const boardCells = [
  cell('F-20', 'Board', (ply) => `${ply[0]} to ${ply[ply.length - 1]} ply`),
  cell('F-23', 'Paper', ([lo, hi]) => `${lo} to ${hi} GSM`),
  cell('F-24', 'Reel width', (mm) => `Up to ${mm.toLocaleString('en-IN')} mm`),
]

interface CapabilityGroup {
  title: string
  items: string[]
}

/**
 * What the plant can do, grouped by stage, for buyers checking fit. Built
 * from claims, so unverified groups drop out at launch. Varnish and coating
 * stay honest as "through partners" (owner decision 2026-10-20: no
 * in-house/partner matrix on the homepage).
 */
export function capabilityGroups(mode: ClaimsMode): CapabilityGroup[] {
  const processes = getClaim('F-29')
  const checks = getClaim('F-38')
  const varnish = getClaim('F-29-varnish')
  const groups: CapabilityGroup[] = []
  if (isRenderable(processes, mode)) {
    const p = processes.value
    groups.push({ title: 'Converting', items: p.converting })
    groups.push({
      title: 'Printing and finishing',
      items: [...p.printing, ...(isRenderable(varnish, mode) ? [`${varnish.value}, through partners`] : [])],
    })
    groups.push({ title: 'Protection', items: p.protection })
  }
  if (isRenderable(checks, mode)) groups.push({ title: 'Quality checks', items: checks.value })
  return groups
}

/**
 * Manufacturing and quality (Sitemap §6.1 H5): prove capability with
 * evidence, not adjectives. Full-bleed split on ink with the dashed crease
 * divider. The right half holds a production photograph once one exists;
 * until then, the capability groups. With nothing verified on the right,
 * the left half stands alone.
 */
export function ManufacturingQuality({ mode }: { mode?: ClaimsMode }) {
  const m = mode ?? getClaimsMode()
  const groups = capabilityGroups(m)

  return (
    <section data-surface="dark" className="surface-dark surface-texture">
      <div className={cn('container-site grid', groups.length > 0 && 'lg:grid-cols-2')}>
        <div className={cn('flex flex-col gap-8 py-[72px] md:py-24 lg:py-[120px] lg:pr-12', groups.length > 0 && 'pb-12 md:pb-12')}>
          <SectionHeader
            eyebrow="Manufacturing & quality"
            headline="One plant. Design and conversion at Ranjangaon MIDC."
            theme="dark"
          />
          <TitleBlock cells={boardCells} max={3} theme="dark" mode={m} />
          <ul className="flex flex-col gap-3 text-copy">
            <Gated claim="F-39" mode={m}>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-3.5 h-0.5 w-3 shrink-0 bg-accent-on-dark" />
                Our customers audit and approve our plant.
              </li>
            </Gated>
            <Gated claim="F-40" mode={m}>
              {(iso) => (
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-3.5 h-0.5 w-3 shrink-0 bg-accent-on-dark" />
                  {iso.standard} certified quality management.
                </li>
              )}
            </Gated>
          </ul>
          <Link
            href="/manufacturing-and-quality"
            className="nav-underline self-start py-2 text-ui font-medium text-accent-on-dark"
          >
            See the plant and process <span aria-hidden="true">→</span>
          </Link>
        </div>

        {groups.length > 0 && (
          <div className="relative pt-12 pb-[72px] md:pb-24 lg:py-[120px] lg:pl-12">
            {/* the Crease Mark at architectural scale: a dashed fold line */}
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 left-0 border-t border-dashed border-accent-on-dark lg:top-0 lg:right-auto lg:bottom-0 lg:left-0 lg:border-t-0 lg:border-l"
            />
            <h3 className="sr-only">What our plant does</h3>
            <div className="grid gap-10 md:grid-cols-2">
              {groups.map((g) => (
                <div key={g.title} className="flex flex-col gap-3">
                  <h4 className="text-label font-semibold text-on-dark-muted uppercase">{g.title}</h4>
                  <ul className="flex flex-col gap-2 text-spec text-on-dark-body">
                    {g.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
