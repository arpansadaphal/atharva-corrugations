/**
 * Specialised and protective items for Home H6 (Sitemap §6.1). Each needs a
 * real photograph (shot P-09) and a verified one-line specification; the
 * section shows only when at least two items have both. None do yet.
 */
export interface SpecialisedItem {
  name: string
  spec: string
  /** Path under /public once the photograph is approved */
  photo?: string
  alt?: string
}

export const specialisedItems: SpecialisedItem[] = [
  { name: 'Paper core assemblies', spec: 'For centrifugal compressor packaging.' },
  { name: 'Angle corners', spec: 'Edge protection for heavy and fragile loads.' },
  { name: 'Honeycomb', spec: 'Lightweight panels and void fill.' },
  { name: 'Paper pulp trays', spec: 'Pulp trays that hold parts in place.' },
]
