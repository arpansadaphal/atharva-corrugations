/**
 * Product families (Sitemap §2, §6.3). Copy and specifications arrive with
 * the products milestone (M5); this file only fixes slugs, names and each
 * family's minimum-content-bar status, which decides where links point.
 */

export type FamilySlug =
  | 'corrugated-boxes'
  | 'die-cut-boxes'
  | 'heavy-duty-and-export-packaging'
  | 'sheets-pads-and-inserts'
  | 'protective-and-allied-packaging'

/**
 * MCB (Strategy SD-01): 'pass' → own page; 'fail' → folded into the hub as an
 * anchored section; 'pending' → own page planned, evidence still arriving.
 */
export type McbStatus = 'pass' | 'pending' | 'fail'

export interface Family {
  slug: FamilySlug
  name: string
  /** Lower-case form for running text and WhatsApp messages */
  shortName: string
  mcb: McbStatus
  /** WhatsApp source token (Technical §10) */
  token: string
  /** One-line description for the family index (Sitemap §6.1 H2) */
  summary: string
  /** Formats confirmed in Audit F-18 */
  formats: string[]
  /** Claim the summary depends on, when it is not covered by F-18 */
  summaryClaim?: 'F-27-allied'
}

export const families: Family[] = [
  {
    slug: 'corrugated-boxes',
    name: 'Corrugated boxes',
    shortName: 'corrugated boxes',
    mcb: 'pending',
    token: 'WEB-BOXES',
    summary: 'Regular slotted, telescopic and full-overlap boxes, made to your size.',
    formats: ['RSC', 'Telescopic', 'Full overlap'],
  },
  {
    slug: 'die-cut-boxes',
    name: 'Die-cut boxes',
    shortName: 'die-cut boxes',
    mcb: 'pending',
    token: 'WEB-DIECUT',
    summary: 'Boxes cut to a custom shape from your drawing or sample.',
    formats: ['Die-cut'],
  },
  {
    slug: 'heavy-duty-and-export-packaging',
    name: 'Heavy-duty and export packaging',
    shortName: 'heavy-duty packaging',
    mcb: 'pending',
    token: 'WEB-HEAVY',
    summary: 'Heavy-duty and export-type boxes for heavy and engineered parts.',
    formats: ['Heavy-duty', 'Export type'],
  },
  // No applications supplied yet (Q-25), so it fails the MCB and folds into the hub
  {
    slug: 'sheets-pads-and-inserts',
    name: 'Sheets, pads and inserts',
    shortName: 'sheets, pads and inserts',
    mcb: 'fail',
    token: 'WEB-SHEETS',
    summary: 'Sheets, layer pads, partitions, inserts, dividers and rolls.',
    formats: ['Sheets', 'Layer pads', 'Partitions', 'Inserts', 'Rolls'],
  },
  {
    slug: 'protective-and-allied-packaging',
    name: 'Protective and allied packaging',
    shortName: 'protective packaging',
    mcb: 'pending',
    token: 'WEB-PROTECTIVE',
    summary: 'Paper core assemblies, angle corners, honeycomb and pulp trays.',
    formats: ['Paper cores', 'Angle corners', 'Honeycomb', 'Pulp trays'],
    summaryClaim: 'F-27-allied',
  },
]

/** Folded families link to their section on the hub, never to a missing page. */
export function familyHref(f: Pick<Family, 'slug' | 'mcb'>): string {
  return f.mcb === 'fail' ? `/products#${f.slug}` : `/products/${f.slug}`
}
