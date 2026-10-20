import type { Metadata } from 'next'
import Link from 'next/link'
import { FormatDrawing } from '@/components/illustration/FormatDrawing'
import { QuoteBand } from '@/components/sections/QuoteBand'
import { SpecTable } from '@/components/sections/SpecTable'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { familyEvidence } from '@/data/family-evidence'
import { quoteHref } from '@/data/navigation'
import { families, type Family } from '@/data/products'
import { gatedValue, getClaim, isRenderable } from '@/lib/claims'
import { evaluateMcb } from '@/lib/mcb'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Corrugated Packaging Products',
  description:
    'RSC and die-cut boxes, heavy-duty packs, sheets, pads, inserts, rolls and protective packaging from Ranjangaon MIDC, Pune. Request a quote.',
  alternates: { canonical: '/products' },
}

/**
 * Products hub (Sitemap §6.2). Every family appears here as an anchored
 * section; families that pass the minimum content bar also link to their
 * own page, the others live only here (folded, SD-01).
 */
export default function ProductsPage() {
  const phones = gatedValue('F-12')
  const whatsappHref = phones ? whatsappUrl(phones.whatsapp, contextForPath('/products')) : undefined

  return (
    <>
      <section data-surface="light" className="bg-paper-50 py-12 md:py-16">
        <div className="container-site flex flex-col gap-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
          <SectionHeader
            headline="Corrugated packaging products"
            headingLevel="h1"
            description="Five families of corrugated and protective packaging, each made to your size and specification. Choose a family, or tell us what you pack and we will suggest one."
          />
          <nav aria-label="Product families">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {families.map((f) => (
                <li key={f.slug}>
                  <a href={`#${f.slug}`} className="text-ui font-medium text-accent underline-offset-4 hover:underline">
                    {f.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section data-surface="light" className="bg-paper">
        <div className="container-site">
          {families.map((f) => (
            <FamilySection key={f.slug} family={f} />
          ))}
        </div>
      </section>

      <section data-surface="light" className="section-padding bg-paper-50">
        <div className="container-site flex flex-col gap-12">
          <ComparisonTable />
          <div className="flex flex-col items-start gap-4 border-l-4 border-accent pl-6">
            <h2 className="text-h3 font-medium text-ink">Not sure which fits?</h2>
            <p className="measure">Tell us what you are packing and how heavy it is. We will suggest a construction.</p>
            <Button href={`${quoteHref}?family=help`} variant="outline">
              Help me choose
            </Button>
          </div>
        </div>
      </section>

      <QuoteBand whatsappHref={whatsappHref} />
    </>
  )
}

function FamilySection({ family: f }: { family: Family }) {
  const mcb = evaluateMcb(f)
  const formatsShown = isRenderable(getClaim(f.formatsClaim))

  return (
    <article id={f.slug} aria-labelledby={`${f.slug}-title`} className="scroll-mt-24 border-b border-line py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <h2 id={`${f.slug}-title`} className="text-h2-sm font-normal text-ink lg:text-h2">
            {f.name}
          </h2>
          <Gated claim={f.formatsClaim}>
            <p className="measure text-lead">{f.summary}</p>
          </Gated>
          {mcb.applications.length > 0 && (
            <p className="text-spec">
              <span className="font-semibold text-ink">Used for: </span>
              {mcb.applications.join(', ')}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href={`${quoteHref}?family=${f.slug}`} data-event="product_cta_click" data-family={f.slug}>
              Request a quote
            </Button>
            {mcb.passes && (
              <Link href={`/products/${f.slug}`} className="nav-underline py-2 text-ui font-medium text-accent">
                {f.name}: full details <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-7">
          {formatsShown && (
            <div>
              <h3 className="text-label font-semibold text-muted uppercase">Formats</h3>
              <ul className="mt-3 grid gap-x-8 gap-y-4 md:grid-cols-2">
                {f.formats.map((x) => (
                  <li key={x.slug} className="flex flex-col gap-1">
                    <span className="text-copy font-medium text-ink">{x.name}</span>
                    <Gated claim="F-18-copy">
                      <span className="text-spec">{x.description}</span>
                    </Gated>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {formatsShown && f.formats.some((x) => x.drawing) && (
            <div className="grid max-w-xl grid-cols-2 gap-6">
              {f.formats
                .filter((x) => x.drawing)
                .map((x) => (
                  <FormatDrawing key={x.slug} drawing={x.drawing} />
                ))}
            </div>
          )}
          <SpecTable specs={familyEvidence[f.slug].specs} caption={`${f.name}: construction and board`} />
        </div>
      </div>
    </article>
  )
}

/**
 * Comparison table (Sitemap §6.2 P3): families by typical use, formats and
 * board. Columns with nothing confirmed are dropped, so the table narrows
 * rather than showing dashes. No customisation column: there is no
 * per-family evidence for one yet.
 */
function ComparisonTable() {
  const rows = families.map((f) => {
    const formatsOk = isRenderable(getClaim(f.formatsClaim))
    const board = familyEvidence[f.slug].specs.filter((s) => ['Ply', 'Flutes'].includes(s.label) && isRenderable(getClaim(s.claim)))
    return {
      family: f,
      use: evaluateMcb(f).applications.join(', '),
      formats: formatsOk ? f.formats.map((x) => x.name).join(', ') : '',
      board: board.map((s) => `${s.label}: ${s.render(getClaim(s.claim).value as never)}`).join('; '),
    }
  })
  const columns = (
    [
      { key: 'use', label: 'Typical use' },
      { key: 'formats', label: 'Formats' },
      { key: 'board', label: 'Board' },
    ] as const
  ).filter((c) => rows.some((r) => r[c.key]))
  if (columns.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader eyebrow="Compare" headline="Families side by side" />
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scroll region must be keyboard reachable (WCAG 2.1.1) */}
        <div className="relative min-w-0 overflow-x-auto" role="region" aria-label="Product families compared" tabIndex={0}>
          <table className="w-full min-w-[40rem] border-collapse text-left text-spec">
            <caption className="sr-only">Product families compared by typical use, formats and board</caption>
            <thead>
              <tr className="border-b border-line-ui">
                <th scope="col" className="py-3 pr-6 text-label font-semibold text-muted uppercase">
                  Family
                </th>
                {columns.map((c) => (
                  <th key={c.key} scope="col" className="py-3 pr-6 text-label font-semibold text-muted uppercase">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.family.slug} className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-6 font-medium text-ink">
                    <a href={`#${r.family.slug}`} className="underline-offset-4 hover:text-accent hover:underline">
                      {r.family.name}
                    </a>
                  </th>
                  {columns.map((c) => (
                    <td key={c.key} className="tabular py-4 pr-6">
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  )
}
