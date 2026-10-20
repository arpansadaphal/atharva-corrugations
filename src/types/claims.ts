/**
 * Claim model — CORRUGATIONS_TECHNICAL_IMPLEMENTATION_PLAN.md §4.2.
 *
 * `label` is the status the Source Audit gives the fact. The render status
 * is derived from it (see `statusOf` in lib/claims.ts) so the two can never
 * disagree. A fact moves to CONFIRMED only when its evidence is in hand.
 */
export type AuditLabel =
  | 'CONFIRMED'
  | 'VERIFY'
  | 'EXTERNAL'
  | 'MISSING'
  | 'CONFLICT'
  | 'RESTRICTED'

export type ClaimStatus = 'confirmed' | 'verify' | 'missing' | 'restricted'

export interface Claim<T> {
  /** Audit fact ID, e.g. 'F-23' */
  id: string
  /** What the fact is, for reports and dev tooltips */
  title: string
  value: T
  label: AuditLabel
  /** File name or note; required once the claim is CONFIRMED */
  evidence?: string
  /** ISO date; required once the claim is CONFIRMED */
  verifiedOn?: string
  verifiedBy?: string
  /** ISO date for time-limited claims (certificate validity, annual ratings) */
  expiresOn?: string
  note?: string
}

/** Where the site is being rendered; decides which claims may appear. */
export type ClaimsMode = 'development' | 'preview' | 'production'
