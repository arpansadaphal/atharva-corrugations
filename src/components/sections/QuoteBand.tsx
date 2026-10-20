import { Button } from '@/components/ui/Button'
import { quoteHref } from '@/data/navigation'
import { gatedValue } from '@/lib/claims'
import { formatPhone, telHref } from '@/lib/format'

interface QuoteBandProps {
  whatsappHref?: string
  headline?: string
  /** Primary action label, e.g. "Send us your drawing" on Custom Packaging */
  primaryLabel?: string
  headingLevel?: 'h2' | 'h3'
}

/**
 * Quote band (Sitemap §6.1 H9, Design §8): centred 640 px column on
 * textured ink. The only content section where WhatsApp green appears,
 * with ink text (D-05).
 */
export function QuoteBand({
  whatsappHref,
  headline = 'Send us your packaging requirement.',
  primaryLabel = 'Request a quote',
  headingLevel: Heading = 'h2',
}: QuoteBandProps) {
  const reply = gatedValue('F-16')
  const hours = gatedValue('F-14')
  const phones = gatedValue('F-12')

  return (
    <section data-surface="dark" className="surface-dark surface-texture section-padding">
      <div className="container-site">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-6 text-center">
          <Heading className="text-h2-sm font-normal text-on-dark lg:text-h2">{headline}</Heading>
          <p className="text-lead text-on-dark-body">
            What you pack, a size and a quantity are enough to start.
            {reply && ` We reply within ${reply} working days${hours ? `, ${hours.days}` : ''}.`}
          </p>
          <div className="flex w-full flex-col justify-center gap-3 md:w-auto md:flex-row">
            <Button href={quoteHref} size="lg">
              {primaryLabel}
            </Button>
            {whatsappHref && (
              <Button
                href={whatsappHref}
                size="lg"
                variant="whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp_click"
                data-location="band"
              >
                Chat on WhatsApp
              </Button>
            )}
          </div>
          {phones && (
            <p className="text-spec text-on-dark-muted">
              Or call{' '}
              <a href={telHref(phones.main)} className="tabular text-on-dark underline-offset-4 hover:underline" data-event="phone_click" data-location="band">
                {formatPhone(phones.main)}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
