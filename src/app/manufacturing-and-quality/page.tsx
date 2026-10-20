import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { capabilityGroups } from '@/components/sections/ManufacturingQuality'
import { QuoteBand } from '@/components/sections/QuoteBand'
import { EcoVadisCard, IsoCertificateCard } from '@/components/sections/CertificateCard'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TitleBlock, cell } from '@/components/ui/TitleBlock'
import { getClaim, getClaimsMode, gatedValue, isRenderable, reviewAttrs } from '@/lib/claims'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Manufacturing & Quality',
  description: 'One plant at Ranjangaon MIDC, Pune: how we make corrugated packaging and how we check it.',
  alternates: { canonical: '/manufacturing-and-quality' },
}

const overview = [
  cell('F-05', 'Location', (a) => `${a.line2.split(',')[0]}, ${a.city}`),
  cell('F-04', 'Plants', (n) => n),
  cell('F-03', 'Operating since', (y) => y),
]

/**
 * Manufacturing and Quality (Sitemap §6.6): lets a sceptical procurement
 * manager check the plant. Area, capacity and team size never appear
 * (restricted, C-10). Capabilities are grouped by stage, not shown as an
 * in-house/partner matrix (owner decision 2026-10-20, carried over from the
 * homepage). Sections degrade to confirmed content (Sitemap §1.2).
 */
export default function ManufacturingQualityPage() {
  const mode = getClaimsMode()
  const groups = capabilityGroups(mode)
  const practices = gatedValue('F-38')
  const processes = getClaim('F-29')
  const flowReady = practices && isRenderable(processes, mode)
  const phones = gatedValue('F-12')
  const whatsappHref = phones ? whatsappUrl(phones.whatsapp, contextForPath('/manufacturing-and-quality')) : undefined

  // M4 Process flow, only from confirmed steps; no invented stages
  const flow = flowReady
    ? [
        { title: 'Incoming paper inspection', body: 'Paper is checked for GSM and moisture before use.' },
        { title: 'Printing', body: processes.value.printing.join(', ') },
        { title: 'Converting', body: processes.value.converting.join(', ') },
        { title: 'Final inspection', body: 'Finished packs are checked before dispatch.' },
      ]
    : []

  return (
    <>
      {/* M1, M2 */}
      <PageHeader
        title="Manufacturing and quality"
        eyebrow="Manufacturing & quality"
        description="How we make corrugated packaging at our plant in Ranjangaon MIDC, Pune, and how we check it."
      >
        <TitleBlock cells={overview} max={3} className="max-w-3xl" />
      </PageHeader>

      {/* M3 What the plant does */}
      {groups.length > 0 && (
        <section id="capabilities" data-surface="dark" className="surface-dark surface-texture section-padding">
          <div className="container-site flex flex-col gap-10">
            <SectionHeader eyebrow="Capabilities" headline="What our plant does" theme="dark" />
            <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
              {groups.map((g) => (
                <div key={g.title} className="flex flex-col gap-3 border-t border-dashed border-accent-on-dark pt-4" {...reviewAttrs(g.source, mode)}>
                  <h3 className="text-label font-semibold text-on-dark-muted uppercase">{g.title}</h3>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-spec md:flex md:flex-col">
                    {g.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* M4 Process flow */}
      {flow.length > 0 && (
        <section id="process" data-surface="light" className="section-padding bg-paper">
          <div className="container-site flex flex-col gap-10">
            <SectionHeader eyebrow="Process" headline="How an order moves through the plant" />
            <ol className="grid gap-0 border-t border-line md:grid-cols-4" {...reviewAttrs(processes, mode)}>
              {flow.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-2 border-b border-line py-6 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0">
                  <span aria-hidden="true" className="tabular text-spec font-semibold text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-copy font-semibold text-ink">{s.title}</h3>
                  <p className="text-spec">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* M5 Quality and M6 certificates and ratings (verified only) */}
      <section id="quality" data-surface="light" className="section-padding bg-paper-50">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="Quality" headline="How we check our work" />
            <Gated claim="F-39">
              <p className="measure border-l-4 border-accent pl-4 text-lead text-ink">
                Our customers audit and approve our plant.
              </p>
            </Gated>
            <div className="grid gap-6 md:grid-cols-2">
              <IsoCertificateCard />
              <EcoVadisCard />
            </div>
          </div>
          {practices && (
            <Gated claim="F-38" as="div">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 md:gap-x-8">
                {practices.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Gated>
          )}
        </div>
      </section>

      {/* M7 Sustainability (collapsing): general statements only, no percentages, no FSC/PEFC/WRAP */}
      <Gated claim="F-44">
        {(statements) => (
          <section id="sustainability" data-surface="light" className="section-padding bg-paper">
            <div className="container-site flex flex-col gap-6">
              <SectionHeader eyebrow="Sustainability" headline="Material and recycling" />
              <ul className="measure flex flex-col gap-2">
                {statements.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </Gated>

      {/* M8 Photographs: added when approved photographs exist */}

      {/* M9 */}
      <QuoteBand whatsappHref={whatsappHref} />
    </>
  )
}
