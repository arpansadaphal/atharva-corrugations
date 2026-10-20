import type { MetadataRoute } from 'next'
import { getClaimsMode } from '@/lib/claims'
import { absoluteUrl } from '@/lib/site'

/** Production allows everything (Technical §6); preview and staging block all crawling */
export default function robots(): MetadataRoute.Robots {
  if (getClaimsMode() !== 'production') return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
