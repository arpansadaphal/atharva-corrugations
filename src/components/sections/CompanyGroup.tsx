import Link from 'next/link'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { group } from '@/group/group'

/**
 * Company and Atharva Group (Sitemap §6.1 H8): who is behind the plant,
 * with the Group visible (SD-05). Three sentences from confirmed facts, the
 * two addresses and a map link; no embedded map on the homepage.
 */
export function CompanyGroup() {
  const office = group['F-08'].value

  return (
    <section id="company" data-surface="light" className="section-padding bg-paper">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <SectionHeader eyebrow="Company" headline="Who we are" />
          <div className="measure flex flex-col gap-3 text-lead">
            <Gated claim="F-03">{(year) => <p>Atharva Corrugations has been operating since {year}.</p>}</Gated>
            <Gated claim="F-04">
              {(n) => <p>We make corrugated packaging at {n === 1 ? 'one plant' : `${n} plants`} in Ranjangaon MIDC, Pune.</p>}
            </Gated>
            <Gated claim="F-07">
              <p>We are part of the {group['G-name'].value}.</p>
            </Gated>
          </div>
          <Link href="/about" className="nav-underline self-start py-2 text-ui font-medium text-accent">
            About us <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          <Gated claim="F-05" as="div">
            {(a) => (
              <div className="flex flex-col gap-2">
                <h3 className="text-label font-semibold text-muted uppercase">Plant</h3>
                <address className="text-copy not-italic">
                  {a.line1}
                  <br />
                  {a.line2}
                  <br />
                  {a.city}, {a.region} {a.postalCode}
                </address>
                <Gated claim="F-15">
                  {(url) => (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-ui font-medium text-accent underline-offset-4 hover:underline">
                      Open in Maps
                    </a>
                  )}
                </Gated>
              </div>
            )}
          </Gated>
          <div className="flex flex-col gap-2">
            <h3 className="text-label font-semibold text-muted uppercase">Group office</h3>
            <address className="text-copy not-italic">
              {office.line1}
              <br />
              {office.line2}
              <br />
              {office.city}, {office.region} {office.postalCode}
            </address>
          </div>
        </div>
      </div>
    </section>
  )
}
