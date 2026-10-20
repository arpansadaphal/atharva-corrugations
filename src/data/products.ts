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
}

export const families: Family[] = [
  { slug: 'corrugated-boxes', name: 'Corrugated boxes', shortName: 'corrugated boxes', mcb: 'pending', token: 'WEB-BOXES' },
  { slug: 'die-cut-boxes', name: 'Die-cut boxes', shortName: 'die-cut boxes', mcb: 'pending', token: 'WEB-DIECUT' },
  {
    slug: 'heavy-duty-and-export-packaging',
    name: 'Heavy-duty and export packaging',
    shortName: 'heavy-duty packaging',
    mcb: 'pending',
    token: 'WEB-HEAVY',
  },
  // No applications supplied yet (Q-25), so it fails the MCB and folds into the hub
  { slug: 'sheets-pads-and-inserts', name: 'Sheets, pads and inserts', shortName: 'sheets, pads and inserts', mcb: 'fail', token: 'WEB-SHEETS' },
  {
    slug: 'protective-and-allied-packaging',
    name: 'Protective and allied packaging',
    shortName: 'protective packaging',
    mcb: 'pending',
    token: 'WEB-PROTECTIVE',
  },
]

/** Folded families link to their section on the hub, never to a missing page. */
export function familyHref(f: Pick<Family, 'slug' | 'mcb'>): string {
  return f.mcb === 'fail' ? `/products#${f.slug}` : `/products/${f.slug}`
}
