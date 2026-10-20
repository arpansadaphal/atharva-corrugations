import { getClaimsMode } from '@/lib/claims'
import { readJson } from '@/lib/read-json'
import { rfqConfig } from '@/lib/rfq-config'
import { handleRfq } from '@/lib/rfq-handler'

export async function POST(request: Request) {
  const body = await readJson(request)
  if ('response' in body) return body.response

  const mode = getClaimsMode()
  const result = await handleRfq(body.payload, { config: rfqConfig(mode), production: mode === 'production' })
  return Response.json(result.body, { status: result.status })
}
