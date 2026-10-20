import type { Claim } from '@/types/claims'

/**
 * Claims registry — the single source of truth for every company fact
 * (Technical plan §4.3). IDs and labels follow CORRUGATIONS_SOURCE_AUDIT.md §3.
 *
 * Rules:
 * - Components never type a number or capability; they read it from here
 *   through <Gated> or `gatedValue`.
 * - RESTRICTED facts (revenue, capacity, area, team size, MOQ…) are not
 *   stored here at all: they never render, so they never need a value.
 * - S1 is the client's information file (ATHARVA_CORRUGATIONS_INFO.md v1,
 *   12 Oct 2026). A CONFIRMED label here means "stated by the client in S1".
 */

const S1 = 'S1 ATHARVA_CORRUGATIONS_INFO.md v1 (client Form B, 9 Oct 2026)'
const AUDITED = '2026-10-12'
const AUDITOR = 'Source audit (CORRUGATIONS_SOURCE_AUDIT.md v1.0)'

function claim<T>(c: Claim<T>): Claim<T> {
  return c
}

export const claims = {
  // ── A. Identity and group ──────────────────────────────────────────────
  'F-01': claim({
    id: 'F-01',
    title: 'Legal name',
    value: 'Atharva Corrugations Pvt. Ltd.',
    label: 'VERIFY',
    note: 'Display name is safe; a legal-name line waits for the certificate (Q-10)',
  }),
  'F-02': claim({
    id: 'F-02',
    title: 'Business type',
    value: 'Manufacturer',
    label: 'CONFIRMED',
    evidence: `${S1} §1`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
  }),
  'F-03': claim({
    id: 'F-03',
    title: 'Operating since',
    value: 2014,
    label: 'CONFIRMED',
    evidence: `${S1} §1`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
    note: 'Always "operating since"; never "established" or "incorporated" (C-05)',
  }),
  'F-04': claim({
    id: 'F-04',
    title: 'Manufacturing plants',
    value: 1,
    label: 'CONFIRMED',
    evidence: S1,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
  }),
  'F-05': claim({
    id: 'F-05',
    title: 'Plant address',
    value: {
      line1: 'Gat No. 544/542, Dhok Sangavi',
      line2: 'Ranjangaon MIDC, Ranjangaon',
      city: 'Pune',
      region: 'Maharashtra',
      postalCode: '412220',
      country: 'IN',
    },
    label: 'CONFIRMED',
    evidence: S1,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
    note: 'Gat order 544/542 vs 542/544 still to be confirmed (C-04, Q-10)',
  }),
  'F-07': claim({
    id: 'F-07',
    title: 'Part of the Atharva Group',
    value: true,
    label: 'CONFIRMED',
    evidence: `${S1} §1`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
  }),

  // ── B. Contact and routing ─────────────────────────────────────────────
  'F-12': claim({
    id: 'F-12',
    title: 'Phone numbers',
    value: { main: '9960378111', sales: '7720099628', whatsapp: '9960378111' },
    label: 'CONFIRMED',
    evidence: `${S1} §3`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
  }),
  'F-13': claim({
    id: 'F-13',
    title: 'Email addresses',
    value: {
      sales: 'sales@atharvacorrugations.com',
      general: 'saket.ithape@atharvacorrugations.com',
      hr: 'hr@atharvacorrugations.com',
      careersPhone: '7720099645',
    },
    label: 'CONFIRMED',
    evidence: `${S1} §3`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
    note: 'Personal address shown publicly at the client’s request (C-13)',
  }),
  'F-14': claim({
    id: 'F-14',
    title: 'Business hours',
    value: {
      days: 'Monday to Saturday',
      hours: '9 am to 6 pm',
      closed: 'Sundays and national holidays',
    },
    label: 'CONFIRMED',
    evidence: `${S1} §3`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
  }),
  'F-15': claim({
    id: 'F-15',
    title: 'Map link',
    value: 'https://maps.app.goo.gl/52zgy1Ph6ZA4HyK6A',
    label: 'VERIFY',
    note: 'Confirm the pin is the plant',
  }),
  'F-16': claim({
    id: 'F-16',
    title: 'Reply time',
    value: 2,
    label: 'CONFIRMED',
    evidence: `${S1} §3`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
    note: 'Working days, for quote, product, technical and sample enquiries',
  }),

  'F-58': claim({
    id: 'F-58',
    title: 'Floating WhatsApp button',
    value: true,
    label: 'VERIFY',
    note: 'Proposed for consistency with Group sites; client to confirm (Q-29)',
  }),

  // ── C. Board specification ─────────────────────────────────────────────
  'F-20': claim({
    id: 'F-20',
    title: 'Ply range',
    value: [3, 5, 7, 9],
    label: 'VERIFY',
    note: 'Nine-ply construction to confirm (C-09, Q-18)',
  }),
  'F-21': claim({
    id: 'F-21',
    title: 'Flutes',
    value: ['A', 'B', 'C', 'BC'],
    label: 'VERIFY',
    note: 'Combinations BCB, CA, AA, AAA, ACA to be confirmed (Q-18)',
  }),
  'F-23': claim({
    id: 'F-23',
    title: 'GSM range',
    value: [120, 440] as [number, number],
    label: 'VERIFY',
  }),
  'F-24': claim({
    id: 'F-24',
    title: 'Maximum reel width (mm)',
    value: 2200,
    label: 'VERIFY',
    note: 'Corrugator or paper-reel width? (Q-04)',
  }),

  // ── E. Quality and certification ───────────────────────────────────────
  'F-38': claim({
    id: 'F-38',
    title: 'Quality practices',
    value: [
      'Incoming paper inspection (GSM, moisture)',
      'Bursting strength',
      'Box compression',
      'Edge crush',
      'Moisture',
      'Dimensional checks',
      'Print quality',
      'Final inspection',
      'Batch traceability',
      'In-house laboratory',
    ],
    label: 'VERIFY',
    note: 'Name the practices, not standards, until QA documents arrive (Q-21)',
  }),
  'F-39': claim({
    id: 'F-39',
    title: 'Customers audit and approve the plant',
    value: true,
    label: 'CONFIRMED',
    evidence: `${S1} §6.1`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
    note: 'Unnamed statement only',
  }),
  'F-40': claim({
    id: 'F-40',
    title: 'ISO 9001:2015 certificate',
    value: { standard: 'ISO 9001:2015', issuer: 'TUV', certificateNo: '99 100 24495' },
    label: 'VERIFY',
    expiresOn: '2028-09-01',
    note: 'Publish only after the certificate is seen (Q-03)',
  }),
  'F-42': claim({
    id: 'F-42',
    title: 'EcoVadis rating',
    value: { medal: 'Bronze' },
    label: 'VERIFY',
    note: 'A rating, not a certification; show with year once the scorecard arrives (Q-15)',
  }),

  // ── F. Industries ──────────────────────────────────────────────────────
  'F-45': claim({
    id: 'F-45',
    title: 'Industries served',
    value: [
      'Automotive and auto components',
      'FMCG',
      'Food and beverage',
      'Pharma and healthcare',
      'E-commerce and retail',
      'Electrical and electronics',
      'Industrial and engineering',
      'Agriculture and produce',
      'Appliances',
      'Textiles',
      'Chemicals',
      'Export packaging',
    ],
    label: 'CONFIRMED',
    evidence: `${S1} §7`,
    verifiedOn: AUDITED,
    verifiedBy: AUDITOR,
    note: 'Export packaging is a product type, never an export claim (C-01)',
  }),

  // ── H. Legal identifiers ───────────────────────────────────────────────
  'F-64': claim({
    id: 'F-64',
    title: 'GSTIN',
    value: '27AALCA5293R1ZR',
    label: 'VERIFY',
    note: 'Footer after the GST certificate is seen (Q-10)',
  }),
  'F-65': claim({
    id: 'F-65',
    title: 'CIN',
    value: 'U74900PN2013PTC146924',
    label: 'VERIFY',
    note: 'Footer after reconfirmation (Q-10)',
  }),
  'F-66': claim({
    id: 'F-66',
    title: 'Privacy policy published',
    value: '/privacy-policy',
    label: 'MISSING',
    note: 'Client policy not received (Q-09). Forms stay offline in production until it is published',
  }),
} satisfies Record<string, Claim<unknown>>

export type ClaimId = keyof typeof claims
export type ClaimValue<K extends ClaimId> = (typeof claims)[K]['value']

/**
 * Groups with a minimum number of rendered cells (Technical §4.3).
 * check-claims fails a production build when a group falls below its minimum.
 */
export const claimGroups = {
  heroStrip: {
    description: 'Homepage hero capability strip (Sitemap §6.1 H1)',
    ids: ['F-03', 'F-04', 'F-07', 'F-20', 'F-23', 'F-40'] as ClaimId[],
    min: 3,
  },
} as const
