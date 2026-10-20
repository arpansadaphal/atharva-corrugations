import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { processSteps } from '@/data/process'
import { cn } from '@/lib/utils'

/**
 * "From specification to delivery" (Sitemap §6.1 H3, Design §8): numbered
 * because the sequence is real; six in a line on desktop joined by a
 * hairline, 3 + 3 on tablet, a vertical timeline on mobile. Ordered-list
 * semantics; steps are text.
 */
export function ProcessSteps({ background = 'paper-50' }: { background?: 'paper' | 'paper-50' }) {
  return (
    <Gated claim="F-30">
      {(support) => (
        <section className={background === 'paper' ? 'section-padding bg-paper' : 'section-padding bg-paper-50'}>
          <div className="container-site flex flex-col gap-12">
            <SectionHeader
              eyebrow="Custom packaging"
              headline="From specification to delivery"
              description="Our packaging design team works from whatever you have and takes it through to production."
            />
            <ol className="grid grid-cols-1 gap-0 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-6">
              {processSteps.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0 md:flex-col md:gap-3 md:pb-0">
                  {/* hairline joiner: vertical on mobile, horizontal from tablet */}
                  {i < processSteps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute top-10 bottom-0 left-5 w-px bg-line md:top-5 md:right-0 md:bottom-auto md:left-12 md:h-px md:w-auto',
                        // tablet is 3 + 3: the third step ends its row
                        i === 2 && 'md:hidden lg:block',
                      )}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="tabular relative z-10 flex size-10 shrink-0 items-center justify-center border border-ink bg-paper text-spec font-semibold text-ink"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-copy font-semibold text-ink">{step.title}</h3>
                    <p className="text-spec">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-2 border-t border-line pt-6">
              <h3 className="text-label font-semibold text-muted uppercase">What you can send us</h3>
              <ul className="flex flex-wrap gap-x-8 gap-y-2 text-copy">
                {support.inputs.map((input) => (
                  <li key={input}>{input}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </Gated>
  )
}
