import type { FamilyFormat } from '@/data/products'
import { DielinePlate } from './DielinePlate'

/** The illustration-set drawing for a format, when one exists (Design §7.4) */
export function FormatDrawing({ drawing, className }: { drawing: FamilyFormat['drawing']; className?: string }) {
  if (!drawing) return null
  return (
    <figure className={className}>
      <DielinePlate theme="light" callouts box={{ length: 400, width: 300, height: 300, style: drawing }} />
      <figcaption className="mt-2 text-spec text-muted">Illustration</figcaption>
    </figure>
  )
}
