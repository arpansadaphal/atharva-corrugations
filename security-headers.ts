/**
 * Security headers (Technical §11), applied in next.config.
 *
 * CSP without nonces: nonce-based CSP forces every page to render on request
 * and is incompatible with Partial Prerendering (Next.js CSP guide), so
 * script-src keeps 'unsafe-inline' for the framework's inline bootstrap.
 * Everything else is limited to this site. Third-party origins are added
 * only when that service is switched on:
 * - Google Analytics: NEXT_PUBLIC_GA_ID (loads only after consent anyway)
 * - Cloudflare Turnstile: NEXT_PUBLIC_TURNSTILE_SITE_KEY
 */

interface Env {
  NODE_ENV?: string
  /** Set by Vercel on every build (preview and production), all served over HTTPS */
  VERCEL?: string
  NEXT_PUBLIC_GA_ID?: string
  NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string
}

export function contentSecurityPolicy(env: Env): string {
  const ga = Boolean(env.NEXT_PUBLIC_GA_ID)
  const turnstile = Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  const dev = env.NODE_ENV === 'development'

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      ...(dev ? ["'unsafe-eval'"] : []),
      ...(ga ? ['https://www.googletagmanager.com'] : []),
      ...(turnstile ? ['https://challenges.cloudflare.com'] : []),
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', ...(ga ? ['https://*.google-analytics.com', 'https://*.googletagmanager.com'] : [])],
    'font-src': ["'self'"],
    'connect-src': [
      "'self'",
      ...(ga ? ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'] : []),
    ],
    'frame-src': turnstile ? ['https://challenges.cloudflare.com'] : ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  }
  const policy = Object.entries(directives).map(([k, v]) => `${k} ${v.join(' ')}`)
  // Only where the site is served over HTTPS (Vercel). WebKit applies it even
  // to http://localhost, so on a local or CI test server every script would be
  // upgraded to https and fail to load. Every resource is same-origin, so the
  // directive is a safety net rather than a dependency
  if (!dev && env.VERCEL) policy.push('upgrade-insecure-requests')
  return policy.join('; ')
}

export function securityHeaders(env: Env): { key: string; value: string }[] {
  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy(env) },
    // No includeSubDomains or preload until the client's DNS and mail hosts are
    // known (C-02): a subdomain still on plain HTTP would break
    { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    },
  ]
}
