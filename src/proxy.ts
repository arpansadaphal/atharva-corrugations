import { NextResponse, type NextRequest } from 'next/server'
import { families } from '@/data/products'

/**
 * Real 404s for unknown product families. Params that generateStaticParams
 * did not return render on request, and a notFound() there comes after the
 * response has started, so the status would stay 200 (a soft 404). Checking
 * here, before rendering, keeps it a true 404. Rewriting to a path no route
 * matches makes Next.js serve the not-found page with a 404 status.
 */
const slugs = new Set<string>(families.map((f) => f.slug))

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/')[2]
  if (slug && !slugs.has(slug)) {
    return NextResponse.rewrite(new URL('/__not-found', request.url))
  }
}

export const config = {
  matcher: '/products/:family',
}
