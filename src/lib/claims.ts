import { claims, type ClaimId, type ClaimValue } from '@/data/claims'
import { group } from '@/group/group'
import type { AuditLabel, Claim, ClaimStatus, ClaimsMode } from '@/types/claims'

/**
 * Audit label → render status. CONFLICT is treated as "verify" (sources
 * disagree; the client must settle it) and EXTERNAL as "restricted"
 * (never publishable on its own, Audit §0).
 */
const STATUS_BY_LABEL: Record<AuditLabel, ClaimStatus> = {
  CONFIRMED: 'confirmed',
  VERIFY: 'verify',
  CONFLICT: 'verify',
  MISSING: 'missing',
  EXTERNAL: 'restricted',
  RESTRICTED: 'restricted',
}

export function statusOf(c: Pick<Claim<unknown>, 'label'>): ClaimStatus {
  return STATUS_BY_LABEL[c.label]
}

/**
 * LAUNCH=true is production (claims gate active). Otherwise `next dev` is
 * development and any other build is preview/staging.
 *
 * LAUNCH and CLAIMS_AS_OF are inlined at build time (next.config `env`), so
 * prerendered pages and request-time route handlers always agree. That only
 * works for literal `process.env.X` reads, hence no destructuring here.
 */
export function getClaimsMode(env?: Record<string, string | undefined>): ClaimsMode {
  const launch = env ? env.LAUNCH : process.env.LAUNCH
  const nodeEnv = env ? env.NODE_ENV : process.env.NODE_ENV
  if (launch === 'true') return 'production'
  if (nodeEnv === 'development') return 'development'
  return 'preview'
}

/**
 * The date expiry is judged against while rendering. Prerendering may not
 * read the clock, so the launch build passes its date in CLAIMS_AS_OF (see
 * `build:launch`). check-claims also fails on expired claims before every
 * production build.
 */
function renderDate(): Date | undefined {
  const asOf = process.env.CLAIMS_AS_OF
  return asOf ? new Date(asOf) : undefined
}

/** A claim past its expiry date stops being confirmed. */
export function isExpired(c: Claim<unknown>, asOf: Date | undefined = renderDate()): boolean {
  return Boolean(asOf && c.expiresOn && new Date(c.expiresOn) < asOf)
}

export function isPublishable(c: Claim<unknown>, asOf: Date | undefined = renderDate()): boolean {
  return statusOf(c) === 'confirmed' && !isExpired(c, asOf)
}

/**
 * Whether a claim may appear in the given mode.
 * - production: confirmed (and unexpired) only
 * - preview and development: everything except restricted, so the client can
 *   review unverified copy; development additionally outlines it (<Gated>)
 */
export function isRenderable(c: Claim<unknown>, mode: ClaimsMode = getClaimsMode()): boolean {
  if (statusOf(c) === 'restricted') return false
  if (mode === 'production') return isPublishable(c)
  return true
}

export function getClaim<K extends ClaimId>(id: K): (typeof claims)[K] {
  return claims[id]
}

/** The claim's value if it may render in this mode, otherwise undefined. */
export function gatedValue<K extends ClaimId>(
  id: K,
  mode: ClaimsMode = getClaimsMode(),
): ClaimValue<K> | undefined {
  const c = claims[id]
  return isRenderable(c, mode) ? (c.value as ClaimValue<K>) : undefined
}

/** IDs from `ids` that may render in this mode, in order. */
export function renderableIds<K extends ClaimId>(
  ids: readonly K[],
  mode: ClaimsMode = getClaimsMode(),
): K[] {
  return ids.filter((id) => isRenderable(claims[id], mode))
}

/** Every registry and Group claim, for reports and the preview banner. */
export function allClaims(): Claim<unknown>[] {
  return [...Object.values(claims), ...Object.values(group)]
}

export function unverifiedCount(): number {
  return allClaims().filter((c) => !isPublishable(c) && statusOf(c) !== 'restricted').length
}
