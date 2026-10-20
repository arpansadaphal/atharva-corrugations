import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuoteBand } from '@/components/sections/QuoteBand'
import { Button } from '@/components/ui/Button'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { faqs, inputNotes } from '@/data/custom-packaging'
import { quoteHref } from '@/data/navigation'
import { processSteps } from '@/data/process'
import { gatedValue } from '@/lib/claims'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Custom Corrugated Packaging Design',
  description:
    'Send a drawing, CAD file or sample. We design the dieline, make a sample and tool it for production at our Pune plant.',
  alternates: { canonical: '/custom-packaging' },
}

/** Lower-case a list label for running text, keeping acronyms such as "CAD" */
const inSentence = (s: string) => (/^[A-Z]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1))

/**
 * Custom Packaging (Sitemap §6.5): the confirmed design-support offer (F-30)
 * as a dependable path from product to production. No durations, lead
 * times or MOQ; outputs and tooling policy appear only once confirmed.
 */
export default function CustomPackagingPage() {
  const phones = gatedValue('F-12')
  const ctx = contextForPath('/custom-packaging')
  const drawingCtx = { ...ctx, subject: 'custom packaging. I have a drawing to send' }
  const whatsappHref = phones ? whatsappUrl(phones.whatsapp, ctx) : undefined
  const drawingHref = phones ? whatsappUrl(phones.whatsapp, drawingCtx) : undefined
  const customQuote = `${quoteHref}?type=custom`

  return (
    <Gated claim="F-30">
      {(support) => (
        <>
          {/* C1 */}
          <PageHeader
            title="Custom corrugated packaging"
            eyebrow="Custom packaging"
            description={`Our design team turns what you have into a pack we can make: ${support.inputs
              .slice(0, -1)
              .map(inSentence)
              .join(', ')}, or ${inSentence(support.inputs.at(-1)!)}.`}
          >
            <div className="flex flex-col gap-3 md:flex-row">
              <Button href={customQuote} size="lg">
                Request a quote
              </Button>
              {drawingHref && (
                <Button
                  href={drawingHref}
                  size="lg"
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="whatsapp_click"
                  data-location="custom-header"
                >
                  Send us your drawing
                </Button>
              )}
            </div>
          </PageHeader>

          {/* C2 Process: what you provide and what you receive at each step */}
          <section data-surface="dark" className="surface-dark surface-texture section-padding">
            <div className="container-site flex flex-col gap-10">
              <SectionHeader eyebrow="Process" headline="From your brief to production" theme="dark" />
              <ol className="flex flex-col border-t border-line-dark">
                {processSteps.map((s, i) => (
                  <li key={s.title} className="grid gap-4 border-b border-line-dark py-6 md:grid-cols-12 md:gap-6">
                    <span
                      aria-hidden="true"
                      className="tabular flex size-10 items-center justify-center border border-on-dark-muted text-spec font-semibold text-on-dark md:col-span-1"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="md:col-span-3">
                      <h3 className="text-h3 font-medium text-on-dark">{s.title}</h3>
                      <p className="text-spec">{s.body}</p>
                    </div>
                    <dl className="grid gap-4 md:col-span-8 md:grid-cols-2">
                      <div>
                        <dt className="text-label font-semibold text-on-dark-muted uppercase">You provide</dt>
                        <dd className="mt-1">{s.provide}</dd>
                      </div>
                      <div>
                        <dt className="text-label font-semibold text-on-dark-muted uppercase">You receive</dt>
                        <dd className="mt-1">{s.receive}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* C3 What you can send us; C4 What you receive (confirmed outputs only) */}
          <section data-surface="light" className="section-padding bg-paper-50">
            <div className="container-site grid gap-12 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <SectionHeader eyebrow="Inputs" headline="What you can send us" />
                <dl className="flex flex-col border-t border-line">
                  {support.inputs.map((input) => (
                    <div key={input} className="border-b border-line py-3">
                      <dt className="font-medium text-ink">{input}</dt>
                      {inputNotes[input] && <dd className="text-spec">{inputNotes[input]}</dd>}
                    </div>
                  ))}
                </dl>
              </div>
              <Gated claim="F-30-routine" as="div">
                {(outputs) => (
                  <div className="flex flex-col gap-6">
                    <SectionHeader eyebrow="Outputs" headline="What you receive" />
                    <ul className="flex flex-col border-t border-line">
                      {outputs.map((o) => (
                        <li key={o} className="border-b border-line py-3 font-medium text-ink">
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Gated>
            </div>
          </section>

          {/* C5 Testing support (named practices, gated); C6 Tooling (policy, gated) */}
          <Gated claim="F-38">
            {(practices) => (
              <section data-surface="light" className="section-padding bg-paper">
                <div className="container-site grid gap-12 lg:grid-cols-2">
                  <div className="flex flex-col gap-6">
                    <SectionHeader
                      eyebrow="Testing"
                      headline="Testing support"
                      description="Checks we can run on a design before it goes into production."
                    />
                    <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2">
                      {practices
                        .filter((p) => !/inspection|traceability|laboratory/i.test(p))
                        .map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                    </ul>
                  </div>
                  <Gated claim="F-30-tooling" as="div">
                    {(policy) =>
                      // nothing to show until the client's policy text arrives (Q-23)
                      policy && (
                        <div className="flex flex-col gap-6">
                          <SectionHeader eyebrow="Tooling" headline="Dies and printing plates" />
                          <p className="measure">{policy}</p>
                        </div>
                      )
                    }
                  </Gated>
                </div>
              </section>
            )}
          </Gated>

          {/* C7 Questions */}
          <section data-surface="light" className="section-padding bg-paper-50">
            <div className="container-site flex flex-col gap-8">
              <SectionHeader eyebrow="Questions" headline="Common questions" />
              <div className="max-w-3xl border-t border-line">
                {faqs.map((f) => (
                  <details key={f.q} className="group border-b border-line">
                    <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-copy font-medium text-ink">
                      {f.q}
                      <span aria-hidden="true" className="text-accent transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="measure pb-4">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* C8 Quote band */}
          <QuoteBand
            whatsappHref={whatsappHref}
            quoteLink={customQuote}
            headline="Send us your drawing, sample or brief."
            primaryLabel="Request a quote"
          />
        </>
      )}
    </Gated>
  )
}
