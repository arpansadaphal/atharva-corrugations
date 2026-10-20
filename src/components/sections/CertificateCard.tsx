import type { ReactNode } from 'react'
import { Gated } from '@/components/ui/Gated'
import { getClaim } from '@/lib/claims'
import type { ClaimsMode } from '@/types/claims'

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/**
 * Certificate card (Design §8, Master Plan §5.9 reuse): crisp rectangle, no
 * radius, verified items only.
 */
function Card({ kind, title, rows }: { kind: string; title: string; rows: [string, ReactNode][] }) {
  return (
    <div className="flex h-full flex-col gap-3 border border-line bg-paper p-6">
      <p className="text-label font-semibold text-muted uppercase">{kind}</p>
      <p className="text-h3 font-medium text-ink">{title}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-spec">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="tabular">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** ISO 9001:2015, only once the certificate itself has been seen (Q-03) */
export function IsoCertificateCard({ mode }: { mode?: ClaimsMode }) {
  const expires = getClaim('F-40').expiresOn
  return (
    <Gated claim="F-40" as="div" mode={mode}>
      {(iso) => (
        <Card
          kind="Certificate"
          title={iso.standard}
          rows={[
            ['Issued by', iso.issuer],
            ...(expires ? [['Valid to', DATE.format(new Date(expires))] as [string, ReactNode]] : []),
            ['Number', iso.certificateNo],
          ]}
        />
      )}
    </Gated>
  )
}

/** EcoVadis: a rating, never called a certification; shown with its year (Q-15) */
export function EcoVadisCard({ mode }: { mode?: ClaimsMode }) {
  return (
    <Gated claim="F-42" as="div" mode={mode}>
      {(r) => (
        <Card
          kind="Sustainability rating"
          title={`EcoVadis ${r.medal}`}
          rows={r.year ? [['Year', r.year]] : []}
        />
      )}
    </Gated>
  )
}
