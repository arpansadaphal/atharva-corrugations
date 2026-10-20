/** Text only: a full enquiry is well under this (Technical §7.3) */
const MAX_BODY_BYTES = 32 * 1024

/**
 * Reads a small JSON request body for the enquiry routes. Returns the
 * payload, or the Response to send when the request is not acceptable.
 */
export async function readJson(request: Request): Promise<{ payload: unknown } | { response: Response }> {
  const reject = (status: number) => ({ response: Response.json({ ok: false, code: 'REJECTED' }, { status }) })
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reject(415)
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return reject(413)

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return reject(413)
  try {
    return { payload: JSON.parse(raw) }
  } catch {
    return reject(400)
  }
}
