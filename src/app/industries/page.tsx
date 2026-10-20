import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuoteBand } from '@/components/sections/QuoteBand'
import { Button } from '@/components/ui/Button'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { alsoServing, topIndustries, type Industry } from '@/data/industries'
import { quoteHref } from '@/data/navigation'
import { familyBySlug } from '@/data/products'
import { gatedValue } from '@/lib/claims'
import { familyHref } from '@/lib/mcb'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Corrugated Packaging by Industry',
  description: 'Corrugated packaging for white goods, engineering goods, FMCG and pharma, from our Ranjangaon MIDC plant.',
  alternates: { canonical: '/industries' },
}

/**
 * Industries (Sitemap §6.4): one page, four anchored sections. What is
 * packed comes from the client's own mapping only; considerations are
 * general guidance behind the technical review; no compliance wording.
 */
export default function IndustriesPage() {
  const phones = gatedValue('F-12')
  const whatsappHref = phones ? whatsappUrl(phones.whatsapp, contextForPath('/industries')) : undefined

  return (
    <>
      <PageHeader
        title="Corrugated packaging by industry"
        eyebrow="Industries"
        description="The sectors we make packaging for, what they pack, and which of our packaging families they use."
      >
        <nav aria-label="Industries on this page">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {topIndustries.map((i) => (
              <li key={i.slug}>
                <a href={`#${i.slug}`} className="text-ui font-medium text-accent underline-offset-4 hover:underline">
                  {i.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Gated claim="F-46">
        <div data-surface="light" className="bg-paper">
          <div className="container-site">
            {topIndustries.map((i) => (
              <IndustrySection key={i.slug} industry={i} />
            ))}
          </div>
        </div>
      </Gated>

      <Gated claim="F-45">
        <section data-surface="light" className="section-padding bg-paper-50">
          <div className="container-site flex flex-col gap-6">
            <SectionHeader eyebrow="Also serving" headline="Other industries we supply" />
            <ul className="grid grid-cols-1 border-t border-line md:grid-cols-2 lg:grid-cols-3">
              {alsoServing.map((a) => (
                <li key={a} className="border-b border-line py-3 text-copy text-ink">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Gated>

      <QuoteBand whatsappHref={whatsappHref} />
    </>
  )
}

function IndustrySection({ industry: i }: { industry: Industry }) {
  const mapping = gatedValue('F-27') ?? []
  // "HRSC" stays out of public copy until the client explains it (Q-17)
  const packed = i.mappingRows
    .map((r) => mapping[r])
    .filter(Boolean)
    .map((row) => `${row.format.replace('/HRSC', '')}${row.ply.length ? `, ${row.ply.join(' and ')} ply` : ''}`)
  const families = i.families.map((s) => familyBySlug(s)!)

  return (
    <section id={i.slug} aria-labelledby={`${i.slug}-title`} className="scroll-mt-24 border-b border-line py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <h2 id={`${i.slug}-title`} className="text-h2-sm font-normal text-ink lg:text-h2">
            {i.name}
          </h2>
          <Gated claim="F-18-copy">
            <p className="measure text-lead">{i.considerations}</p>
          </Gated>
          <div className="pt-2">
            <Button href={quoteHref} variant="outline">
              Request a quote
            </Button>
          </div>
        </div>
        <dl className="grid content-start gap-6 md:grid-cols-2 lg:col-span-7">
          <div className="flex flex-col gap-2 border-t border-line pt-4">
            <dt className="text-label font-semibold text-muted uppercase">What we make for it</dt>
            <dd>{packed.length > 0 ? packed.join('; ') : 'Corrugated boxes made to your specification.'}</dd>
          </div>
          <div className="flex flex-col gap-2 border-t border-line pt-4">
            <dt className="text-label font-semibold text-muted uppercase">Packaging families</dt>
            <dd>
              <ul className="flex flex-col gap-1">
                {families.map((f) => (
                  <li key={f.slug}>
                    <Link href={familyHref(f)} className="text-accent underline-offset-4 hover:underline">
                      {f.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
