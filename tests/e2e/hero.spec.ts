import { expect, test } from '@playwright/test'

// Roadmap §6 Home acceptance:
// on 390×844 the first screen shows the H1, the primary CTA, the WhatsApp CTA
// and at least three strip cells without scrolling.
test.use({ viewport: { width: 390, height: 844 } })

test('homepage hero fits the 390×844 first screen', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('section').first()
  // the preview banner only exists on staging; measure from the hero as if it sat under the header
  const limit = (await hero.boundingBox())!.y - 72 + 844

  const bottomOf = async (loc: ReturnType<typeof hero.locator>) => {
    const b = (await loc.boundingBox())!
    return b.y + b.height
  }
  expect(await bottomOf(hero.getByRole('heading', { level: 1 }))).toBeLessThanOrEqual(limit)
  expect(await bottomOf(hero.getByRole('link', { name: 'Request a quote' }))).toBeLessThanOrEqual(limit)
  expect(await bottomOf(hero.getByRole('link', { name: 'Chat on WhatsApp' }))).toBeLessThanOrEqual(limit)
  const cells = hero.locator('dl:visible > div')
  expect(await cells.count()).toBeGreaterThanOrEqual(3)
  expect(await bottomOf(cells.nth(2))).toBeLessThanOrEqual(limit)
})
