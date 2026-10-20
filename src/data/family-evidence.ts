import { cell, type TitleBlockCell } from '@/components/ui/TitleBlock'
import type { ClaimId } from './claims'
import type { FamilySlug } from './products'

/**
 * Per-family evidence that goes through the claims gate (Sitemap §6.3,
 * Content §3). Server only: it imports the TitleBlock cell builder.
 */

export interface FamilyEvidence {
  /** Applications exactly as the client named them, and the claim that holds them */
  applications: { claim: ClaimId; read: (value: never) => string[] } | null
  /** Construction and board fields (F3); each gated by its own claim */
  specs: TitleBlockCell[]
  /** Approved photographs (shot IDs → /public paths), none yet */
  photos: { src: string; alt: string }[]
}

type F27 = { format: string; ply: number[]; industries: string[] }[]
const row = (i: number) => ({ claim: 'F-27' as ClaimId, read: ((rows: F27) => rows[i].industries) as (value: never) => string[] })

const flutes = cell('F-21', 'Flutes', (f) => f.join(', '))
const gsm = cell('F-23', 'Paper weight', ([lo, hi]) => `${lo} to ${hi} GSM`)
const reel = cell('F-24', 'Reel width', (mm) => `Up to ${mm.toLocaleString('en-IN')} mm`)

export const familyEvidence: Record<FamilySlug, FamilyEvidence> = {
  'corrugated-boxes': {
    applications: row(0),
    specs: [
      cell('F-27', 'Ply', (rows) => `${rows[0].ply.join(' and ')} ply`),
      flutes,
      gsm,
      cell('F-22', 'Paper', (p) => p.join(', ')),
      reel,
    ],
    photos: [],
  },
  'die-cut-boxes': {
    applications: row(1),
    specs: [
      cell('F-29', 'Cutting', (p) => p.converting.filter((x) => /die cutting/i.test(x)).join(', ')),
      cell('F-29', 'Printing', (p) => p.printing.join(', ')),
      flutes,
      gsm,
    ],
    photos: [],
  },
  'heavy-duty-and-export-packaging': {
    applications: row(2),
    specs: [
      cell('F-20', 'Ply', (p) => `${p.filter((n) => n >= 7).join(' and ')} ply`),
      cell('F-29', 'Treatments', (p) => p.protection.join(', ')),
      flutes,
      reel,
    ],
    photos: [],
  },
  // No applications supplied (Q-25)
  'sheets-pads-and-inserts': { applications: null, specs: [gsm, flutes], photos: [] },
  'protective-and-allied-packaging': {
    applications: { claim: 'F-27-allied', read: ((v: { applications: string[] }) => v.applications) as (value: never) => string[] },
    specs: [],
    photos: [],
  },
}
