import type { Metadata } from 'next'
import { CompanyGroup } from '@/components/sections/CompanyGroup'
import { FamilyIndex } from '@/components/sections/FamilyIndex'
import { HeroA } from '@/components/sections/HeroA'
import { IndustryGrid } from '@/components/sections/IndustryGrid'
import { ManufacturingQuality } from '@/components/sections/ManufacturingQuality'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { QuoteBand } from '@/components/sections/QuoteBand'
import { SpecialisedPackaging } from '@/components/sections/SpecialisedPackaging'
import { TrustRow } from '@/components/sections/TrustRow'
import { gatedValue } from '@/lib/claims'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * Home (Sitemap §6.1). Rhythm: hero dark → families white → process
 * slate-50 → industries white → manufacturing dark → specialised white →
 * trust slate-50 → company white → quote band dark → footer dark. H6 and H7
 * render only with evidence; without them this is the reduced homepage
 * (Strategy §6 trust-floor fallback) and the rhythm still holds.
 */
export default function Home() {
  const phones = gatedValue('F-12')
  const whatsappHref = phones ? whatsappUrl(phones.whatsapp, contextForPath('/')) : undefined

  return (
    <>
      <HeroA whatsappHref={whatsappHref} strip="plate" />
      <FamilyIndex />
      <ProcessSteps />
      <IndustryGrid />
      <ManufacturingQuality />
      <SpecialisedPackaging />
      <TrustRow />
      <CompanyGroup />
      <QuoteBand whatsappHref={whatsappHref} />
    </>
  )
}
