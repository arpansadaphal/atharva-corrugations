import { getClaimsMode } from '@/lib/claims'
import { rfqConfig } from '@/lib/rfq-config'
import { handleRfq } from '@/lib/rfq-handler'

/** Text only: a full quote request is well under this (Technical §7.3) */
const MAX_BODY_BYTES = 32 * 1024

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return Response.json({ ok: false, code: 'REJECTED' }, { status: 415 })
  }
  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > MAX_BODY_BYTES) return Response.json({ ok: false, code: 'REJECTED' }, { status: 413 })

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return Response.json({ ok: false, code: 'REJECTED' }, { status: 413 })

  let payload: unknown
  try {
    payload = JSON.parse(raw)
  } catch {
    return Response.json({ ok: false, code: 'REJECTED' }, { status: 400 })
  }

  const mode = getClaimsMode()
  const result = await handleRfq(payload, { config: rfqConfig(mode), production: mode === 'production' })
  return Response.json(result.body, { status: result.status })
}
