/**
 * Parametric dielines for slotted containers (Design §7.4 items 1–2: the hero
 * plate, family drawings). One function, so every drawing of the same box
 * agrees. Units are millimetres; the SVG scales them.
 *
 * Flat layout, left to right: glue flap, then panels L, W, L, W. Each panel
 * has a flap above and below:
 * - RSC (regular slotted container): every flap W/2 deep, so the outer
 *   flaps meet in the middle.
 * - FOL (full overlap): the outer flaps (on the L panels) are W deep and
 *   overlap completely; the inner flaps stay W/2.
 * Solid paths are cuts (flaps, glue flap, end edge); dashed paths are creases.
 *
 * Simplifications to confirm with the client reviewer (SD-10): slots are
 * drawn as single cut lines (zero width), board thickness allowances are
 * ignored, and the glue flap is tapered by a fixed amount.
 */

export type SlottedStyle = 'rsc' | 'fol'

export interface SlottedInput {
  length: number
  width: number
  height: number
  style?: SlottedStyle
  /** Glue (manufacturer's joint) flap width */
  glueFlap?: number
  /** How far the glue flap tapers in at each end */
  glueTaper?: number
}

export interface Dieline {
  /** Overall flat size */
  width: number
  height: number
  cuts: string[]
  creases: string[]
  /** Panel edges: glue flap start, then the five panel boundaries */
  x: number[]
  /** Top of the tallest flap, top crease, bottom crease, bottom of the tallest flap */
  y: number[]
}

const r = (n: number) => Math.round(n * 10) / 10

export function slottedDieline({
  length: L,
  width: W,
  height: H,
  style = 'rsc',
  glueFlap = 35,
  glueTaper = 10,
}: SlottedInput): Dieline {
  if ([L, W, H].some((v) => !(v > 0))) throw new Error('Box dimensions must be positive')
  const outer = style === 'fol' ? W : W / 2
  const inner = W / 2
  const depths = [outer, inner, outer, inner]
  const deepest = Math.max(...depths)

  const x = [0, glueFlap, glueFlap + L, glueFlap + L + W, glueFlap + 2 * L + W, glueFlap + 2 * L + 2 * W].map(r)
  const y = [0, deepest, deepest + H, 2 * deepest + H].map(r)
  const [x0, x1, , , , x5] = x
  const [, y1, y2] = y

  const flaps = depths.flatMap((d, i) => {
    const [a, b] = [x[i + 1], x[i + 2]]
    return [`M${a} ${y1} V${r(y1 - d)} H${b} V${y1}`, `M${a} ${y2} V${r(y2 + d)} H${b} V${y2}`]
  })
  const glue = `M${x1} ${y1} L${x0} ${r(y1 + glueTaper)} V${r(y2 - glueTaper)} L${x1} ${y2}`
  const endEdge = `M${x5} ${y1} V${y2}`
  const creases = [`M${x1} ${y1} H${x5}`, `M${x1} ${y2} H${x5}`, ...x.slice(1, 5).map((cx) => `M${cx} ${y1} V${y2}`)]

  return { width: x5, height: y[3], cuts: [...flaps, glue, endEdge], creases, x, y }
}

/** The regular slotted container (kept for existing callers) */
export function rscDieline(input: Omit<SlottedInput, 'style'>): Dieline {
  return slottedDieline({ ...input, style: 'rsc' })
}
