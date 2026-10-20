import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { getClaim, getClaimsMode, isPublishable, isRenderable } from '@/lib/claims'
import { rfqConfig } from '@/lib/rfq-config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Atharva Corrugations collects and uses the details you send through this website.',
  alternates: { canonical: '/privacy-policy' },
}

/**
 * An open point for the client's counsel (Q-09). check-claims fails a
 * production build if any remain once the policy is marked published (F-66).
 */
function CounselNote({ children }: { children: ReactNode }) {
  return (
    <span className="mt-1 block border-l-4 border-kraft-400 bg-kraft-200 px-3 py-1 text-spec text-ink">
      <span className="font-semibold">Counsel to confirm: </span>
      {children}
    </span>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-line pt-6">
      <h2 className="text-h3 font-medium text-ink">{title}</h2>
      {children}
    </section>
  )
}

/**
 * Privacy policy (Sitemap §6.10, Technical §7.5, §11). Until the client's
 * own policy arrives (Q-09) this is a draft written from the data the site
 * actually collects, for the client's counsel. It renders in preview for
 * review and is a 404 in production until claim F-66 is confirmed. DPDP
 * Rules notified November 2025; main obligations from about May 2027 (E-08).
 */
export default function PrivacyPolicyPage() {
  const policy = getClaim('F-66')
  if (!isRenderable(policy, getClaimsMode())) notFound()
  const draft = !isPublishable(policy)
  const c = rfqConfig()

  return (
    <>
      <PageHeader
        title="Privacy policy"
        description="How Atharva Corrugations collects and uses the details you send through this website."
      >
        {draft && (
          <p role="note" className="measure border-l-4 border-kraft-400 bg-kraft-200 px-4 py-3 text-spec text-ink">
            Draft for the company&rsquo;s legal counsel. Not published: this page is hidden on the live site until it is
            approved.
          </p>
        )}
      </PageHeader>

      <div data-surface="light" className="section-padding bg-paper">
        <div className="container-site">
          <article className="measure flex flex-col gap-8">
            <Section title="Who we are">
              <p>
                This website is run by Atharva Corrugations
                {c.plantAddress ? `, ${c.plantAddress}` : ''}. In this policy, &ldquo;we&rdquo; means Atharva Corrugations.
              </p>
              <CounselNote>the exact legal name from the certificate of incorporation (Q-10).</CounselNote>
            </Section>

            <Section title="What we collect">
              <p>We collect only what you choose to send us:</p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>
                  <span className="font-medium text-ink">Quote requests:</span> your name, company, email address, phone
                  number and, if you give them, your designation, industry and notes, together with the details of the
                  packaging you need.
                </li>
                <li>
                  <span className="font-medium text-ink">Messages from the Contact page:</span> your name, company, email
                  address, phone number and message.
                </li>
                <li>
                  <span className="font-medium text-ink">Campaign tags:</span> if you arrive from a link with campaign tags
                  (for example from an advertisement), those tags are sent with your enquiry.
                </li>
                <li>
                  <span className="font-medium text-ink">Analytics, only if you accept:</span> Google Analytics records
                  which pages are visited and which buttons are used. You choose this in the notice at the bottom of the
                  page and can change your mind at any time from the footer.
                </li>
              </ul>
              <p>
                We do not store your IP address, and our forms do not ask for anything we do not need to reply to you. If
                you message us on WhatsApp, that conversation is handled by WhatsApp under its own terms.
              </p>
            </Section>

            <Section title="Why we use it">
              <p>
                To reply to your enquiry, prepare a quotation and follow up on it. With your consent, analytics helps us
                understand how the site is used so we can improve it. We do not sell your details or use them for
                unrelated marketing.
              </p>
            </Section>

            <Section title="Who receives it">
              <p>
                Your enquiry is emailed to our sales team, and a copy is kept in our own mailbox so no enquiry is lost.
                Service providers handle it for us:
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>Website hosting: Vercel</li>
                <li>Email delivery: Resend</li>
                <li>Analytics, only if you accept: Google</li>
              </ul>
              <CounselNote>the final provider list, and whether processing outside India needs further wording.</CounselNote>
            </Section>

            <Section title="How long we keep it">
              <p>We keep enquiries only as long as we need them to deal with your request and keep our business records.</p>
              <CounselNote>the retention period for enquiries.</CounselNote>
            </Section>

            <Section title="Your rights">
              <p>
                You can ask us what we hold about you, ask us to correct or delete it, withdraw your consent to analytics,
                and raise a complaint with us. Under India&rsquo;s Digital Personal Data Protection Act, 2023, you may
                also complain to the Data Protection Board of India.
              </p>
              <CounselNote>who receives privacy requests, their contact details and how quickly we respond (Q-09).</CounselNote>
            </Section>

            <Section title="Cookies and browser storage">
              <p>
                The site itself sets no tracking cookies. Google Analytics sets cookies only after you accept it. We keep
                your analytics choice, and any campaign tags from the link you arrived by, in your browser&rsquo;s storage;
                they are not sent to us except with an enquiry you submit.
              </p>
            </Section>

            <Section title="Changes to this policy">
              <p>If we change this policy, the new version will be published on this page with its date.</p>
              <CounselNote>the publication date.</CounselNote>
            </Section>
          </article>
        </div>
      </div>
    </>
  )
}
