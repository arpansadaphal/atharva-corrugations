import { expect, test, type Page } from '@playwright/test'

const PAGES = ['/', '/products', '/products/corrugated-boxes', '/industries', '/custom-packaging', '/manufacturing-and-quality', '/about', '/contact', '/request-quote']

/** Collect CSP violations reported by the browser, before any page script runs */
async function watchCsp(page: Page) {
  await page.addInitScript(() => {
    ;(window as unknown as { cspViolations: string[] }).cspViolations = []
    document.addEventListener('securitypolicyviolation', (e) =>
      (window as unknown as { cspViolations: string[] }).cspViolations.push(`${e.violatedDirective} ${e.blockedURI}`),
    )
  })
}
const violations = (page: Page) => page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations)

test('security headers are present (Technical §11)', async ({ request }) => {
  const h = (await request.get('/')).headers()
  expect(h['content-security-policy']).toContain("default-src 'self'")
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'")
  expect(h['content-security-policy']).toContain("object-src 'none'")
  expect(h['strict-transport-security']).toBe('max-age=31536000')
  expect(h['x-content-type-options']).toBe('nosniff')
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(h['x-frame-options']).toBe('DENY')
  expect(h['permissions-policy']).toContain('camera=()')
  expect(h['x-powered-by']).toBeUndefined()
})

for (const path of PAGES) {
  test(`${path}: no CSP violations`, async ({ page }) => {
    await watchCsp(page)
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    expect(await violations(page)).toEqual([])
  })
}

test('the quote form still submits under the CSP', async ({ page }) => {
  await watchCsp(page)
  await page.route('/api/rfq', (r) => r.fulfill({ json: { ok: true, reference: 'ACQ-261020-TEST' } }))
  await page.goto('/request-quote')
  // a <select> choice made before hydration is reset when React attaches (see quote.spec.ts)
  await page.waitForFunction(() => Object.keys(document.querySelector('form') ?? {}).some((k) => k.startsWith('__reactProps')))
  await page.getByLabel('Packaging type').selectOption('corrugated-boxes')
  await page.getByLabel('What are you packing?').fill('Compressor housing, about 40 kg')
  await page.getByLabel('Quantity per order').fill('500')
  await page.getByLabel('How often').selectOption('monthly')
  await page.getByLabel('Name (required)', { exact: true }).fill('Asha Rao')
  await page.getByLabel('Company').fill('Example Engineering')
  await page.getByLabel('Email').fill('asha@example.com')
  await page.getByLabel('Phone (required)', { exact: true }).fill('98765 43210')
  await page.getByRole('button', { name: 'Send quote request' }).click()
  await expect(page.getByRole('heading', { name: /Thank you/ })).toBeVisible()
  expect(await violations(page)).toEqual([])
})
