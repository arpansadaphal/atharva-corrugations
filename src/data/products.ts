/**
 * Product families (Sitemap §2, §6.3). Plain data with no imports, because
 * client components read it (navigation, WhatsApp messages). Evidence that
 * goes through the claims gate (specifications, applications) lives in
 * family-evidence.ts; whether a family gets its own page is decided by the
 * minimum content bar in lib/mcb.ts.
 */

export type FamilySlug =
  | 'corrugated-boxes'
  | 'die-cut-boxes'
  | 'heavy-duty-and-export-packaging'
  | 'sheets-pads-and-inserts'
  | 'protective-and-allied-packaging'

export interface FamilyFormat {
  slug: string
  name: string
  /** General guidance we wrote; shown only once the client reviewer signs off (claim F-18-copy) */
  description: string
  /** A drawing from the illustration set, when one exists */
  drawing?: 'rsc' | 'fol'
}

export interface Family {
  slug: FamilySlug
  name: string
  /** Lower-case form for running text and WhatsApp messages */
  shortName: string
  /** WhatsApp source token (Technical §10) */
  token: string
  /** One-line description: family index row and page introduction */
  summary: string
  formats: FamilyFormat[]
  /** Claim that confirms these formats are made */
  formatsClaim: 'F-18' | 'F-27-allied'
  related: [FamilySlug, FamilySlug]
  /** Sitemap §4.2, limited to confirmed facts */
  seo: { title: string; description: string }
}

export const families: Family[] = [
  {
    slug: 'corrugated-boxes',
    name: 'Corrugated boxes',
    shortName: 'corrugated boxes',
    token: 'WEB-BOXES',
    summary: 'Regular slotted, telescopic and full-overlap boxes, made to your size.',
    formats: [
      {
        slug: 'rsc',
        name: 'Regular slotted container (RSC)',
        description: 'All flaps are the same depth and the outer flaps meet at the centre. The most common box style.',
        drawing: 'rsc',
      },
      {
        slug: 'full-overlap',
        name: 'Full overlap',
        description: 'The outer flaps run the full width of the box and overlap completely, for a stronger top and bottom.',
        drawing: 'fol',
      },
      { slug: 'telescopic', name: 'Telescopic', description: 'A separate lid slides down over a base.' },
    ],
    formatsClaim: 'F-18',
    related: ['die-cut-boxes', 'heavy-duty-and-export-packaging'],
    seo: {
      title: 'RSC Corrugated Boxes, 3 & 5 Ply',
      description: 'Regular slotted and full-overlap corrugated boxes in 3 and 5 ply, made to your size at our Pune plant. Send dimensions for a quote.',
    },
  },
  {
    slug: 'die-cut-boxes',
    name: 'Die-cut boxes',
    shortName: 'die-cut boxes',
    token: 'WEB-DIECUT',
    summary: 'Boxes cut to a custom shape from your drawing or sample.',
    formats: [
      {
        slug: 'die-cut',
        name: 'Die-cut box',
        description: 'Cut to shape in one piece, often with locking tabs so it folds up without glue or stitching.',
      },
    ],
    formatsClaim: 'F-18',
    related: ['corrugated-boxes', 'protective-and-allied-packaging'],
    seo: {
      title: 'Die-Cut Corrugated Boxes Manufacturer',
      description: 'Die-cut corrugated boxes for engineering goods, sanitary ware and e-commerce, made at our Ranjangaon plant.',
    },
  },
  {
    slug: 'heavy-duty-and-export-packaging',
    name: 'Heavy-duty and export packaging',
    shortName: 'heavy-duty packaging',
    token: 'WEB-HEAVY',
    summary: 'Heavy-duty and export-type boxes for heavy and engineered parts.',
    formats: [
      { slug: 'heavy-duty', name: 'Heavy-duty box', description: 'Multi-wall construction for heavy, dense or awkward loads.' },
      { slug: 'export-type', name: 'Export-type box', description: 'Built for long transit and repeated handling.' },
    ],
    formatsClaim: 'F-18',
    related: ['corrugated-boxes', 'protective-and-allied-packaging'],
    seo: {
      title: 'Heavy-Duty Corrugated Boxes, Pune',
      description: 'Heavy-duty corrugated boxes and export-type packs for automotive and engineering parts. Request a quote.',
    },
  },
  {
    slug: 'sheets-pads-and-inserts',
    name: 'Sheets, pads and inserts',
    shortName: 'sheets, pads and inserts',
    token: 'WEB-SHEETS',
    summary: 'Sheets, layer pads, partitions, inserts, dividers and rolls.',
    formats: [
      { slug: 'sheets', name: 'Corrugated sheets', description: 'Flat board cut to size.' },
      { slug: 'layer-pads', name: 'Layer pads', description: 'Flat pads that separate and stabilise layers on a pallet.' },
      { slug: 'partitions', name: 'Partitions and dividers', description: 'Slotted dividers that keep items apart inside a box.' },
      { slug: 'inserts', name: 'Inserts', description: 'Shaped pieces that hold a product in place.' },
      { slug: 'rolls', name: 'Corrugated rolls', description: 'Single-face board on a roll, for wrapping.' },
    ],
    formatsClaim: 'F-18',
    related: ['corrugated-boxes', 'protective-and-allied-packaging'],
    seo: {
      title: 'Corrugated Sheets, Pads, Partitions, Rolls',
      description: 'Corrugated sheets, layer pads, partitions, inserts, dividers and rolls made at Ranjangaon MIDC, Pune.',
    },
  },
  {
    slug: 'protective-and-allied-packaging',
    name: 'Protective and allied packaging',
    shortName: 'protective packaging',
    token: 'WEB-PROTECTIVE',
    summary: 'Paper core assemblies, angle corners, honeycomb and pulp trays.',
    formats: [
      { slug: 'paper-cores', name: 'Paper core assemblies', description: 'Paper tubes and assemblies that support and protect a product.' },
      { slug: 'angle-corners', name: 'Angle corners', description: 'Edge protectors for strapped and stacked loads.' },
      { slug: 'honeycomb', name: 'Honeycomb', description: 'Light, stiff paper panels for cushioning and void fill.' },
      { slug: 'pulp-trays', name: 'Paper pulp trays', description: 'Trays that hold parts in place.' },
    ],
    formatsClaim: 'F-27-allied',
    related: ['heavy-duty-and-export-packaging', 'sheets-pads-and-inserts'],
    seo: {
      title: 'Paper Cores, Angle Corners, Honeycomb',
      description: 'Paper core assemblies, angle corners, honeycomb and pulp trays for protecting heavy and fragile products. Request a quote.',
    },
  },
]

export function familyBySlug(slug: string): Family | undefined {
  return families.find((f) => f.slug === slug)
}
