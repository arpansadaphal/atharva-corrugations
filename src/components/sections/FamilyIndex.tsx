import Link from 'next/link'
import { DielinePlate } from '@/components/illustration/DielinePlate'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { families, familyHref, type Family } from '@/data/products'
import { getClaimsMode } from '@/lib/claims'

/**
 * "What we make" (Sitemap §6.1 H2, Design §8 FamilyIndexRow): a
 * specification index, not a card grid. Hairline rows: drawing 3 columns,
 * text 4, formats and board 3, link 2. Each row is one descriptive link.
 */
export function FamilyIndex() {
  return (
    <section data-surface="light" className="section-padding bg-paper">
      <div className="container-site flex flex-col gap-10">
        <SectionHeader eyebrow="Products" headline="What we make" />
        <ul className="border-t border-line">
          {families.map((f) => (
            <FamilyIndexRow key={f.slug} family={f} />
          ))}
        </ul>
        <Link href="/products" className="nav-underline self-start py-2 text-ui font-medium text-accent">
          All products <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

function FamilyIndexRow({ family: f }: { family: Family }) {
  const details = (
    <>
      <p className="text-copy">{f.summary}</p>
      <p className="text-spec text-muted">{f.formats.join(', ')}</p>
    </>
  )

  return (
    <li className="group relative border-b border-line transition-colors duration-200 ease-brand hover:bg-paper-50">
      <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-12 md:items-center md:gap-6 md:px-4">
        <div className="md:col-span-3">
          <FamilyDrawing slug={f.slug} />
        </div>
        <div className="flex flex-col gap-2 md:col-span-7">
          <h3 className="text-h3 font-medium text-ink">
            {/* the stretched link makes the whole row one target with the family's name */}
            <Link href={familyHref(f)} className="after:absolute after:inset-0">
              {f.name}
            </Link>
          </h3>
          {f.summaryClaim ? (
            <Gated claim={f.summaryClaim} as="div">
              {details}
            </Gated>
          ) : (
            details
          )}
          {f.slug === 'corrugated-boxes' && (
            <Gated claim="F-27">
              <p className="tabular text-spec font-medium text-ink">3 and 5 ply</p>
            </Gated>
          )}
        </div>
        <div className="hidden justify-end md:col-span-2 md:flex">
          <span
            aria-hidden="true"
            className="text-ui font-medium text-accent transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
          >
            View →
          </span>
        </div>
      </div>
    </li>
  )
}

/**
 * Family line drawings come from the illustration set (Design §7.4, C7).
 * Only the RSC exists so far; the others show a labelled frame in
 * development and preview, and nothing in production.
 */
function FamilyDrawing({ slug }: { slug: Family['slug'] }) {
  if (slug === 'corrugated-boxes') {
    return <DielinePlate theme="light" callouts={false} className="max-h-28" />
  }
  if (getClaimsMode() === 'production') return null
  return (
    <div className="flex aspect-[2/1] max-h-28 items-center justify-center border border-dashed border-line-ui text-spec text-muted">
      Drawing to come
    </div>
  )
}
