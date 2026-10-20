import { expect, test, type Page } from '@playwright/test'

const events = (page: Page) => page.evaluate(() => window.acplEvents ?? [])

/** Stop links navigating (tel:, wa.me) while keeping our capture-phase listener */
const holdNavigation = (page: Page) => page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault()))

test.skip(!!process.env.CONSENT_TEST, 'consent build runs consent.spec.ts only')

test.describe('analytics events (Technical §10)', () => {
  test('WhatsApp, phone and product clicks are recorded with location and token', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await holdNavigation(page)
    await page.locator('header a[data-location="nav"]').click()
    await page.locator('footer a[data-event="phone_click"]').first().click()
    await page.goto('/products')
    await holdNavigation(page)
    await page.locator('article#die-cut-boxes a[data-event="product_cta_click"]').click()
    const recorded = await events(page)
    expect(recorded).toContainEqual({ event: 'product_cta_click', params: expect.objectContaining({ family: 'die-cut-boxes', page: '/products' }) })
  })

  test('nav WhatsApp click carries the page token', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await holdNavigation(page)
    await page.locator('header a[data-location="nav"]').click()
    await page.locator('footer a[data-event="phone_click"]').first().click()
    const recorded = await events(page)
    expect(recorded).toContainEqual({ event: 'whatsapp_click', params: expect.objectContaining({ location: 'nav', token: 'WEB-HOME', page: '/' }) })
    expect(recorded).toContainEqual({ event: 'phone_click', params: expect.objectContaining({ location: 'footer' }) })
  })

  test('quote form records start and success; UTM from landing travels with the enquiry', async ({ page }) => {
    let body: { source?: { utm?: Record<string, string> } } = {}
    await page.route('/api/rfq', async (route) => {
      body = route.request().postDataJSON()
      await route.fulfill({ json: { ok: true, reference: 'ACQ-261020-TEST' } })
    })
    await page.goto('/?utm_source=google&utm_campaign=boxes')
    await page.getByRole('link', { name: 'Request a quote' }).first().click()
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
    expect(body.source?.utm).toEqual({ utm_source: 'google', utm_campaign: 'boxes' })
    const names = (await events(page)).map((e) => e.event)
    expect(names).toContain('rfq_start')
    expect(names).toContain('rfq_submit_success')
  })

  test('without a GA ID nothing is sent to Google and there is no notice', async ({ page }) => {
    const google: string[] = []
    page.on('request', (r) => {
      if (/google-analytics|googletagmanager/.test(r.url())) google.push(r.url())
    })
    await page.goto('/')
    await expect(page.getByRole('region', { name: 'Analytics choice' })).toHaveCount(0)
    expect(google).toEqual([])
  })
})

test.describe('SEO (Technical §6)', () => {
  test('home carries Organization and WebSite JSON-LD; inner pages carry BreadcrumbList', async ({ page }) => {
    await page.goto('/')
    const types = await page.locator('script[type="application/ld+json"]').evaluateAll((s) => s.map((x) => JSON.parse(x.textContent!)['@type']))
    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite']))
    await page.goto('/industries')
    const crumbs = await page.locator('script[type="application/ld+json"]').evaluateAll((s) => s.map((x) => JSON.parse(x.textContent!)))
    expect(crumbs).toContainEqual(expect.objectContaining({ '@type': 'BreadcrumbList' }))
  })

  test('sitemap, robots, share image and staging noindex header', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    expect(await sitemap.text()).toContain('<loc>https://www.atharvacorrugations.com/industries</loc>')
    expect(await (await request.get('/robots.txt')).text()).toMatch(/Disallow: \//)
    const og = await request.get('/opengraph-image')
    expect(og.headers()['content-type']).toBe('image/png')
    expect((await request.get('/')).headers()['x-robots-tag']).toBe('noindex, nofollow')
  })

  test('every page has a canonical URL and a description', async ({ page }) => {
    for (const path of ['/', '/products', '/industries', '/custom-packaging', '/manufacturing-and-quality', '/about', '/contact', '/request-quote']) {
      await page.goto(path)
      await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute('href', new RegExp(`^https://www\\.atharvacorrugations\\.com${path === '/' ? '$' : path}`))
      await expect(page.locator('meta[name="description"]'), path).toHaveAttribute('content', /.{50,}/)
    }
  })
})

test('privacy policy draft is visible for review in preview and linked from the footer', async ({ page }) => {
  await page.goto('/privacy-policy')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy policy')
  await expect(page.getByRole('note')).toContainText('Draft for the company')
  await expect(page.locator('footer').getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy-policy')
})
