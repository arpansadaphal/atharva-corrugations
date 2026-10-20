import { families, familyHref } from './products'

/**
 * Site navigation (Sitemap §3), kept apart from page content. Home is the
 * logo link, so it is not listed.
 */

export interface NavLink {
  label: string
  href: string
}

export const productLinks: NavLink[] = [
  ...families.map((f) => ({ label: f.name, href: familyHref(f) })),
  { label: 'All products', href: '/products' },
]

export const primaryNav: (NavLink & { children?: NavLink[] })[] = [
  { label: 'Products', href: '/products', children: productLinks },
  { label: 'Industries', href: '/industries' },
  { label: 'Custom Packaging', href: '/custom-packaging' },
  { label: 'Manufacturing & Quality', href: '/manufacturing-and-quality' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const companyLinks: NavLink[] = primaryNav.filter((l) => l.href !== '/products')

export const quoteHref = '/request-quote'
export const privacyHref = '/privacy-policy'
