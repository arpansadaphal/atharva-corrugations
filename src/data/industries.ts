import type { FamilySlug } from './products'

/**
 * Industries (Sitemap §6.1 H4, §6.4). The client's four (claim F-46). What is
 * packed comes only from the product mapping (claim F-27); packaging
 * considerations are general guidance gated on the client's technical
 * review (F-18-copy, SD-10). No compliance wording for pharma or food (C-11).
 */
export interface Industry {
  slug: string
  name: string
  /** Homepage one-liner, from F-27 */
  line: string
  /** Rows of claim F-27 whose formats this industry uses */
  mappingRows: number[]
  families: FamilySlug[]
  /** General guidance; shown only after technical review */
  considerations: string
}

export const topIndustries: Industry[] = [
  {
    slug: 'white-goods',
    name: 'White goods',
    line: 'Regular slotted boxes in 3 and 5 ply.',
    mappingRows: [0],
    families: ['corrugated-boxes'],
    considerations: 'Large appliances need stacking strength in the warehouse and protection for edges and corners in handling.',
  },
  {
    slug: 'engineering-goods',
    name: 'Engineering goods',
    line: 'Die-cut and heavy-duty packs for engineering goods and parts.',
    mappingRows: [1, 2],
    families: ['die-cut-boxes', 'heavy-duty-and-export-packaging'],
    considerations: 'Dense, heavy parts need board that resists puncture and inserts that stop them moving in transit.',
  },
  {
    slug: 'fmcg',
    name: 'FMCG',
    line: 'Regular slotted boxes in 3 and 5 ply, made to your size.',
    mappingRows: [0],
    families: ['corrugated-boxes'],
    considerations: 'High volumes call for consistent sizes, clean print and boxes that stack well on pallets.',
  },
  {
    slug: 'pharma-healthcare',
    name: 'Pharma and healthcare',
    line: 'Corrugated boxes made to your specification.',
    mappingRows: [],
    families: ['corrugated-boxes'],
    considerations: 'Outer cartons need consistent sizes and clear print for labelling.',
  },
]

/** "Also serving" (claim F-45 minus the four; export packaging is a product type, C-01) */
export const alsoServing = [
  'Automotive and auto components',
  'Food and beverage',
  'E-commerce and retail',
  'Electrical and electronics',
  'Agriculture and produce',
  'Textiles',
  'Chemicals',
]
