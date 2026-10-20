import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Inlined at build time so the build alone decides the claims mode: static
  // pages and the /api routes can never disagree (see lib/claims.ts)
  env: {
    LAUNCH: process.env.LAUNCH ?? '',
    CLAIMS_AS_OF: process.env.CLAIMS_AS_OF ?? '',
  },
  // Staging and preview are never indexed: the header backs up robots.txt and
  // the noindex meta (Technical §6). Security headers come in M8.
  async headers() {
    if (process.env.LAUNCH === 'true') return []
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
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
