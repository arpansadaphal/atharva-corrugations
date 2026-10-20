import type { NextConfig } from 'next'
import { securityHeaders } from './security-headers'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Inlined at build time so the build alone decides the claims mode: static
  // pages and the /api routes can never disagree (see lib/claims.ts)
  env: {
    LAUNCH: process.env.LAUNCH ?? '',
    CLAIMS_AS_OF: process.env.CLAIMS_AS_OF ?? '',
  },
  async headers() {
    const headers = securityHeaders(process.env)
    // Staging and preview are never indexed: the header backs up robots.txt
    // and the noindex meta (Technical §6)
    if (process.env.LAUNCH !== 'true') headers.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow' })
    return [{ source: '/:path*', headers }]
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
