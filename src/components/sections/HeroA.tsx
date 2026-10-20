import { DielinePlate } from '@/components/illustration/DielinePlate'
import { Button } from '@/components/ui/Button'
import { CreaseMark } from '@/components/ui/CreaseMark'
import { TitleBlock, cell } from '@/components/ui/TitleBlock'
import { quoteHref } from '@/data/navigation'
import { group } from '@/group/group'
import { cn } from '@/lib/utils'
import type { ClaimsMode } from '@/types/claims'

/** Capability strip candidates (Sitemap §6.1 H1); TitleBlock keeps the confirmed ones, at most four */
export const heroStripCells = [
  cell('F-03', 'Operating since', (year) => year),
  cell('F-04', 'Plant', (n) => (n === 1 ? 'Ranjangaon MIDC, Pune' : `${n} plants`)),
  cell('F-07', 'Group', () => `Part of ${group['G-name'].value}`),
  cell('F-20', 'Board', (ply) => `${ply[0]} to ${ply[ply.length - 1]} ply`),
  cell('F-23', 'GSM', ([lo, hi]) => `${lo} to ${hi}`),
  cell('F-40', 'Certified', (iso) => iso.standard),
]

interface HeroAProps {
  whatsappHref?: string
  /**
   * Where the capability strip sits. Design §9 says both "at the base" of the
   * copy and "in the drawing's bottom-right corner"; G2 decides.
   */
  strip?: 'copy' | 'plate'
  mode?: ClaimsMode
  /** Heading level: h1 on the homepage, h2 when shown as a comp */
  headingLevel?: 'h1' | 'h2'
}

/**
 * Hero A, "the dieline plate" (Design §9, Sitemap §6.1 H1): ink surface,
 * copy left (7/12, ≈58%, so the H1 holds to three lines), unfolded RSC
 * dieline right. Headline H-A (SD-03). One
 * orchestrated draw on load, then still.
 */
export function HeroA({ whatsappHref, strip = 'plate', mode, headingLevel: Heading = 'h1' }: HeroAProps) {
  const titleBlock = (size: 'md' | 'sm') => (
    <TitleBlock cells={heroStripCells} min={3} theme="dark" size={size} mode={mode} className="hero-strip-animate" />
  )

  return (
    <section data-surface="dark" className="surface-dark surface-texture relative overflow-hidden">
      <div className="container-site grid items-center gap-10 py-12 md:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <p className="flex items-center gap-3">
            <CreaseMark theme="dark" />
            <span className="text-label font-semibold text-on-dark-muted uppercase">Corrugated packaging</span>
          </p>
          <Heading className="text-display-sm font-light tracking-[-0.015em] text-on-dark lg:text-display-md xl:text-display">
            Corrugated packaging, made to your specification.
          </Heading>
          <p className="measure text-lead text-on-dark-body">
            Boxes, die-cut packs and heavy-duty packaging from our plant in Ranjangaon MIDC, Pune. Designed with you, then
            made.
          </p>
          <div className="flex flex-col gap-3 md:flex-row">
            <Button href={quoteHref} size="lg" className="w-full md:w-auto">
              Request a quote
            </Button>
            {whatsappHref && (
              <Button
                href={whatsappHref}
                size="lg"
                variant="outline-dark"
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp_click"
                data-location="hero"
                className="w-full md:w-auto"
              >
                Chat on WhatsApp
              </Button>
            )}
          </div>
          {/* On mobile the strip always follows the CTAs so it is on the first screen */}
          <div className={strip === 'plate' ? 'lg:hidden' : undefined}>{titleBlock('md')}</div>
        </div>

        {/* A drawing sheet: the dieline above, and in variant 1 the title block
            along the bottom edge where a real drawing keeps it */}
        <figure className={cn('lg:col-span-5', strip === 'plate' && 'lg:border lg:border-line-dark')}>
          <div className={cn('aspect-[4/3]', strip === 'plate' && 'lg:p-4')}>
            <DielinePlate animate className="h-full w-full" />
          </div>
          {strip === 'plate' && <div className="hidden border-t border-line-dark px-4 lg:block">{titleBlock('sm')}</div>}
          <figcaption className="sr-only">Illustration of a regular slotted carton dieline</figcaption>
        </figure>
      </div>
    </section>
  )
}
