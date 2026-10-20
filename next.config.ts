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
