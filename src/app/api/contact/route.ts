import { getClaimsMode } from '@/lib/claims'
import { handleContact } from '@/lib/contact-handler'
import { readJson } from '@/lib/read-json'
import { rfqConfig } from '@/lib/rfq-config'

export async function POST(request: Request) {
  const body = await readJson(request)
  if ('response' in body) return body.response

  const mode = getClaimsMode()
  const result = await handleContact(body.payload, { config: rfqConfig(mode), production: mode === 'production' })
  return Response.json(result.body, { status: result.status })
}
