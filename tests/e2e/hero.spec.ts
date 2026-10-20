import { expect, test } from '@playwright/test'

// Roadmap §6 Home acceptance, checked on the G2 comp until the homepage exists:
// on 390×844 the first screen shows the H1, the primary CTA, the WhatsApp CTA
// and at least three strip cells without scrolling.
test.use({ viewport: { width: 390, height: 844 } })

for (const variant of [0, 1]) {
  test(`hero variant ${variant + 1} fits the 390×844 first screen`, async ({ page }) => {
    await page.goto('/specimen/home')
    const hero = page.locator('section').nth(1 + variant)
    const top = (await hero.boundingBox())!.y
    const headerHeight = 72
    const limit = top - headerHeight + 844 // the hero would start right under the header

    const bottomOf = async (loc: ReturnType<typeof hero.locator>) => {
      const b = (await loc.boundingBox())!
      return b.y + b.height
    }
    expect(await bottomOf(hero.getByRole('heading', { level: 2 }))).toBeLessThanOrEqual(limit)
    expect(await bottomOf(hero.getByRole('link', { name: 'Request a quote' }))).toBeLessThanOrEqual(limit)
    expect(await bottomOf(hero.getByRole('link', { name: 'Chat on WhatsApp' }))).toBeLessThanOrEqual(limit)
    const cells = hero.locator('dl:visible > div')
    expect(await cells.count()).toBeGreaterThanOrEqual(3)
    expect(await bottomOf(cells.nth(2))).toBeLessThanOrEqual(limit)
  })
}
