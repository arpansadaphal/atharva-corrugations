import type { Crumb } from '@/components/ui/Breadcrumb'
import { gatedValue } from './claims'
import { absoluteUrl, SITE_URL } from './site'

/**
 * Structured data, minimal and truthful (Technical §6). Built from gated
 * claims, so nothing unverified reaches search engines. Deliberately absent:
 * logo (none yet, Q-06), foundingDate (2013/2014 conflict, C-05),
 * parentOrganization (Group entity not approved, Q-26), sameAs (no
 * profiles yet), and any Product, FAQ, review or rating markup.
 */

const ORG_ID = `${SITE_URL}/#organization`

export function organizationSchema() {
  const address = gatedValue('F-05')
  const phones = gatedValue('F-12')
  const emails = gatedValue('F-13')
  const hours = gatedValue('F-14')

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Atharva Corrugations',
    url: SITE_URL,
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${address.line1}, ${address.line2}`,
        addressLocality: address.city,
        addressRegion: address.region,
        postalCode: address.postalCode,
        addressCountry: address.country,
      },
    }),
    ...(phones && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: `+91-${phones.main}`,
        ...(emails && { email: emails.sales }),
        areaServed: 'IN',
        availableLanguage: 'en',
        ...(hours && {
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '18:00',
          },
        }),
      },
    }),
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Atharva Corrugations',
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
  }
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href && { item: absoluteUrl(c.href) }),
    })),
  }
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so no value can close the script tag (Next.js JSON-LD guide) */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
