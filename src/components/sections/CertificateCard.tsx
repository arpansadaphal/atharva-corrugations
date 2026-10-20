import { Gated } from '@/components/ui/Gated'
import { getClaim } from '@/lib/claims'

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/**
 * Certificate card (Design §8, Master Plan §5.9 reuse): crisp rectangle, no
 * radius, verified items only. ISO 9001:2015 renders only once the
 * certificate itself has been seen (Q-03).
 */
export function IsoCertificateCard() {
  const expires = getClaim('F-40').expiresOn
  return (
    <Gated claim="F-40" as="div">
      {(iso) => (
        <div className="flex max-w-xs flex-col gap-3 border border-line bg-paper p-6">
          <p className="text-label font-semibold text-muted uppercase">Certificate</p>
          <p className="text-h3 font-medium text-ink">{iso.standard}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-spec">
            <dt className="text-muted">Scope</dt>
            <dd>Quality management system</dd>
            {expires && (
              <>
                <dt className="text-muted">Valid to</dt>
                <dd className="tabular">{DATE.format(new Date(expires))}</dd>
              </>
            )}
            <dt className="text-muted">Certificate</dt>
            <dd className="tabular">{iso.certificateNo}</dd>
          </dl>
        </div>
      )}
    </Gated>
  )
}
