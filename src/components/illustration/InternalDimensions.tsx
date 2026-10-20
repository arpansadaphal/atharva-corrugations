/**
 * Illustration I-12 (Design §7.4): internal dimensions of a regular slotted
 * container, so buyers measure inside the box (Strategy §5.4). Line rules
 * from Design §7.3: 1.5 px cut lines, 1 px dimension lines with arrowheads,
 * mm labels in tabular numerals. Needs the client reviewer's check (SD-10).
 */
export function InternalDimensions({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 320 230"
        role="img"
        aria-labelledby="dims-title dims-desc"
        className="h-auto w-full text-ink"
        fill="none"
        strokeLinecap="butt"
      >
        <title id="dims-title">Internal dimensions of a box</title>
        <desc id="dims-desc">
          An open box drawn in isometric view. Length runs along the long front edge, width along the short side edge and
          height up the corner. All three are measured on the inside of the box.
        </desc>
        <defs>
          <marker id="dims-arrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 8 4 0 8z" fill="currentColor" />
          </marker>
        </defs>

        {/* box body: front, side and top opening (cut lines) */}
        <g stroke="currentColor" strokeWidth="1.5">
          <path d="M60 90 L190 140 L190 210 L60 160 Z" fill="var(--kraft-200)" />
          <path d="M190 140 L270 100 L270 170 L190 210 Z" fill="var(--kraft-300)" />
          <path d="M60 90 L140 50 L270 100 L190 140 Z" fill="var(--paper-0)" />
        </g>
        {/* inside edges seen through the opening (crease style) */}
        <g stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="6 4">
          <path d="M140 50 L140 110 M140 110 L70 140 M140 110 L260 156" />
        </g>

        {/* dimension lines */}
        <g stroke="currentColor" strokeWidth="1" markerStart="url(#dims-arrow)" markerEnd="url(#dims-arrow)">
          <path d="M74 98 L176 137" />
          <path d="M202 134 L256 107" />
          <path d="M150 62 L150 104" />
        </g>
        <g fill="currentColor" fontSize="13" fontWeight="600" style={{ fontVariantNumeric: 'tabular-nums' }}>
          <text x="98" y="132">
            L
          </text>
          <text x="236" y="136">
            W
          </text>
          <text x="158" y="88">
            H
          </text>
        </g>
      </svg>
      <figcaption className="mt-2 text-spec text-muted">
        Illustration. Measure inside the box, in millimetres: length × width × height.
      </figcaption>
    </figure>
  )
}
