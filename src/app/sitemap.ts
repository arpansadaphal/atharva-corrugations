import type { MetadataRoute } from 'next'
import { families } from '@/data/products'
import { gatedValue } from '@/lib/claims'
import { evaluateMcb } from '@/lib/mcb'
import { absoluteUrl } from '@/lib/site'

/**
 * Launched routes only (Technical §6): folded family pages, the dev
 * specimen and system pages are left out; the privacy policy appears once
 * it is published (F-66). No lastModified: prerendering may not read the
 * clock, and a wrong date is worse than none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/products', '/industries', '/custom-packaging', '/manufacturing-and-quality', '/about', '/contact', '/request-quote']
  const familyPages = families.filter((f) => evaluateMcb(f).passes).map((f) => `/products/${f.slug}`)
  const privacy = gatedValue('F-66') ? ['/privacy-policy'] : []
  return [...pages, ...familyPages, ...privacy].map((path) => ({ url: absoluteUrl(path) }))
}
