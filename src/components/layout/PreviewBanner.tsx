import Link from 'next/link'
import { isReviewMode, unverifiedCount } from '@/lib/claims'
import { ReviewMarksToggle } from './ReviewMarksToggle'

/**
 * Client review banner (preview and development builds; never production,
 * Technical plan §4.3). Says how many facts await confirmation, how they are
 * marked on the page, and links to the review checklist.
 */
export function PreviewBanner() {
  if (!isReviewMode()) return null
  const n = unverifiedCount()

  return (
    <aside aria-label="Review copy" className="bg-kraft-200 text-ink">
      <div className="container-site flex flex-col gap-1 py-2 text-spec md:flex-row md:items-center md:justify-between md:gap-6">
        <p>
          <span className="font-semibold">Review copy.</span>{' '}
          {n > 0
            ? `${n} ${n === 1 ? 'fact is' : 'facts are'} not yet confirmed. They are outlined with a dashed line and stay off the live site until confirmed.`
            : 'Every fact on this site is confirmed.'}
        </p>
        <p className="flex shrink-0 items-center gap-4">
          <Link href="/review" className="min-h-11 content-center font-semibold underline underline-offset-4">
            Review checklist
          </Link>
          {n > 0 && <ReviewMarksToggle />}
        </p>
      </div>
    </aside>
  )
}
