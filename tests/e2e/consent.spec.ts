import { expect, test } from '@playwright/test'

/**
 * Runs only against a build with a GA ID: CONSENT_TEST=1 and
 * NEXT_PUBLIC_GA_ID=G-TEST (see README). Google is blocked at the network,
 * so nothing is sent while checking that the script loads only after Accept.
 */
test.skip(!process.env.CONSENT_TEST, 'needs a build with NEXT_PUBLIC_GA_ID')

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com/, (r) => r.fulfill({ status: 204, body: '' }))
})

const gaRequests = (page: import('@playwright/test').Page) => {
  const urls: string[] = []
  page.on('request', (r) => {
    if (/googletagmanager/.test(r.url())) urls.push(r.url())
  })
  return urls
}

test('nothing loads before a choice; Accept loads GA under the CSP and is remembered', async ({ page }) => {
  const urls = gaRequests(page)
  await page.addInitScript(() => {
    ;(window as unknown as { csp: string[] }).csp = []
    document.addEventListener('securitypolicyviolation', (e) => (window as unknown as { csp: string[] }).csp.push(e.blockedURI))
  })
  await page.goto('/')
  const notice = page.getByRole('region', { name: 'Analytics choice' })
  await expect(notice).toBeVisible()
  expect(urls).toEqual([])
  await notice.getByRole('button', { name: 'Accept' }).click()
  await expect(notice).toBeHidden()
  await expect.poll(() => urls.length).toBeGreaterThan(0)
  expect(await page.evaluate(() => (window as unknown as { csp: string[] }).csp)).toEqual([])
  await page.reload()
  await expect(page.getByRole('region', { name: 'Analytics choice' })).toHaveCount(0)
})

test('Decline loads nothing; the footer lets the visitor change their mind', async ({ page }) => {
  const urls = gaRequests(page)
  await page.goto('/')
  await page.getByRole('region', { name: 'Analytics choice' }).getByRole('button', { name: 'Decline' }).click()
  await page.reload()
  expect(urls).toEqual([])
  await page.locator('footer').getByRole('button', { name: 'Analytics choices' }).click()
  await expect(page.getByRole('region', { name: 'Analytics choice' })).toBeVisible()
})
