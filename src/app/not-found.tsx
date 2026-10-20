import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { quoteHref } from '@/data/navigation'

export const metadata: Metadata = {
  title: 'Page not found',
}

/** Branded 404 (Sitemap §6.10). Next.js adds `noindex` automatically. */
export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="container-site flex flex-col gap-8">
        <SectionHeader
          eyebrow="Page not found"
          headline="We could not find that page."
          headingLevel="h1"
          description="The link may be old, or the page may have moved. These will get you back on track."
        />
        <div className="flex flex-wrap items-center gap-4">
          <Button href={quoteHref}>Request a quote</Button>
          <Button href="/products" variant="outline">
            View products
          </Button>
          <Link href="/contact" className="nav-underline py-2 text-ui font-medium text-ink hover:text-accent">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
