/**
 * Site navigation (Sitemap §3), kept apart from page content. Home is the
 * logo link, so it is not listed. Product links depend on the minimum
 * content bar, so they are built on the server (productLinks in lib/mcb.ts)
 * and passed to the navbar.
 */

export interface NavLink {
  label: string
  href: string
}

export const primaryNav: (NavLink & { hasMenu?: boolean })[] = [
  { label: 'Products', href: '/products', hasMenu: true },
  { label: 'Industries', href: '/industries' },
  { label: 'Custom Packaging', href: '/custom-packaging' },
  { label: 'Manufacturing & Quality', href: '/manufacturing-and-quality' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const companyLinks: NavLink[] = primaryNav.filter((l) => l.href !== '/products')

export const quoteHref = '/request-quote'
export const privacyHref = '/privacy-policy'
