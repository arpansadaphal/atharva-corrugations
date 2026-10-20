/**
 * From specification to delivery (Sitemap §6.1 H3, §6.5 C2). Built only from
 * the confirmed design-support offer (claim F-30); no durations.
 */
export const processSteps = [
  {
    title: 'Brief',
    body: 'Send a drawing, dieline, CAD file, sample, specification sheet, or just talk it through.',
    provide: 'Whatever you have: a drawing, a sample, the product itself, or a description.',
    receive: 'Questions back from our design team about the product, its weight and how it travels.',
  },
  {
    title: 'Structural design',
    body: 'We work out the construction and draw the dieline and CAD file.',
    provide: 'Any limits that matter: pallet size, stacking height, how the pack is opened.',
    receive: 'A dieline and CAD drawing of the proposed pack.',
  },
  {
    title: 'Sample and 3D mock-up',
    body: 'You see and handle the pack before anything is tooled.',
    provide: 'Feedback on the sample, ideally tried with your product.',
    receive: 'A 3D mock-up and a physical sample.',
  },
  {
    title: 'Testing support',
    body: 'We help check that the pack protects your product.',
    provide: 'What the pack must survive: weight, stacking, transit.',
    receive: 'Our findings and a packaging recommendation.',
  },
  {
    title: 'Tooling',
    body: 'Cutting dies and printing plates are made for production.',
    provide: 'Approval of the final design and any print artwork.',
    receive: 'Tooling ready for your production runs.',
  },
  {
    title: 'Production and supply',
    body: 'Your packaging is made at our Ranjangaon MIDC plant and delivered.',
    provide: 'Quantities and delivery details.',
    receive: 'Your packaging, made to the approved design.',
  },
]
