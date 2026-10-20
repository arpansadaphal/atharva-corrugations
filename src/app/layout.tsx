import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { Gated } from '@/components/ui/Gated'
import { group } from '@/group/group'
import { getClaimsMode } from '@/lib/claims'
import './globals.css'

// Weights 300–600 only; 200 is dropped (D-08)
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  title: {
    default: 'Corrugated Box Manufacturer in Pune | Atharva Corrugations',
    template: '%s | Atharva Corrugations',
  },
  description:
    'Corrugated boxes, die-cut and heavy-duty packaging made at our Ranjangaon MIDC plant, Pune, with in-house design support. Request a quote.',
  // Nothing is indexed until the claims gate is active (LAUNCH=true)
  robots: getClaimsMode() === 'production' ? undefined : { index: false, follow: false },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-accent px-4 py-3 text-ui font-semibold text-on-dark focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>

        <PreviewBanner />

        {/* Shell placeholder: the navbar arrives in M2 (Sitemap §3) */}
        <header className="border-b border-line bg-paper">
          <div className="container-site flex h-[72px] items-center">
            <Link href="/" className="flex flex-col">
              <span className="text-ui font-semibold text-ink">Atharva Corrugations</span>
              <Gated claim="F-07">
                <span className="text-label text-muted">An {group['G-name'].value} company</span>
              </Gated>
            </Link>
          </div>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        {/* Shell placeholder: the four-column footer arrives in M2. Flat ink, no texture (P-04) */}
        <footer className="bg-ink text-on-dark-body">
          <div className="container-site py-8 text-spec">Atharva Corrugations</div>
        </footer>
      </body>
    </html>
  )
}
