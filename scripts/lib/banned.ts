/**
 * Banned strings — the cross-contamination check (Technical plan §13.4),
 * plus the never-publish label from Audit §6.1 and the extra banned
 * marketing phrases from Content §10.2.
 */

export interface BannedTerm {
  term: string
  pattern: RegExp
  source: string
}

const word = (s: string, flags = 'i') =>
  new RegExp(`(?<![\\w-])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`, flags)

const t = (term: string, source: string, pattern: RegExp = word(term)): BannedTerm => ({ term, pattern, source })

export const BANNED: BannedTerm[] = [
  // Polymers business terms (Technical §13.4)
  t('polymer', 'Technical §13.4', /polymer/i),
  t('injection', 'Technical §13.4', /injection/i),
  t('moulding', 'Technical §13.4', /mou?lding|molding/i),
  t('Atharva Polymers', 'Technical §13.4', /atharva\s+polymers/i),
  t('atharvapolymers', 'Technical §13.4', /atharvapolymers/i),
  t('Precisely Made', 'Technical §13.4'),
  t('Specification Mark', 'Technical §13.4'),
  // Customers attributed in marketplace text (C-15)
  t('Godrej', 'Technical §13.4 / Audit C-15'),
  t('Larsen', 'Technical §13.4 / Audit C-15'),
  t('L&T', 'Technical §13.4 / Audit C-15', /(?<![\w])L&(amp;)?T(?![\w])/),
  t('Minda', 'Technical §13.4 / Audit C-15'),
  t('Varroc', 'Technical §13.4 / Audit C-15'),
  // Polymers numbers and phrases
  t('19+ years', 'Technical §13.4', /19\+?\s*years/i),
  t('20+ clients', 'Technical §13.4', /20\+\s*clients/i),
  t('4+ countries', 'Technical §13.4', /4\+\s*countries/i),
  t('4 markets', 'Technical §13.4', /(?<!\d)4\s+markets/i),
  t('40 employees', 'Technical §13.4', /(?<!\d)40\s+employees/i),
  t('2007', 'Technical §13.4', /(?<![\d.])2007(?![\d])/),
  t('2008', 'Technical §13.4', /(?<![\d.])2008(?![\d])/),
  // Marketing superlatives (Technical §13.4, Content §10.2)
  t('world-class', 'Technical §13.4', /world[\s-]class/i),
  t('industry-leading', 'Technical §13.4', /industry[\s-]leading/i),
  t('cutting-edge', 'Technical §13.4', /cutting[\s-]edge/i),
  t('revolutionary', 'Technical §13.4'),
  t('next-generation', 'Technical §13.4', /next[\s-]generation/i),
  t('global presence', 'Technical §13.4', /global\s+presence/i),
  t('trusted partner', 'Content §10.2', /trusted\s+partner/i),
  t('one-stop', 'Content §10.2', /one[\s-]stop/i),
  t('state-of-the-art', 'Content §10.2', /state[\s-]of[\s-]the[\s-]art/i),
  // Never-publish label (Audit §6.1, C-03)
  t('Registered office', 'Audit §6.1', /registered\s+office/i),
  // Placeholders (Technical §13.4; case-sensitive where the word is common)
  t('lorem', 'Technical §13.4', /lorem/i),
  t('⚠', 'Technical §13.4', /⚠/),
  t('AWAITING', 'Technical §13.4', /AWAITING/),
  t('TODO', 'Technical §13.4', /TODO/),
  t('FIXME', 'Technical §13.4', /FIXME/),
]

export interface BannedHit {
  file: string
  line: number
  term: string
  source: string
  text: string
}

export function findBanned(text: string, file: string, terms: BannedTerm[] = BANNED): BannedHit[] {
  const hits: BannedHit[] = []
  text.split('\n').forEach((lineText, i) => {
    for (const b of terms) {
      if (b.pattern.test(lineText)) {
        hits.push({ file, line: i + 1, term: b.term, source: b.source, text: lineText.trim().slice(0, 120) })
      }
    }
  })
  return hits
}
