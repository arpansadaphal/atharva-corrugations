/**
 * WCAG 2.x contrast (relative luminance), shared by scripts/contrast.ts and
 * its unit tests. Pairs and minimums come from Design §5.3.
 */

export function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) throw new Error(`Not a #rrggbb colour: ${hex}`)
  const n = parseInt(m[1], 16)
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export interface ContrastPair {
  fg: string
  bg: string
  /** 4.5 for text, 3 for UI borders, graphics and large marks */
  min: number
  use: string
  /** Ratio stated in Design §5.3, for drift reporting */
  documented: number
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: '--ink-900', bg: '--paper-0', min: 4.5, use: 'Ink text on white', documented: 17.85 },
  { fg: '--ink-900', bg: '--paper-50', min: 4.5, use: 'Ink text on slate-50', documented: 17.06 },
  { fg: '--text-body', bg: '--paper-0', min: 4.5, use: 'Body text on white', documented: 7.58 },
  { fg: '--text-body', bg: '--paper-50', min: 4.5, use: 'Body text on slate-50', documented: 7.24 },
  { fg: '--text-muted', bg: '--paper-0', min: 4.5, use: 'Muted text on white', documented: 4.76 },
  { fg: '--text-muted', bg: '--paper-50', min: 4.5, use: 'Muted text on slate-50', documented: 4.55 },
  { fg: '--on-dark-muted', bg: '--ink-900', min: 4.5, use: 'Muted text on ink-900', documented: 6.96 },
  { fg: '--on-dark-muted', bg: '--ink-800', min: 4.5, use: 'Muted text on ink-800', documented: 5.71 },
  { fg: '--on-dark-body', bg: '--ink-900', min: 4.5, use: 'Body text on ink-900', documented: 12.02 },
  { fg: '--on-dark-body', bg: '--ink-800', min: 4.5, use: 'Body text on ink-800', documented: 9.85 },
  { fg: '--on-dark-strong', bg: '--accent', min: 4.5, use: 'Button text on accent', documented: 5.17 },
  { fg: '--on-dark-strong', bg: '--accent-hover', min: 4.5, use: 'Button text on accent hover', documented: 6.7 },
  { fg: '--accent', bg: '--paper-0', min: 4.5, use: 'Links on white', documented: 5.17 },
  { fg: '--accent', bg: '--paper-50', min: 4.5, use: 'Links on slate-50', documented: 4.94 },
  { fg: '--accent', bg: '--ink-900', min: 3, use: 'Accent marks on ink (not text)', documented: 3.45 },
  { fg: '--accent-on-dark', bg: '--ink-900', min: 4.5, use: 'Links on ink-900', documented: 7.02 },
  { fg: '--accent-on-dark', bg: '--ink-800', min: 4.5, use: 'Links on ink-800', documented: 5.75 },
  { fg: '--on-wa', bg: '--wa', min: 4.5, use: 'WhatsApp control text', documented: 9.0 },
  { fg: '--error', bg: '--paper-0', min: 4.5, use: 'Error text on white', documented: 6.47 },
  { fg: '--error', bg: '--paper-50', min: 4.5, use: 'Error text on slate-50', documented: 6.18 },
  { fg: '--success', bg: '--paper-0', min: 4.5, use: 'Success text on white', documented: 5.02 },
  { fg: '--success', bg: '--paper-50', min: 4.5, use: 'Success text on slate-50', documented: 4.79 },
  { fg: '--kraft-600', bg: '--paper-0', min: 3, use: 'Illustration strokes on white', documented: 4.99 },
  { fg: '--kraft-600', bg: '--paper-50', min: 3, use: 'Illustration strokes on slate-50', documented: 4.77 },
  { fg: '--line-ui', bg: '--paper-0', min: 3, use: 'Form-control borders on white', documented: 4.76 },
  { fg: '--line-ui', bg: '--paper-50', min: 3, use: 'Form-control borders on slate-50', documented: 4.55 },
]

/** Parse `--name: #rrggbb;` declarations from the :root block of a stylesheet. */
export function parseTokens(css: string): Record<string, string> {
  const root = /:root\s*\{([\s\S]*?)\}/.exec(css)?.[1] ?? ''
  const tokens: Record<string, string> = {}
  for (const m of root.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-f]{6})\b/gi)) tokens[m[1]] = m[2]
  return tokens
}
