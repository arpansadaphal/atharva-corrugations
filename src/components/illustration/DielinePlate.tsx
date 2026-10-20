import { cn } from '@/lib/utils'
import { rscDieline, type RscInput } from './dieline'

interface DielinePlateProps {
  box?: RscInput
  theme?: 'light' | 'dark'
  /** Play the one-time draw sequence (hero only) */
  animate?: boolean
  /** Show L, W and H dimension callouts */
  callouts?: boolean
  className?: string
}


/**
 * The dieline plate (Design §7.3, §9 Hero A): a regular slotted container
 * unfolded. Cut lines solid, crease lines dashed 6/4, dimension lines 1 px
 * with arrowheads. Proportions only, no sizes: the drawing illustrates
 * structure, it does not claim a product. Captioned as an illustration.
 */
export function DielinePlate({
  box = { length: 400, width: 300, height: 300 },
  theme = 'dark',
  animate = false,
  callouts = true,
  className,
}: DielinePlateProps) {
  const d = rscDieline(box)
  const pad = 70
  const [, x1, x2, x3, , x5] = d.x
  const [y0, y1, y2] = d.y
  const isDark = theme === 'dark'
  const ARROW = `dieline-arrow-${theme}`
  const cut = isDark ? 'var(--on-dark-strong)' : 'var(--ink-900)'
  const crease = isDark ? 'var(--on-dark-muted)' : 'var(--text-muted)'
  const dim = isDark ? 'var(--accent-on-dark)' : 'var(--accent)'
  // scale-independent stroke widths: 1.5 px cuts, 1 px dimensions
  const stroke = { vectorEffect: 'non-scaling-stroke' as const }

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${d.width + pad * 2} ${d.height + pad * 2}`}
      role="img"
      aria-label="Illustration: dieline of a regular slotted carton, unfolded flat. Solid lines are cuts, dashed lines are creases, with length, width and height marked."
      className={cn('h-auto w-full', animate && 'dieline-animate', className)}
      fill="none"
    >
      <defs>
        <marker id={ARROW} viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 8 4 0 8z" fill={dim} />
        </marker>
      </defs>

      <g stroke={cut} strokeWidth="1.5" strokeLinejoin="miter" className="dieline-cuts">
        {d.cuts.map((p) => (
          <path key={p} d={p} style={stroke} />
        ))}
      </g>
      <g stroke={crease} strokeWidth="1" strokeDasharray="6 4" className="dieline-crease">
        {d.creases.map((p) => (
          <path key={p} d={p} style={stroke} />
        ))}
      </g>

      {callouts && (
        <g className="dieline-callouts" stroke={dim} strokeWidth="1">
          <path d={`M${x1} ${y0 - 34} H${x2}`} markerStart={`url(#${ARROW})`} markerEnd={`url(#${ARROW})`} style={stroke} />
          <path d={`M${x2} ${y0 - 34} H${x3}`} markerStart={`url(#${ARROW})`} markerEnd={`url(#${ARROW})`} style={stroke} />
          <path d={`M${x5 + 34} ${y1} V${y2}`} markerStart={`url(#${ARROW})`} markerEnd={`url(#${ARROW})`} style={stroke} />
          <g fill={dim} stroke="none" fontSize="30" fontWeight="600" textAnchor="middle" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <text x={(x1 + x2) / 2} y={y0 - 46}>
              L
            </text>
            <text x={(x2 + x3) / 2} y={y0 - 46}>
              W
            </text>
            <text x={x5 + 54} y={(y1 + y2) / 2 + 10}>
              H
            </text>
          </g>
        </g>
      )}
    </svg>
  )
}
