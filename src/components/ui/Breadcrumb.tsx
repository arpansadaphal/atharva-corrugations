import Link from 'next/link'

export interface Crumb {
  label: string
  href?: string
}

/**
 * Breadcrumbs on every inner page (Sitemap §4.3). The last crumb is the
 * current page. BreadcrumbList structured data arrives with SEO (M7).
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 text-spec text-muted">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href ? (
              <Link href={c.href} className="underline-offset-4 hover:text-accent hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
