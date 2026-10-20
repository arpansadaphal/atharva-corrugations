import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { specialisedItems } from '@/data/specialised'
import { getClaim, getClaimsMode, isRenderable } from '@/lib/claims'
import type { ClaimsMode } from '@/types/claims'

/**
 * Specialised and protective packaging (Sitemap §6.1 H6): makes "not a
 * conventional packaging manufacturer" provable. Shown only with at least
 * two items that have a real photograph and a verified specification;
 * otherwise omitted entirely. One larger feature plus smaller items.
 */
export function SpecialisedPackaging({ mode }: { mode?: ClaimsMode }) {
  const m = mode ?? getClaimsMode()
  if (!isRenderable(getClaim('F-27-allied'), m)) return null
  const items = specialisedItems.filter((i) => i.photo && i.alt).slice(0, 4)
  if (items.length < 2) return null
  const [feature, ...rest] = items

  return (
    <section data-surface="light" className="section-padding bg-paper">
      <div className="container-site flex flex-col gap-10">
        <SectionHeader eyebrow="Specialised packaging" headline="Packaging for products a standard box can't carry" />
        <div className="grid gap-8 lg:grid-cols-2">
          {[feature, ...rest].map((item, i) => (
            <figure key={item.name} className={i === 0 ? 'lg:row-span-3' : undefined}>
              <Image src={item.photo!} alt={item.alt!} width={1200} height={1500} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
              <figcaption className="mt-3">
                <span className="block text-copy font-semibold text-ink">{item.name}</span>
                <span className="text-spec">{item.spec}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Link href="/products/protective-and-allied-packaging" className="nav-underline self-start py-2 text-ui font-medium text-accent">
          Protective and allied packaging <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
