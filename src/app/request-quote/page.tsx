import type { Metadata } from 'next'
import { ReviewNotice } from '@/components/forms/ReviewNotice'
import { RfqForm } from '@/components/forms/RfqForm'
import { InternalDimensions } from '@/components/illustration/InternalDimensions'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { privacyHref } from '@/data/navigation'
import { gatedValue } from '@/lib/claims'
import { rfqConfig } from '@/lib/rfq-config'
import { telHref } from '@/lib/format'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

/** Reply time from the claims registry (F-16); dropped from the description if it is ever unconfirmed */
const replyDays = gatedValue('F-16')

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: `Tell us what you pack, the size and quantity.${replyDays ? ` We reply within ${replyDays} working days.` : ''}`,
  alternates: { canonical: '/request-quote' },
}

const WHAT_WE_NEED = [
  'What you are packing and roughly how heavy it is',
  'How many you need, and how often',
  'The inside size of the box (length × width × height, mm), or a drawing or sample',
  'Printing, if any',
  'Where it is delivered, and when you need it',
]

function WhatWeNeed() {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-spec">
      {WHAT_WE_NEED.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/** Request a Quote (Sitemap §6.9): form 7/12, sidebar 5/12; sidebar follows the form on mobile. */
export default function RequestQuotePage() {
  const c = rfqConfig()
  const waHref = c.whatsappNumber ? whatsappUrl(c.whatsappNumber, contextForPath('/request-quote')) : undefined

  return (
    <section data-surface="light" className="section-padding bg-paper">
      <div className="container-site flex flex-col gap-10">
        <SectionHeader
          headline="Request a quote"
          headingLevel="h1"
          description={[
            'Tell us what you pack, the size and the quantity.',
            c.replyPromise && `We reply within ${c.replyPromise}${c.hours ? `, ${c.hours}` : ''}.`,
            waHref && 'In a hurry? Message us on WhatsApp.',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        <details className="border-y border-line py-3 lg:hidden">
          <summary className="flex min-h-11 cursor-pointer items-center text-ui font-medium text-ink">What we need</summary>
          <div className="pt-2 pb-4">
            <WhatWeNeed />
          </div>
        </details>

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {c.formEnabled && !c.mailLive && (
              <div className="mb-8">
                <ReviewNotice />
              </div>
            )}
            {c.formEnabled ? (
              <RfqForm
                boardOptions={c.boardOptions}
                boardValues={c.boardValues}
                industries={c.industries}
                whatsappNumber={c.whatsappNumber}
                whatsappDisplay={c.whatsappDisplay}
                phoneDisplay={c.phoneDisplay}
                phoneDigits={c.phoneDigits}
                replyPromise={c.replyPromise}
                privacyHref={privacyHref}
              />
            ) : (
              // Production without a published privacy policy: no form (Sitemap §2, E-08)
              <div className="flex flex-col gap-6 border-l-4 border-accent bg-paper-50 p-6">
                <p className="measure">
                  Our online quote form opens soon. Until then, send your requirement on WhatsApp or by email and we will reply
                  {c.replyPromise ? ` within ${c.replyPromise}` : ''}.
                </p>
                <div className="flex flex-wrap gap-4">
                  {waHref && (
                    <Button href={waHref} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click" data-location="rfq-offline">
                      Chat on WhatsApp
                    </Button>
                  )}
                  {c.salesEmail && (
                    <Button href={`mailto:${c.salesEmail}`} variant="outline" data-event="email_click" data-location="rfq-offline">
                      Email us
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <aside aria-label="About your quote" className="flex flex-col gap-10 lg:col-span-5 lg:border-l lg:border-line lg:pl-12">
            <div className="hidden flex-col gap-4 lg:flex">
              <h2 className="text-label font-semibold text-muted uppercase">What we need</h2>
              <WhatWeNeed />
            </div>

            <InternalDimensions className="max-w-sm" />

            <div className="flex flex-col gap-2">
              <h2 className="text-label font-semibold text-muted uppercase">Have a drawing?</h2>
              <p className="text-spec">
                {waHref ? (
                  <>
                    Send it on{' '}
                    <a href={waHref} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4" data-event="whatsapp_click" data-location="rfq-sidebar">
                      WhatsApp
                    </a>{' '}
                    or reply to our confirmation email with the file attached.
                  </>
                ) : (
                  'Reply to our confirmation email with the file attached.'
                )}
              </p>
            </div>

            {(c.phoneDisplay || c.hours) && (
              <div className="flex flex-col gap-2">
                <h2 className="text-label font-semibold text-muted uppercase">Prefer to talk?</h2>
                {c.phoneDisplay && c.phoneDigits && (
                  <a href={telHref(c.phoneDigits)} className="tabular text-value font-medium text-ink hover:text-accent" data-event="phone_click" data-location="rfq-sidebar">
                    {c.phoneDisplay}
                  </a>
                )}
                {c.hours && <p className="text-spec text-muted">{c.hours}</p>}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
