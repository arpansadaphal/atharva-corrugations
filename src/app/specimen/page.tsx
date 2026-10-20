import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TitleBlock, cell } from '@/components/ui/TitleBlock'
import { group } from '@/group/group'
import { getClaimsMode } from '@/lib/claims'
import type { ClaimsMode } from '@/types/claims'

export const metadata: Metadata = {
  title: 'Design specimen',
  robots: { index: false, follow: false },
}

const SWATCHES: { token: string; role: string; dark?: boolean }[] = [
  { token: '--ink-900', role: 'Dark surface; strong text', dark: true },
  { token: '--ink-800', role: 'Dark secondary', dark: true },
  { token: '--paper-0', role: 'Light primary' },
  { token: '--paper-50', role: 'Light secondary' },
  { token: '--text-body', role: 'Body text on light', dark: true },
  { token: '--text-muted', role: 'Muted text, light only', dark: true },
  { token: '--on-dark-body', role: 'Body text on ink' },
  { token: '--on-dark-muted', role: 'Muted text on ink' },
  { token: '--line', role: 'Hairlines' },
  { token: '--line-ui', role: 'Form-control borders', dark: true },
  { token: '--line-dark', role: 'Hairlines on ink', dark: true },
  { token: '--accent', role: 'Provisional accent (D-01)', dark: true },
  { token: '--accent-hover', role: 'Hover / pressed', dark: true },
  { token: '--accent-on-dark', role: 'Accent on ink' },
  { token: '--kraft-200', role: 'Illustration fill' },
  { token: '--kraft-300', role: 'Illustration fill' },
  { token: '--kraft-400', role: 'Illustration fill' },
  { token: '--kraft-600', role: 'Illustration stroke', dark: true },
  { token: '--wa', role: 'WhatsApp control only' },
  { token: '--error', role: 'Form error', dark: true },
  { token: '--success', role: 'Form success', dark: true },
]

// The hero capability strip candidates (Sitemap §6.1 H1), read from the registry
const heroCells = [
  cell('F-03', 'Operating since', (year) => year),
  cell('F-04', 'Plant', (n) => (n === 1 ? 'One plant, Ranjangaon MIDC' : `${n} plants`)),
  cell('F-07', 'Group', () => `Part of ${group['G-name'].value}`),
  cell('F-20', 'Board', (ply) => `${ply[0]} to ${ply[ply.length - 1]} ply`),
  cell('F-23', 'GSM', ([lo, hi]) => `${lo} to ${hi}`),
  cell('F-40', 'Certified', (iso) => iso.standard),
]

const MODES: ClaimsMode[] = ['development', 'preview', 'production']

/**
 * Dev and preview only: the coded token sheet and component specimen that
 * stands in for the Phase B token sheet (approved G2 waiver for M1).
 */
export default function SpecimenPage() {
  // internal design reference: `next dev` only, never on a review or live build
  if (getClaimsMode() !== 'development') notFound()

  return (
    <>
      <section className="section-padding">
        <div className="container-site flex flex-col gap-12">
          <SectionHeader
            eyebrow="Specimen"
            headline="Tokens, type and components"
            headingLevel="h1"
            description="The working token sheet for Atharva Corrugations. Contrast ratios are asserted by npm run check:contrast."
          />

          <div>
            <h2 className="mb-6 text-h3 font-medium text-ink">Colour tokens</h2>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
              {SWATCHES.map((s) => (
                <li key={s.token} className="flex flex-col gap-2">
                  <span className="h-16 border border-line" style={{ background: `var(${s.token})` }} />
                  <code className="text-spec text-ink">{s.token}</code>
                  <span className="text-spec text-muted">{s.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-h3 font-medium text-ink">Type roles</h2>
            <p className="text-display-sm font-light text-ink lg:text-display">Hero H1, Light 300</p>
            <p className="text-h2-sm text-ink lg:text-h2">Section H2, Regular 400</p>
            <p className="text-h3 font-medium text-ink">H3, Medium 500</p>
            <p className="measure text-lead">
              Lead copy at 18/30. Body copy stays within 68 characters per line and is never justified or centred.
            </p>
            <p className="measure">Body copy at 16/28 in the body colour on white.</p>
            <p className="tabular text-spec">Spec text 14/24 with tabular numerals: 120 · 440 · 2200 mm</p>
            <p className="text-label font-semibold uppercase text-muted">Title-block label · eyebrow</p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-h3 font-medium text-ink">Buttons on light</h2>
            <div className="flex flex-wrap gap-4">
              <Button href="/specimen">Request a quote</Button>
              <Button variant="outline">Send us your drawing</Button>
              <Button variant="whatsapp">Chat on WhatsApp</Button>
              <Button disabled>Sending…</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-dark section-padding">
        <div className="container-site flex flex-col gap-12">
          <SectionHeader
            eyebrow="Corrugated packaging"
            headline="Section header on ink"
            description="Muted text on dark uses on-dark-muted or lighter, never text-muted (3.75:1)."
            theme="dark"
          />
          <div className="flex flex-wrap gap-4">
            <Button size="lg">Request a quote</Button>
            <Button size="lg" variant="outline-dark">
              Chat on WhatsApp
            </Button>
          </div>
          <TitleBlock cells={heroCells} min={3} theme="dark" />
        </div>
      </section>

      <section className="section-padding bg-paper-50">
        <div className="container-site flex flex-col gap-12">
          <SectionHeader
            eyebrow="Claims gate"
            headline="The hero strip in each mode"
            description="The same cells rendered as development, preview and production. Production shows confirmed claims only; the strip narrows instead of leaving holes."
          />
          {MODES.map((mode) => (
            <div key={mode} className="flex flex-col gap-2">
              <h3 className="text-label font-semibold uppercase text-muted">{mode}</h3>
              <TitleBlock cells={heroCells} min={3} mode={mode} />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <h3 className="text-label font-semibold uppercase text-muted">One to four cells</h3>
            {[1, 2, 3, 4].map((n) => (
              <TitleBlock key={n} cells={heroCells.slice(0, n)} mode="preview" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
