import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { Gated } from '@/components/ui/Gated'
import { group } from '@/group/group'
import { gatedValue, getClaimsMode } from '@/lib/claims'
import { productLinks } from '@/lib/mcb'
import './globals.css'

// Weights 300–600 only; 200 is dropped (D-08)
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

// Canonical origin, the www form (Technical §4.4); env overrides for staging
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.atharvacorrugations.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  // Resolved here, on the server: client components cannot evaluate the claims gate
  const whatsappNumber = gatedValue('F-12')?.whatsapp

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

        <Navbar
          groupName={gatedValue('F-07') ? group['G-name'].value : undefined} whatsappNumber={whatsappNumber}
          productLinks={productLinks()}
        />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />

        {whatsappNumber && (
          <Gated claim="F-58">
            <FloatingWhatsApp number={whatsappNumber} />
          </Gated>
        )}
      </body>
    </html>
  )
}
