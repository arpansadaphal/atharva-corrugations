/**
 * Parametric dieline for a regular slotted container (Design §7.4 items 1–2,
 * the hero plate, family drawings). One function, so the hero, family pages
 * and the quote diagram can never disagree. Units are millimetres; the SVG
 * scales them.
 *
 * Flat layout, left to right: glue flap, then panels L, W, L, W. Flaps above
 * and below each panel are W/2 deep, so the major flaps meet in the middle.
 * Solid paths are cuts (outline and slots); dashed paths are creases.
 *
 * Simplifications to confirm with the client reviewer (SD-10): slots are
 * drawn as single cut lines (zero width), board thickness allowances are
 * ignored, and the glue flap is tapered by a fixed amount.
 */

export interface RscInput {
  length: number
  width: number
  height: number
  /** Glue (manufacturer's joint) flap width */
  glueFlap?: number
  /** How far the glue flap tapers in at each end */
  glueTaper?: number
}

export interface Dieline {
  /** Overall flat size */
  width: number
  height: number
  /** Cut lines: the outline then each slot */
  cuts: string[]
  /** Crease lines: horizontal flap folds, then vertical panel folds */
  creases: string[]
  /** Key x and y positions, for placing dimension callouts */
  x: number[]
  y: number[]
}

const r = (n: number) => Math.round(n * 10) / 10

export function rscDieline({ length: L, width: W, height: H, glueFlap = 35, glueTaper = 10 }: RscInput): Dieline {
  if ([L, W, H].some((v) => !(v > 0))) throw new Error('RSC dimensions must be positive')
  const f = W / 2
  const x = [0, glueFlap, glueFlap + L, glueFlap + L + W, glueFlap + 2 * L + W, glueFlap + 2 * L + 2 * W].map(r)
  const y = [0, f, f + H, 2 * f + H].map(r)
  const [x0, x1, x2, x3, x4, x5] = x
  const [y0, y1, y2, y3] = y

  const outline =
    `M${x1} ${y0} H${x5} V${y3} H${x1} V${y2} ` +
    `L${x0} ${r(y2 - glueTaper)} V${r(y1 + glueTaper)} L${x1} ${y1} Z`
  const slots = [x2, x3, x4].flatMap((sx) => [`M${sx} ${y0} V${y1}`, `M${sx} ${y2} V${y3}`])
  const creases = [
    `M${x1} ${y1} H${x5}`,
    `M${x1} ${y2} H${x5}`,
    ...[x1, x2, x3, x4].map((cx) => `M${cx} ${y1} V${y2}`),
  ]

  return { width: x5, height: y3, cuts: [outline, ...slots], creases, x, y }
}
