import { ImageResponse } from 'next/og'

/**
 * Default 1200×630 share image (Technical §6). Ink, the Crease Mark and the
 * H-A headline; no logo until the client sends it (Q-06), no unverified
 * facts. Colours are the design tokens' values (ImageResponse cannot read
 * CSS variables).
 */
export const alt = 'Atharva Corrugations: corrugated packaging, made to your specification'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#0f172a',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 44, height: 6, background: '#60a5fa' }} />
            <div style={{ width: 14, height: 6, background: '#60a5fa' }} />
            <div style={{ width: 14, height: 6, background: '#60a5fa' }} />
          </div>
          <div style={{ fontSize: 26, letterSpacing: 4, color: '#94a3b8' }}>CORRUGATED PACKAGING</div>
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.1, maxWidth: 900 }}>Corrugated packaging, made to your specification.</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#cbd5e1' }}>
          <div>Atharva Corrugations</div>
          <div>Ranjangaon MIDC, Pune</div>
        </div>
      </div>
    ),
    size,
  )
}
