import Link from 'next/link'
import { Gated } from '@/components/ui/Gated'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { alsoServing, topIndustries } from '@/data/industries'

/**
 * Industries (Sitemap §6.1 H4, Design §8 IndustryGrid): four equal cells
 * divided by hairlines, no cards; 2×2 on every width. Each cell is one link
 * to its anchor on /industries.
 */
export function IndustryGrid() {
  return (
    <Gated claim="F-46">
      <section data-surface="light" className="section-padding bg-paper">
        <div className="container-site flex flex-col gap-10">
          <SectionHeader eyebrow="Industries" headline="Who we make packaging for" />
          <Gated claim="F-27">
            <ul className="grid grid-cols-2 border-t border-l border-line">
              {topIndustries.map((ind) => (
                <li key={ind.slug} className="group relative border-r border-b border-line transition-colors duration-200 ease-brand hover:bg-paper-50">
                  <div className="flex h-full flex-col gap-2 p-4 md:p-8">
                    <h3 className="text-copy font-semibold text-ink md:text-h3 md:font-medium">
                      <Link href={`/industries#${ind.slug}`} className="after:absolute after:inset-0">
                        {ind.name}
                      </Link>
                    </h3>
                    <p className="text-spec md:text-copy">{ind.line}</p>
                    <span
                      aria-hidden="true"
                      className="mt-auto pt-2 text-ui font-medium text-accent transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Gated>
          <Gated claim="F-45">
            <p className="measure text-spec">
              <span className="font-semibold text-ink">Also serving: </span>
              {alsoServing.join(' · ')}
            </p>
          </Gated>
          <Link href="/industries" className="nav-underline self-start py-2 text-ui font-medium text-accent">
            All industries <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </Gated>
  )
}
