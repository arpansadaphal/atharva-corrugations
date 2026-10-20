/**
 * Where each not-yet-confirmed fact appears on the site, for the client
 * review checklist (/review). Locations only: the facts themselves stay in
 * claims.ts and group.ts. A unit test checks that every unconfirmed claim
 * is listed here, so a new claim cannot be missed by the review.
 * An empty list means the fact is not shown anywhere yet.
 */
export interface ClaimLocation {
  label: string
  href: string
}

const HOME_HERO = { label: 'Home, first screen', href: '/#hero' }
const HOME_MAKE = { label: 'Home, What we make', href: '/#what-we-make' }
const HOME_MANUFACTURING = { label: 'Home, Manufacturing and quality', href: '/#manufacturing' }
const HOME_CERTIFICATES = { label: 'Home, Certificates and ratings', href: '/#certificates' }
const FOOTER = { label: 'Footer, every page', href: '/#site-footer' }
const BOXES = { label: 'Products, Corrugated boxes', href: '/products#corrugated-boxes' }
const BOXES_PAGE = { label: 'Corrugated boxes page, Board and construction', href: '/products/corrugated-boxes#construction' }
const MQ_CAPABILITIES = { label: 'Manufacturing & Quality, What our plant does', href: '/manufacturing-and-quality#capabilities' }
const MQ_QUALITY = { label: 'Manufacturing & Quality, How we check our work', href: '/manufacturing-and-quality#quality' }

export const claimLocations: Record<string, ClaimLocation[]> = {
  'F-01': [],
  'F-09': [{ label: 'About, Founders', href: '/about#founders' }],
  'F-15': [
    { label: 'Home, Who we are', href: '/#company' },
    { label: 'Contact, details', href: '/contact#details' },
    { label: 'About, Locations', href: '/about#locations' },
    FOOTER,
  ],
  'F-18-copy': [
    { label: 'Products, format descriptions', href: '/products#corrugated-boxes' },
    { label: 'Corrugated boxes page, flute guide', href: '/products/corrugated-boxes#construction' },
    { label: 'Industries, packaging notes', href: '/industries#white-goods' },
  ],
  'F-20': [
    HOME_HERO,
    HOME_MANUFACTURING,
    { label: 'Products, Heavy-duty and export packaging', href: '/products#heavy-duty-and-export-packaging' },
    BOXES_PAGE,
    { label: 'Request a quote, board options', href: '/request-quote' },
  ],
  'F-21': [BOXES, BOXES_PAGE],
  'F-22': [BOXES],
  'F-23': [HOME_MANUFACTURING, BOXES],
  'F-24': [HOME_MANUFACTURING, BOXES],
  'F-27-allied': [HOME_MAKE, { label: 'Products, Protective and allied packaging', href: '/products#protective-and-allied-packaging' }],
  'F-29': [HOME_MANUFACTURING, MQ_CAPABILITIES, { label: 'Products, Die-cut boxes', href: '/products#die-cut-boxes' }],
  'F-30-routine': [{ label: 'Custom Packaging, What you receive', href: '/custom-packaging#outputs' }],
  'F-30-tooling': [],
  'F-38': [HOME_MANUFACTURING, MQ_QUALITY, { label: 'Custom Packaging, Testing support', href: '/custom-packaging#testing' }],
  'F-40': [HOME_MANUFACTURING, HOME_CERTIFICATES, MQ_QUALITY],
  'F-42': [HOME_CERTIFICATES, MQ_QUALITY],
  'F-44': [{ label: 'Manufacturing & Quality, Material and recycling', href: '/manufacturing-and-quality#sustainability' }],
  'F-52-tape': [{ label: 'About, Our timeline', href: '/about#milestones' }],
  'F-52-expansion': [{ label: 'About, Our timeline', href: '/about#milestones' }],
  'F-58': [{ label: 'Green WhatsApp button, bottom right of every page', href: '/' }],
  'F-64': [FOOTER],
  'F-65': [FOOTER],
  'F-66': [{ label: 'Privacy policy (draft)', href: '/privacy-policy' }],
}

/**
 * Content that needs the client's approval rather than evidence: our own
 * drawings and technical wording (SD-10). Not facts, so not in the registry.
 */
export const approvals: { title: string; detail: string; links: ClaimLocation[] }[] = [
  {
    title: 'Technical drawings',
    detail:
      'Our illustrations of box styles and board builds (regular slotted, full overlap, die-cut, heavy-duty, partitions, angle corner, honeycomb, flute cross-sections, the internal-dimensions diagram). Please have your technical reviewer check each one for accuracy (SD-10).',
    links: [HOME_HERO, HOME_MAKE, { label: 'Products, all families', href: '/products' }, BOXES_PAGE, { label: 'Request a quote, dimensions diagram', href: '/request-quote' }],
  },
]
