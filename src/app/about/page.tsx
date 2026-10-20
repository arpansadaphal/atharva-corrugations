import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { group } from '@/group/group'
import { gatedValue, getClaim, getClaimsMode, isRenderable, reviewAttrs } from '@/lib/claims'
import { formatPhone, telHref } from '@/lib/format'

export const metadata: Metadata = {
  title: 'About Atharva Corrugations',
  description: 'Operating since 2014 from Ranjangaon MIDC, Pune. Part of the Atharva Group.',
  alternates: { canonical: '/about' },
}

/**
 * About (Sitemap §6.7): who is behind the plant, with the Group prominent.
 * Confirmed facts only; no vision, mission or values (none supplied, none
 * written for the client); no founder quotations or biographies; no
 * revenue milestones, ever (F-53).
 */
export default function AboutPage() {
  const mode = getClaimsMode()
  const office = group['F-08'].value
  const founders = group['F-09']
  const since = gatedValue('F-03')
  const phones = gatedValue('F-12')
  // 2014 is confirmed (F-03); the later milestones are their own claims
  const later = (['F-52-tape', 'F-52-expansion'] as const).flatMap((id) => {
    const c = getClaim(id)
    return isRenderable(c, mode) ? [{ ...c.value, review: reviewAttrs(c, mode) }] : []
  })
  const milestones = [...(since ? [{ year: since, text: 'Operations started at our Ranjangaon MIDC plant.', review: {} }] : []), ...later]

  return (
    <>
      {/* A1 */}
      <PageHeader title="About Atharva Corrugations" eyebrow="About" />

      {/* A2 Company: three short paragraphs from confirmed facts */}
      <section data-surface="light" className="section-padding bg-paper">
        <div className="container-site">
          <div className="measure flex flex-col gap-4 text-lead">
            <Gated claim="F-03">
              {(year) => (
                <p>
                  Atharva Corrugations makes corrugated packaging for businesses. We have been operating since {year} from
                  one plant in Ranjangaon MIDC, Pune.
                </p>
              )}
            </Gated>
            <Gated claim="F-30">
              <p>
                Our design team works with customers from a drawing, a sample or a conversation, then we make the
                packaging at our plant.
              </p>
            </Gated>
            <Gated claim="F-39">
              <p>Our customers audit and approve our plant.</p>
            </Gated>
          </div>
        </div>
      </section>

      {/* A3 Atharva Group: prominent; sister companies only after Q-26 */}
      <Gated claim="F-07">
        <section data-surface="dark" className="surface-dark surface-texture section-padding">
          <div className="container-site grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeader
                eyebrow="Atharva Group"
                headline={`Part of the ${group['G-name'].value}`}
                description={`Atharva Corrugations is a company of the ${group['G-name'].value}.`}
                theme="dark"
              />
            </div>
            <div className="flex flex-col gap-2 lg:col-span-5 lg:border-l lg:border-line-dark lg:pl-12">
              <h3 className="text-label font-semibold text-on-dark-muted uppercase">Group office</h3>
              <address className="not-italic text-on-dark-body">
                {office.line1}
                <br />
                {office.line2}
                <br />
                {office.city}, {office.region} {office.postalCode}
              </address>
            </div>
          </div>
        </section>
      </Gated>

      {/* A4 Founders (names as approved) and A5 Milestones */}
      <section data-surface="light" className="section-padding bg-paper">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          {isRenderable(founders, mode) && (
            <div id="founders" className="flex flex-col gap-6">
              <SectionHeader eyebrow="Founders" headline="Who founded the company" />
              <ul className="flex flex-col border-t border-line" {...reviewAttrs(founders, mode)}>
                {founders.value.map((name) => (
                  <li key={name} className="border-b border-line py-3 text-copy text-ink">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {milestones.length > 0 && (
            <div id="milestones" className="flex flex-col gap-6">
              <SectionHeader eyebrow="Milestones" headline="Our timeline" />
              <ol className="flex flex-col border-t border-line">
                {milestones.map((m) => (
                  <li key={m.year} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-3" {...m.review}>
                    <span className="tabular font-semibold text-ink">{m.year}</span>
                    <span>{m.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* A6 Locations: the plant; the Group office is in the Atharva Group section above */}
      <section id="locations" data-surface="light" className="section-padding bg-paper-50">
        <div className="container-site grid gap-12 md:grid-cols-2">
          <Gated claim="F-05" as="div">
            {(a) => (
              <div className="flex flex-col gap-2">
                <h2 className="text-label font-semibold text-muted uppercase">Plant</h2>
                <address className="not-italic">
                  {a.line1}
                  <br />
                  {a.line2}
                  <br />
                  {a.city}, {a.region} {a.postalCode}
                </address>
                <Gated claim="F-15">
                  {(url) => (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
                      Open in Maps
                    </a>
                  )}
                </Gated>
              </div>
            )}
          </Gated>
        </div>
      </section>

      {/* A7 Contact band */}
      <section data-surface="dark" className="surface-dark surface-texture section-padding">
        <div className="container-site flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="text-h2-sm font-normal text-on-dark lg:text-h2">Talk to us</h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Button href="/contact" size="lg">
              Contact us
            </Button>
            {phones && (
              <a href={telHref(phones.main)} className="tabular text-on-dark underline-offset-4 hover:underline" data-event="phone_click" data-location="about">
                {formatPhone(phones.main)}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
