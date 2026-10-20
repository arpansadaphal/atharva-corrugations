import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { approvals, claimLocations } from '@/data/claim-locations'
import { allClaims, getClaimsMode, isPublishable, isReviewMode, statusOf } from '@/lib/claims'
import type { AuditLabel, Claim } from '@/types/claims'

export const metadata: Metadata = {
  title: 'Review checklist',
  robots: { index: false, follow: false },
}

const LABELS: Partial<Record<AuditLabel, string>> = {
  VERIFY: 'Needs your document or confirmation',
  CONFLICT: 'Sources disagree',
  MISSING: 'Not yet supplied',
}

/** A claim's value in plain words, for the reviewer to check */
function describe(value: unknown): string {
  if (value === true) return 'Yes'
  if (value === '' || value === undefined || value === null) return 'Nothing yet'
  if (Array.isArray(value)) return value.map(describe).join(', ')
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${describe(v)}`)
      .join(' · ')
  }
  return String(value)
}

function ClaimItem({ c }: { c: Claim<unknown> }) {
  const locations = claimLocations[c.id] ?? []
  return (
    <li id={`claim-${c.id}`} className="grid gap-3 border-b border-line py-6 md:grid-cols-12 md:gap-6">
      <div className="flex flex-col gap-1 md:col-span-4">
        <p className="tabular text-label font-semibold text-muted uppercase">{c.id}</p>
        <h3 className="text-copy font-semibold text-ink">{c.title}</h3>
        <p className="text-spec text-muted">{LABELS[c.label] ?? c.label}</p>
      </div>
      <dl className="grid gap-3 text-spec md:col-span-8 md:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink">Shown in this review as</dt>
          <dd className="break-words">{describe(c.value)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">What we need</dt>
          <dd>{c.note ?? 'Your confirmation, with a document where one exists.'}</dd>
        </div>
        <div className="md:col-span-2">
          <dt className="font-semibold text-ink">Where it appears</dt>
          <dd>
            {locations.length === 0 ? (
              'Not shown on the site yet.'
            ) : (
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {locations.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-accent underline underline-offset-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      </dl>
    </li>
  )
}

/**
 * Client review checklist (review builds only; 404 in production). Built
 * from the claims registry and Group constants, so it always matches what
 * the site shows. Nothing here marks a fact confirmed: that happens only in
 * claims.ts, with evidence (Audit §6.2, Content §5).
 */
export default function ReviewPage() {
  if (!isReviewMode(getClaimsMode())) notFound()

  const claims = allClaims()
  const open = claims.filter((c) => !isPublishable(c) && statusOf(c) !== 'restricted')
  const confirmed = claims.filter((c) => isPublishable(c))

  return (
    <>
      <PageHeader
        title="Review checklist"
        eyebrow="Client review"
        description="Everything on this review copy that still needs your confirmation or approval. Facts listed here are outlined with a dashed line on the pages and stay off the live site until you confirm them, with a document where one exists."
      >
        <p className="measure text-spec">
          {open.length} {open.length === 1 ? 'fact' : 'facts'} to confirm, {approvals.length}{' '}
          {approvals.length === 1 ? 'item' : 'items'} to approve, {confirmed.length} already confirmed.
        </p>
      </PageHeader>

      <section data-surface="light" aria-labelledby="to-confirm" className="section-padding bg-paper">
        <div className="container-site flex flex-col gap-6">
          <h2 id="to-confirm" className="text-h2-sm font-normal text-ink lg:text-h2">
            Facts to confirm
          </h2>
          <ul className="border-t border-line">
            {open.map((c) => (
              <ClaimItem key={c.id} c={c} />
            ))}
          </ul>
        </div>
      </section>

      <section data-surface="light" aria-labelledby="to-approve" className="section-padding bg-paper-50">
        <div className="container-site flex flex-col gap-6">
          <h2 id="to-approve" className="text-h2-sm font-normal text-ink lg:text-h2">
            Content to approve
          </h2>
          <ul className="border-t border-line">
            {approvals.map((a) => (
              <li key={a.title} className="flex flex-col gap-2 border-b border-line py-6">
                <h3 className="text-copy font-semibold text-ink">{a.title}</h3>
                <p className="measure text-spec">{a.detail}</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-1 text-spec">
                  {a.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="text-accent underline underline-offset-4">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-surface="light" aria-labelledby="confirmed" className="section-padding bg-paper">
        <div className="container-site flex flex-col gap-6">
          <h2 id="confirmed" className="text-h2-sm font-normal text-ink lg:text-h2">
            Already confirmed
          </h2>
          <details className="border-y border-line py-3">
            <summary className="flex min-h-11 cursor-pointer items-center text-ui font-medium text-ink">
              Show the {confirmed.length} confirmed facts and their sources
            </summary>
            <ul className="pb-4">
              {confirmed.map((c) => (
                <li key={c.id} className="grid gap-1 border-b border-line py-3 text-spec md:grid-cols-12 md:gap-6">
                  <span className="tabular font-semibold text-ink md:col-span-1">{c.id}</span>
                  <span className="md:col-span-3">{c.title}</span>
                  <span className="break-words md:col-span-5">{describe(c.value)}</span>
                  <span className="text-muted md:col-span-3">{c.evidence}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </>
  )
}
