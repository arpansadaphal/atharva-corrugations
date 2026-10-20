/** Canonical origin, the www form (Technical §4.4); NEXT_PUBLIC_SITE_URL overrides it for staging */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.atharvacorrugations.com').replace(/\/+$/, '')

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`
