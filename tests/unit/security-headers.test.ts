import { describe, expect, it } from 'vitest'
import { contentSecurityPolicy } from '../../security-headers'

describe('content security policy', () => {
  it('upgrades insecure requests on Vercel (HTTPS) builds', () => {
    expect(contentSecurityPolicy({ NODE_ENV: 'production', VERCEL: '1' })).toContain('upgrade-insecure-requests')
  })
  it('leaves it out on a local or CI test server over http://localhost (WebKit would upgrade every script)', () => {
    expect(contentSecurityPolicy({ NODE_ENV: 'production' })).not.toContain('upgrade-insecure-requests')
    expect(contentSecurityPolicy({ NODE_ENV: 'development', VERCEL: '1' })).not.toContain('upgrade-insecure-requests')
  })
  it('keeps every source on this site unless a service is switched on', () => {
    const csp = contentSecurityPolicy({ NODE_ENV: 'production', VERCEL: '1' })
    expect(csp).toContain("default-src 'self'")
    expect(csp).not.toMatch(/googletagmanager|cloudflare/)
  })
})
