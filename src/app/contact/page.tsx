import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactForm } from '@/components/forms/ContactForm'
import { ReviewNotice } from '@/components/forms/ReviewNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { WhatsAppGlyph } from '@/components/ui/WhatsAppGlyph'
import { privacyHref, quoteHref } from '@/data/navigation'
import { group } from '@/group/group'
import { formatPhone, telHref } from '@/lib/format'
import { rfqConfig } from '@/lib/rfq-config'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contact Atharva Corrugations',
  description: 'Phone, WhatsApp, email and plant address. Monday to Saturday, 9 am to 6 pm.',
  alternates: { canonical: '/contact' },
}

/**
 * Contact (Sitemap §6.8): every route to a person. Four routes up front, a
 * short general enquiry form beside the details, a map link rather than an
 * embedded map (privacy and performance), and the careers line.
 */
export default function ContactPage() {
  const c = rfqConfig()
  const waHref = c.whatsappNumber ? whatsappUrl(c.whatsappNumber, contextForPath('/contact')) : undefined
  const office = group['F-08'].value

  const routes = [
    {
      label: 'Request a quote',
      // reply time from the claims registry (F-16), never typed here
      detail: c.replyPromise ? `Structured request, reply within ${c.replyPromise}` : 'Structured request',
      href: quoteHref,
    },
    waHref && { label: 'WhatsApp', detail: c.whatsappDisplay, href: waHref, external: true },
    c.phoneDigits && { label: 'Call', detail: c.phoneDisplay, href: telHref(c.phoneDigits) },
    c.salesEmail && { label: 'Email', detail: c.salesEmail, href: `mailto:${c.salesEmail}` },
  ].filter(Boolean) as { label: string; detail?: string; href: string; external?: boolean }[]

  return (
    <>
      {/* K1 */}
      <PageHeader title="Contact" eyebrow="Contact" description="Talk to us about your packaging. Choose whichever is easiest.">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {routes.map((r) => (
            <li key={r.label} className="relative bg-paper p-5 transition-colors duration-200 hover:bg-paper-50">
              <a
                href={r.href}
                {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center gap-2 text-copy font-semibold text-ink after:absolute after:inset-0"
                data-event={r.label === 'WhatsApp' ? 'whatsapp_click' : r.label === 'Call' ? 'phone_click' : r.label === 'Email' ? 'email_click' : undefined}
                data-location="contact-routes"
              >
                {r.label === 'WhatsApp' && <WhatsAppGlyph className="size-5" />}
                {r.label}
              </a>
              {r.detail && <p className="tabular mt-1 text-spec break-words">{r.detail}</p>}
            </li>
          ))}
        </ul>
      </PageHeader>

      {/* K2 General enquiry beside the details; K3 address and map link */}
      <section data-surface="light" className="section-padding bg-paper">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <SectionHeader headline="Send us a message" />
            {c.formEnabled && !c.mailLive && <ReviewNotice />}
            {c.formEnabled ? (
              <ContactForm
                whatsappNumber={c.whatsappNumber}
                whatsappDisplay={c.whatsappDisplay}
                phoneDisplay={c.phoneDisplay}
                phoneDigits={c.phoneDigits}
                replyPromise={c.replyPromise}
                privacyHref={privacyHref}
              />
            ) : (
              // Production without a published privacy policy: no form (Sitemap §2, E-08)
              <p className="measure border-l-4 border-accent pl-4">
                Our online form opens soon. Until then, use WhatsApp, phone or email above.
              </p>
            )}
          </div>

          <aside id="details" aria-label="Contact details" className="flex flex-col gap-8 lg:col-span-5 lg:border-l lg:border-line lg:pl-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-label font-semibold text-muted uppercase">Reply times</h2>
              <p>WhatsApp: during business hours.</p>
              {c.replyPromise && <p>Form and email: within {c.replyPromise}.</p>}
              {c.hours && <p className="text-muted">{c.hours}. Closed Sundays and national holidays.</p>}
            </div>

            <Gated claim="F-12">
              {(p) => (
                <div className="flex flex-col gap-2">
                  <h2 className="text-label font-semibold text-muted uppercase">Phone</h2>
                  <p>
                    Main:{' '}
                    <a href={telHref(p.main)} className="tabular text-accent underline-offset-4 hover:underline">
                      {formatPhone(p.main)}
                    </a>
                  </p>
                  <p>
                    Sales:{' '}
                    <a href={telHref(p.sales)} className="tabular text-accent underline-offset-4 hover:underline">
                      {formatPhone(p.sales)}
                    </a>
                  </p>
                </div>
              )}
            </Gated>

            <Gated claim="F-13">
              {(e) => (
                <div className="flex flex-col gap-2">
                  <h2 className="text-label font-semibold text-muted uppercase">Email</h2>
                  <a href={`mailto:${e.sales}`} className="text-accent underline-offset-4 hover:underline">
                    {e.sales}
                  </a>
                  <a href={`mailto:${e.general}`} className="break-all text-accent underline-offset-4 hover:underline">
                    {e.general}
                  </a>
                </div>
              )}
            </Gated>

            <Gated claim="F-05">
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

            <div className="flex flex-col gap-2">
              <h2 className="text-label font-semibold text-muted uppercase">Group office</h2>
              <address className="not-italic">
                {office.line1}
                <br />
                {office.line2}
                <br />
                {office.city}, {office.region} {office.postalCode}
              </address>
            </div>
          </aside>
        </div>
      </section>

      {/* K4 Careers: HR contact as supplied; no openings are listed or invented */}
      <Gated claim="F-13">
        {(e) => (
          <section data-surface="light" className="section-padding bg-paper-50">
            <div className="container-site flex flex-col gap-4">
              <SectionHeader eyebrow="Careers" headline="Working with us" />
              <p className="measure">
                For careers, email{' '}
                <a href={`mailto:${e.hr}`} className="text-accent underline underline-offset-4">
                  {e.hr}
                </a>{' '}
                or call{' '}
                <a href={telHref(e.careersPhone)} className="tabular text-accent underline underline-offset-4">
                  {formatPhone(e.careersPhone)}
                </a>
                .
              </p>
              {/* links inside running text are underlined, not colour alone (WCAG 1.4.1) */}
              <p className="text-spec">
                Looking for packaging rather than a job?{' '}
                <Link href={quoteHref} className="text-accent underline underline-offset-4">
                  Request a quote
                </Link>
                .
              </p>
            </div>
          </section>
        )}
      </Gated>
    </>
  )
}
