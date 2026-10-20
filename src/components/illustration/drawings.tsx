import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Product-family line drawings, items 3–11 of the illustration set (Design
 * §7.4), in the dieline language of Design §7.3:
 * - cut lines solid ink at 1.5 px, crease lines dashed 6/4 in the muted tone;
 * - isometric views at 30°;
 * - board shown in kraft fills (200–400) with kraft-600 strokes;
 * - flat colour only, no gradients or shadows.
 * Proportions only; no sizes are claimed. Every drawing is an illustration of
 * a general construction, to be checked by the client's technical reviewer
 * (SD-10). The paper core assembly (item 8) waits for a sample, as Design
 * §7.4 requires.
 */

const INK = 'var(--ink-900)'
const MUTED = 'var(--text-muted)'
const K200 = 'var(--kraft-200)'
const K300 = 'var(--kraft-300)'
const K400 = 'var(--kraft-400)'
const K600 = 'var(--kraft-600)'
const stroke = { vectorEffect: 'non-scaling-stroke' as const }

type Pt = [number, number]
const pts = (p: Pt[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

// Isometric projection at 30°: x to the right-down, y to the left-down, z up
const C30 = Math.cos(Math.PI / 6)
const iso = (x: number, y: number, z: number): Pt => [(x - y) * C30, (x + y) * 0.5 - z]

interface FrameProps {
  viewBox: string
  label: string
  className?: string
  children: ReactNode
}

function Frame({ viewBox, label, className, children }: FrameProps) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={cn('h-auto w-full', className)} fill="none" strokeLinejoin="miter">
      {children}
    </svg>
  )
}

// ── Item 4: die-cut folder-style box, flat ────────────────────────────────

/** A one-piece folder box: base, walls, lid with tuck, double side walls with locking tabs */
export function DieCutDrawing({ className }: { className?: string }) {
  const outline =
    'M25 -350 H275 L285 -290 H300 V-280 L355 -265 V-95 L300 -80 V0 H370 V10 H435 V210 H370 V220 H300 V290 H295 V355 ' +
    'H240 V365 H210 V355 H90 V365 H60 V355 H5 V290 H0 V220 H-70 V210 H-135 V10 H-70 V0 H0 V-80 L-55 -95 V-265 L0 -280 V-290 H15 Z'
  const creases = [
    'M0 0 H300', // back wall to base
    'M0 -70 H300', // lid to back wall
    'M15 -290 H285', // tuck flap
    'M0 -280 V-80',
    'M300 -280 V-80', // lid dust flaps
    'M0 220 H300', // front wall
    'M5 290 H295', // front inner panel
    'M0 0 V220',
    'M300 0 V220', // side walls
    'M-70 10 V210',
    'M370 10 V210', // inner side walls
  ]
  return (
    <Frame
      viewBox="-175 -390 650 795"
      label="Illustration: a die-cut folder-style box laid flat. Solid lines are cuts, dashed lines are creases: base, walls, lid with tuck flap, and double side walls with locking tabs."
      className={className}
    >
      <path d={outline} stroke={INK} strokeWidth="1.5" style={stroke} />
      <g stroke={MUTED} strokeWidth="1" strokeDasharray="6 4">
        {creases.map((d) => (
          <path key={d} d={d} style={stroke} />
        ))}
      </g>
    </Frame>
  )
}

// ── Item 5: heavy-duty box with edge protectors ───────────────────────────

/** An erected heavy-duty box, angle-board edge protectors and two straps, isometric */
export function HeavyDutyDrawing({ className }: { className?: string }) {
  const [L, W, H, leg] = [400, 300, 300, 36]
  const face = (p: [number, number, number][]) => pts(p.map(([x, y, z]) => iso(x, y, z)))
  const top = face([[0, 0, H], [L, 0, H], [L, W, H], [0, W, H]])
  const right = face([[L, 0, H], [L, W, H], [L, W, 0], [L, 0, 0]])
  const left = face([[0, W, H], [L, W, H], [L, W, 0], [0, W, 0]])
  // edge protectors: legs on the visible faces along the three visible vertical edges
  const protectors = [
    face([[L, W - leg, H], [L, W, H], [L, W, 0], [L, W - leg, 0]]),
    face([[L - leg, W, H], [L, W, H], [L, W, 0], [L - leg, W, 0]]),
    face([[L, 0, H], [L, leg, H], [L, leg, 0], [L, 0, 0]]),
    face([[0, W, H], [leg, W, H], [leg, W, 0], [0, W, 0]]),
  ]
  // straps over the top and down the left face, at a third and two thirds of the length
  const straps = [L / 3, (2 * L) / 3].flatMap((x) => [
    face([[x - 10, 0, H], [x + 10, 0, H], [x + 10, W, H], [x - 10, W, H]]),
    face([[x - 10, W, H], [x + 10, W, H], [x + 10, W, 0], [x - 10, W, 0]]),
  ])
  const [s1, s2] = [iso(0, W / 2, H), iso(L, W / 2, H)]
  return (
    <Frame
      viewBox="-300 -330 680 680"
      label="Illustration: a heavy-duty corrugated box in isometric view, with angle-board edge protectors on its vertical edges and two straps."
      className={className}
    >
      <g stroke={INK} strokeWidth="1.5" style={stroke}>
        <polygon points={top} fill={K200} style={stroke} />
        <polygon points={left} fill={K300} style={stroke} />
        <polygon points={right} fill={K400} style={stroke} />
      </g>
      {/* the outer flaps meet along the middle of the top */}
      <line x1={s1[0]} y1={s1[1]} x2={s2[0]} y2={s2[1]} stroke={INK} strokeWidth="1.5" style={stroke} />
      <g fill={MUTED} stroke={INK} strokeWidth="1" opacity="0.85">
        {straps.map((p) => (
          <polygon key={p} points={p} style={stroke} />
        ))}
      </g>
      <g fill={K600} stroke={INK} strokeWidth="1">
        {protectors.map((p) => (
          <polygon key={p} points={p} style={stroke} />
        ))}
      </g>
    </Frame>
  )
}

// ── Item 6: partition set ─────────────────────────────────────────────────

/** Two slotted partition strips in elevation, and the assembled grid in plan */
export function PartitionDrawing({ className }: { className?: string }) {
  const strip = (y: number, slots: number[], fromTop: boolean) => {
    const top = y
    const bottom = y + 120
    const d = slots
      .map((x) => (fromTop ? `M${x - 3} ${top} V${top + 60} H${x + 3} V${top}` : `M${x - 3} ${bottom} V${bottom - 60} H${x + 3} V${bottom}`))
      .join(' ')
    return (
      <g>
        <rect x="0" y={top} width="400" height="120" fill={K200} stroke={INK} strokeWidth="1.5" style={stroke} />
        <path d={d} stroke={INK} strokeWidth="1.5" fill="var(--paper-0)" style={stroke} />
      </g>
    )
  }
  return (
    <Frame
      viewBox="-30 -30 830 340"
      label="Illustration: a corrugated partition set. Two slotted strips shown flat, one slotted from the top and one from the bottom, and the assembled grid seen from above."
      className={className}
    >
      {strip(0, [100, 200, 300], true)}
      {strip(160, [133, 267], false)}
      <g stroke={INK} strokeWidth="1.5" style={stroke}>
        <rect x="470" y="0" width="300" height="280" fill="var(--paper-0)" style={stroke} />
        {[545, 620, 695].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="280" style={stroke} />
        ))}
        {[93, 187].map((y) => (
          <line key={y} x1="470" y1={y} x2="770" y2={y} style={stroke} />
        ))}
      </g>
    </Frame>
  )
}

// ── Item 9: angle corner ──────────────────────────────────────────────────

/** An angle-board edge protector: L profile in board, extruded, isometric; laminated plies on the end */
export function AngleCornerDrawing({ className }: { className?: string }) {
  const [len, a, t] = [420, 70, 10]
  // L profile in the y–z plane: one leg along y, one up z
  const profile: [number, number][] = [[0, 0], [a, 0], [a, t], [t, t], [t, a], [0, a]]
  const at = (x: number, [y, z]: [number, number]) => iso(x, y, z)
  // long faces, back to front by depth (x + y + z), then the near end cap
  const faces = profile
    .map((p, i) => {
      const q = profile[(i + 1) % profile.length]
      const poly = [at(0, p), at(0, q), at(len, q), at(len, p)]
      return { poly, depth: (p[0] + q[0] + p[1] + q[1]) / 2 }
    })
    .sort((m, n) => m.depth - n.depth)
  const cap = profile.map((p) => at(len, p))
  // ply lines inside the end cap, parallel to the profile
  const plies = [t / 3, (2 * t) / 3].map((o) =>
    pts([[o, a], [o, o], [a, o]].map(([y, z]) => at(len, [y, z] as [number, number]))),
  )
  return (
    <Frame
      viewBox="-150 -120 560 400"
      label="Illustration: an angle-board edge protector, an L-shaped profile of laminated paperboard, shown in isometric view."
      className={className}
    >
      <g stroke={INK} strokeWidth="1.5" fill={K300}>
        {faces.map((f) => (
          <polygon key={pts(f.poly)} points={pts(f.poly)} style={stroke} />
        ))}
      </g>
      <polygon points={pts(cap)} fill={K400} stroke={INK} strokeWidth="1.5" style={stroke} />
      <g stroke={K600} strokeWidth="1">
        {plies.map((p) => (
          <polyline key={p} points={p} style={stroke} />
        ))}
      </g>
    </Frame>
  )
}

// ── Item 10: honeycomb panel ──────────────────────────────────────────────

/** A honeycomb panel from above with the top sheet partly cut away to show the cells */
export function HoneycombDrawing({ className }: { className?: string }) {
  const r = 22
  const w = Math.sqrt(3) * r
  const cells: string[] = []
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 10; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0)
      const cy = row * r * 1.5
      const hex = Array.from({ length: 6 }, (_, k) => {
        const ang = (Math.PI / 3) * k + Math.PI / 6
        return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)] as Pt
      })
      cells.push(pts(hex))
    }
  }
  return (
    <Frame
      viewBox="-20 -40 420 260"
      label="Illustration: a paper honeycomb panel seen from above, with the top sheet partly cut away to show the hexagonal cells."
      className={className}
    >
      <defs>
        <clipPath id="honeycomb-panel">
          <rect x="0" y="-15" width="380" height="225" />
        </clipPath>
      </defs>
      <g clipPath="url(#honeycomb-panel)">
        <rect x="0" y="-15" width="380" height="225" fill={K200} />
        <g stroke={K600} strokeWidth="1" fill="none">
          {cells.map((c) => (
            <polygon key={c} points={c} style={stroke} />
          ))}
        </g>
        {/* the top sheet covers the right part; its cut edge is a cut line */}
        <path d="M210 -15 L170 210 H380 V-15 Z" fill={K400} stroke={INK} strokeWidth="1.5" style={stroke} />
      </g>
      <rect x="0" y="-15" width="380" height="225" stroke={INK} strokeWidth="1.5" style={stroke} />
    </Frame>
  )
}

// ── Item 11: flute cross-sections ─────────────────────────────────────────

const WALLS = {
  single: { label: 'Single wall', flutes: 1 },
  double: { label: 'Double wall', flutes: 2 },
  triple: { label: 'Triple wall', flutes: 3 },
} as const

export type Wall = keyof typeof WALLS

/** Liners and fluted mediums in section; one, two or three flutes */
export function FluteSection({ wall, theme = 'light', className }: { wall: Wall; theme?: 'light' | 'dark'; className?: string }) {
  const { label, flutes } = WALLS[wall]
  const [width, liner, gap, period] = [300, 4, 30, 30]
  const height = flutes * gap + (flutes + 1) * liner
  const layers: ReactNode[] = []
  for (let i = 0; i <= flutes; i++) {
    const y = i * (gap + liner)
    layers.push(<rect key={`l${i}`} x="0" y={y} width={width} height={liner} fill={K400} stroke={K600} strokeWidth="1" style={stroke} />)
    if (i < flutes) {
      const top = y + liner
      const mid = top + gap / 2
      const wave: Pt[] = []
      for (let x = 0; x <= width; x += 2) wave.push([x, mid - (gap / 2) * Math.cos((2 * Math.PI * x) / period)])
      layers.push(<polyline key={`f${i}`} points={pts(wave)} stroke={K600} strokeWidth="1.5" style={stroke} />)
    }
  }
  return (
    <figure className={className}>
      <svg
        viewBox={`-10 -10 ${width + 20} ${height + 20}`}
        role="img"
        aria-label={`Illustration: ${label.toLowerCase()} corrugated board in section, ${flutes} fluted ${flutes === 1 ? 'layer' : 'layers'} between ${flutes + 1} liners.`}
        className="h-auto w-full"
        fill="none"
      >
        <rect x="0" y="0" width={width} height={height} fill={K200} />
        {layers}
      </svg>
      <figcaption className={cn('mt-2 text-spec', theme === 'dark' ? 'text-on-dark-muted' : 'text-muted')}>{label}</figcaption>
    </figure>
  )
}
