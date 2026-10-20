import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FormatDrawing } from '@/components/illustration/FormatDrawing'
import { FluteSection } from '@/components/illustration/drawings'
import { InternalDimensions } from '@/components/illustration/InternalDimensions'
import { QuoteBand } from '@/components/sections/QuoteBand'
import { SpecTable } from '@/components/sections/SpecTable'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { familyEvidence } from '@/data/family-evidence'
import { quoteHref } from '@/data/navigation'
import { families, familyBySlug, type Family } from '@/data/products'
import { gatedValue, getClaim, isRenderable } from '@/lib/claims'
import { evaluateMcb, familyHref } from '@/lib/mcb'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

/**
 * All five slugs are prerendered (Cache Components needs at least one); a
 * family that does not pass the minimum content bar prerenders as a 404 and
 * every link to it points at its section on the hub instead.
 */
export function generateStaticParams() {
  return families.map((f) => ({ family: f.slug }))
}

function launchedFamily(slug: string): Family | undefined {
  const f = familyBySlug(slug)
  return f && evaluateMcb(f).passes ? f : undefined
}

export async function generateMetadata({ params }: PageProps<'/products/[family]'>): Promise<Metadata> {
  const f = launchedFamily((await params).family)
  if (!f) return {}
  return { title: f.seo.title, description: f.seo.description, alternates: { canonical: `/products/${f.slug}` } }
}

const WHAT_WE_NEED = [
  'Internal dimensions in millimetres (length × width × height)',
  'What you pack and how much it weighs',
  'Quantity: add more than one if you want to compare prices',
  'Printing, if any',
  'Delivery place and the date you need it',
]

/** Product family template (Sitemap §6.3, F1–F9) */
export default async function FamilyPage({ params }: PageProps<'/products/[family]'>) {
  const f = launchedFamily((await params).family)
  if (!f) notFound()

  const { applications } = evaluateMcb(f)
  const ev = familyEvidence[f.slug]
  const phones = gatedValue('F-12')
  const whatsappHref = phones ? whatsappUrl(phones.whatsapp, contextForPath(`/products/${f.slug}`)) : undefined
  const quote = `${quoteHref}?family=${f.slug}`
  const processes = getClaim('F-29')
  const showPrinting = f.formatsClaim === 'F-18' && isRenderable(processes)
  const related = f.related.map((slug) => familyBySlug(slug)!)

  return (
    <>
      {/* F1 Header */}
      <section data-surface="light" className="bg-paper-50 py-12 md:py-16">
        <div className="container-site flex flex-col gap-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: f.name }]} />
          <SectionHeader eyebrow="Products" headline={f.name} headingLevel="h1" description={f.summary} />
          {applications.length > 0 && (
            <p className="measure text-spec">
              <span className="font-semibold text-ink">Used for: </span>
              {applications.join(', ')}
            </p>
          )}
          <div className="flex flex-col gap-3 md:flex-row">
            <Button href={quote} size="lg" data-event="product_cta_click" data-family={f.slug}>
              Request a quote
            </Button>
            {whatsappHref && (
              <Button
                href={whatsappHref}
                size="lg"
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp_click"
                data-location="family-header"
              >
                Chat on WhatsApp
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* F2 Formats */}
      <section data-surface="light" className="section-padding bg-paper">
        <div className="container-site flex flex-col gap-10">
          <SectionHeader eyebrow="Formats" headline="Styles we make" />
          <ul className="grid gap-12 md:grid-cols-2">
            {f.formats.map((x) => (
              <li key={x.slug} className="flex flex-col gap-3 border-t border-line pt-6">
                <FormatDrawing drawing={x.drawing} className="max-w-md" />
                <h3 className="text-h3 font-medium text-ink">{x.name}</h3>
                <Gated claim="F-18-copy">
                  <p className="measure">{x.description}</p>
                </Gated>
                <Link
                  href={`${quote}&format=${x.slug}`}
                  aria-label={`Quote for this style: ${x.name}`}
                  className="nav-underline self-start py-2 text-ui font-medium text-accent"
                  data-event="product_cta_click"
                  data-family={f.slug}
                >
                  Quote for this style <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* F3 Construction and board; F4 Printing and finishing */}
      <section id="construction" data-surface="dark" className="surface-dark surface-texture section-padding">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="Construction" headline="Board and construction" theme="dark" />
            <SpecTable specs={ev.specs} caption={`${f.name}: construction and board`} theme="dark" />
            {/* Board builds in section (Design §7.4 item 11): single and double wall
                follow the confirmed 3 and 5 ply (F-27); triple wall needs F-20 */}
            {f.formatsClaim === 'F-18' && (
              <Gated claim="F-27" as="div">
                <div className="flex flex-col gap-2">
                  <div className="grid max-w-2xl grid-cols-3 items-end gap-6">
                    <FluteSection wall="single" theme="dark" />
                    <FluteSection wall="double" theme="dark" />
                    <Gated claim="F-20" as="div">
                      <FluteSection wall="triple" theme="dark" />
                    </Gated>
                  </div>
                  <p className="text-spec text-on-dark-muted">Illustration: board in section, liners and fluted layers.</p>
                </div>
              </Gated>
            )}
            <Gated claim="F-21">
              <Gated claim="F-18-copy">
                <details className="max-w-2xl border-y border-line-dark py-3">
                  <summary className="flex min-h-11 cursor-pointer items-center text-ui font-medium text-on-dark">
                    Which flute? A plain-language guide
                  </summary>
                  <dl className="flex flex-col gap-3 pt-2 pb-4 text-spec">
                    <div>
                      <dt className="font-semibold text-on-dark">A flute</dt>
                      <dd>The tallest common flute. Most cushioning and good stacking strength.</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-on-dark">B flute</dt>
                      <dd>Lower and finer. A flatter surface for print and good resistance to crushing.</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-on-dark">C flute</dt>
                      <dd>Between A and B. A common all-round choice for shipping boxes.</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-on-dark">BC (double wall)</dt>
                      <dd>B and C together. More strength for heavier contents and taller stacks.</dd>
                    </div>
                    <p className="text-on-dark-muted">General guidance. Tell us what you pack and we will recommend the build.</p>
                  </dl>
                </details>
              </Gated>
            </Gated>
          </div>
          {showPrinting && (
            <div className="flex flex-col gap-6">
              <SectionHeader eyebrow="Printing" headline="Printing and finishing" theme="dark" />
              <ul className="flex flex-col gap-2 text-on-dark-body">
                {processes.value.printing.map((p) => (
                  <li key={p}>{p}</li>
                ))}
                <Gated claim="F-29-varnish">{(v) => <li>{v}, through partners</li>}</Gated>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* F5 Applications (the client's own mapping, nothing added) and F6 What we need */}
      <section data-surface="light" className="section-padding bg-paper">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          {applications.length > 0 && (
            <div className="flex flex-col gap-6">
              <SectionHeader eyebrow="Applications" headline="What it is used for" />
              <ul className="grid grid-cols-1 border-t border-line md:grid-cols-2">
                {applications.map((a) => (
                  <li key={a} className="border-b border-line py-3 text-copy text-ink">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="Quotes" headline="What we need to quote" />
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {WHAT_WE_NEED.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <InternalDimensions className="max-w-sm" />
          </div>
        </div>
      </section>

      {/* F7 Photographs: added when approved photographs exist; none yet, so no strip (Sitemap §1.2) */}

      {/* F8 Related */}
      <section data-surface="light" className="section-padding bg-paper-50">
        <div className="container-site flex flex-col gap-8">
          <h2 className="text-label font-semibold text-muted uppercase">Related packaging</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug} className="relative border-t border-line pt-4">
                <h3 className="text-h3 font-medium text-ink">
                  <Link href={familyHref(r)} className="after:absolute after:inset-0">
                    {r.name}
                  </Link>
                </h3>
                <Gated claim={r.formatsClaim}>
                  <p className="text-spec">{r.summary}</p>
                </Gated>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* F9 Quote band */}
      <QuoteBand whatsappHref={whatsappHref} quoteLink={quote} />
    </>
  )
}
