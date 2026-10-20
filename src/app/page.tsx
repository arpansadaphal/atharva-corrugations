import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { formatPhone, telHref } from '@/lib/format'

/**
 * Holding page until the homepage milestone (M4). Uses confirmed contact
 * facts only, so it is safe to show in any mode.
 */
export default function Home() {
  return (
    <section className="section-padding">
      <div className="container-site flex flex-col gap-8">
        <SectionHeader
          eyebrow="Corrugated packaging"
          headline="Atharva Corrugations"
          headingLevel="h1"
          description="Our new website is being built."
        />

        <div className="measure flex flex-col gap-2">
          <Gated claim="F-12">
            {(phones) => (
              <p>
                Call or WhatsApp{' '}
                <a className="text-accent underline underline-offset-4" href={telHref(phones.main)}>
                  {formatPhone(phones.main)}
                </a>
              </p>
            )}
          </Gated>
          <Gated claim="F-13">
            {(emails) => (
              <p>
                Email{' '}
                <a className="text-accent underline underline-offset-4" href={`mailto:${emails.sales}`}>
                  {emails.sales}
                </a>
              </p>
            )}
          </Gated>
          <Gated claim="F-14">
            {(h) => (
              <p className="text-muted">
                {h.days}, {h.hours}
              </p>
            )}
          </Gated>
        </div>
      </div>
    </section>
  )
}
