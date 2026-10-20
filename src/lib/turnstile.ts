/**
 * Cloudflare Turnstile verification (Technical §7.6). Active only when
 * TURNSTILE_SECRET_KEY is set: Sitemap §7.4 adds it "if abuse appears".
 */
export async function verifyTurnstile(token: string | undefined, env: Env = process.env): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true
  if (!token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) return false
  const data = (await res.json()) as { success?: boolean }
  return data.success === true
}

/** Environment variables; a plain record so tests can pass partial sets */
type Env = Record<string, string | undefined>
