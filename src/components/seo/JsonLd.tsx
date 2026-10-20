import { jsonLd } from '@/lib/schema'

/** Structured data script (Next.js JSON-LD guide: rendered in the page, "<" escaped) */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
}
