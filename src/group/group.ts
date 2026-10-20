import type { Claim } from '@/types/claims'

/**
 * Atharva Group constants (Technical plan §4.3, §14). The same schema as the
 * claims registry so Group facts carry statuses too. Kept free of
 * Corrugations data so it can be extracted into a shared package later
 * (TD-01). No sister-company list until the client supplies it (Q-26).
 */

const S1 = 'S1 ATHARVA_CORRUGATIONS_INFO.md v1 §1'

export const group = {
  'G-name': {
    id: 'G-name',
    title: 'Group name',
    value: 'Atharva Group',
    label: 'CONFIRMED',
    evidence: S1,
    verifiedOn: '2026-10-12',
    note: 'Final naming ("Atharva Group" or "Atharva Group of Industries") open (Q-26)',
  },
  'F-08': {
    id: 'F-08',
    title: 'Group office',
    value: {
      line1: 'Office No. 215, Tower 2, World Trade Center',
      line2: 'Opp. EON Free Zone, Kharadi',
      city: 'Pune',
      region: 'Maharashtra',
      postalCode: '411014',
      country: 'IN',
      owner: 'Atharva Corporate Management Pvt. Ltd.',
    },
    label: 'CONFIRMED',
    evidence: S1,
    verifiedOn: '2026-10-12',
  },
  'F-09': {
    id: 'F-09',
    title: 'Founders',
    value: ['Mansing Nanasaheb Pachundkar', 'Sanjay Kumar Harishchandra Mache'],
    label: 'VERIFY',
    note: 'Spelling and approval to be confirmed (C-16, Q-27)',
  },
} satisfies Record<string, Claim<unknown>>

export type GroupClaimId = keyof typeof group
