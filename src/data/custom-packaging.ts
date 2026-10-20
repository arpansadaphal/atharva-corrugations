/**
 * Custom Packaging page copy (Sitemap §6.5). No lead times, no MOQ (F-31,
 * F-32), no tooling ownership until the client's policy arrives (Q-23).
 */
export const inputNotes: Record<string, string> = {
  'Drawings or dielines': 'PDF or image files of an existing pack or a new idea.',
  'CAD files': 'Exports from your CAD software.',
  'A physical sample': 'An existing pack, or the product it must hold.',
  'A specification sheet': 'Your own packaging specification or a buyer requirement.',
  'A conversation': 'Tell us what you pack and how it travels; we take it from there.',
}

export const faqs: { q: string; a: string }[] = [
  {
    q: 'What should I send you?',
    a: 'Whatever you have: a drawing, a CAD file, a sample pack, the product itself or a specification sheet. If you have nothing yet, describe what you pack, its weight and how it travels.',
  },
  {
    q: 'Internal or external dimensions?',
    a: 'Internal. Measure the space your product needs inside the box, in millimetres: length × width × height. We work out the outside size from the board we choose.',
  },
  {
    q: 'How is a quote priced?',
    a: 'Mainly by the board construction, the box size, the quantity, any printing and any tooling a new design needs. Quoting several quantities shows you how the price changes with volume.',
  },
  {
    q: 'Can you start from my product alone?',
    a: 'Yes. We can design packaging around the product itself; a sample of it helps us get the fit right.',
  },
  {
    q: 'How do I send a drawing?',
    a: 'Send it on WhatsApp, or reply to the confirmation email you receive after a quote request with the file attached.',
  },
]
