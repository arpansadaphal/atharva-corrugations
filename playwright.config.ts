import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end checks against a production-mode build of the preview site.
 * Locally they run on the installed Chrome (no browser download); CI uses
 * Playwright's own Chromium.
 */
const PORT = 3107

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...(process.env.CI ? {} : { channel: 'chrome' }),
  },
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'], ...(process.env.CI ? {} : { channel: 'chrome' }) } }],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
})
