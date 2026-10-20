import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { IsoCertificateCard } from '@/components/sections/CertificateCard'
import { FamilyIndex } from '@/components/sections/FamilyIndex'
import { HeroA } from '@/components/sections/HeroA'
import { IndustryGrid } from '@/components/sections/IndustryGrid'
import { ManufacturingQuality } from '@/components/sections/ManufacturingQuality'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { QuoteBand } from '@/components/sections/QuoteBand'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { gatedValue, getClaimsMode } from '@/lib/claims'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Homepage components (G2)',
  robots: { index: false, follow: false },
}

function CompLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="border-y border-line bg-kraft-200">
      <p className="container-site py-2 text-spec text-ink">
        <span className="font-semibold">{id}</span> · {children}
      </p>
    </div>
  )
}

/**
 * Gate G2 review page (dev and preview only): the hero and the homepage
 * components in code, for owner approval before the homepage is assembled.
 */
export default function HomeComponentsPage() {
  // internal design reference: `next dev` only, never on a review or live build
  if (getClaimsMode() !== 'development') notFound()
  const phones = gatedValue('F-12')
  const wa = phones ? whatsappUrl(phones.whatsapp, contextForPath('/')) : undefined

  return (
    <>
      <section className="py-12">
        <div className="container-site">
          <SectionHeader
            eyebrow="Gate G2"
            headline="Homepage components for approval"
            headingLevel="h1"
            description="Hero A and the components from Design §8, built with real tokens and gated content. Section order and rhythm are decided when the homepage is assembled."
          />
        </div>
      </section>

      <CompLabel id="H1 · Hero A, variant 1">Capability strip in the drawing&rsquo;s title-block corner (Design §9)</CompLabel>
      <HeroA whatsappHref={wa} strip="plate" headingLevel="h2" />

      <CompLabel id="H1 · Hero A, variant 2">Capability strip at the base of the copy (Sitemap §6.1)</CompLabel>
      <HeroA whatsappHref={wa} strip="copy" headingLevel="h2" />

      <CompLabel id="H2 · Family index">Specification index rows, not cards</CompLabel>
      <FamilyIndex />

      <CompLabel id="H3 · Process steps">Numbered sequence with a hairline joiner</CompLabel>
      <ProcessSteps />

      <CompLabel id="H4 · Industries">2×2 hairline grid, client&rsquo;s four industries</CompLabel>
      <IndustryGrid />

      <CompLabel id="H5 · Manufacturing and quality, preview">What the plant does, grouped by stage (replaces the in-house/partner matrix)</CompLabel>
      <ManufacturingQuality mode="preview" />

      <CompLabel id="H5 · Manufacturing and quality, at launch today">Only confirmed claims: the capability groups wait for the machinery list and QA documents</CompLabel>
      <ManufacturingQuality mode="production" />

      <section className="section-padding bg-paper-50">
        <div className="container-site">
          <IsoCertificateCard />
        </div>
      </section>

      <CompLabel id="H9 · Quote band">The only content section with WhatsApp green</CompLabel>
      <QuoteBand whatsappHref={wa} />
    </>
  )
}
