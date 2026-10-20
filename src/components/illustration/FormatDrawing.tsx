import type { DrawingId } from '@/data/products'
import { DielinePlate } from './DielinePlate'
import { AngleCornerDrawing, DieCutDrawing, HeavyDutyDrawing, HoneycombDrawing, PartitionDrawing } from './drawings'

/** One drawing from the illustration set by id (Design §7.4) */
export function Illustration({ id, className }: { id: DrawingId; className?: string }) {
  switch (id) {
    case 'rsc':
    case 'fol':
      return <DielinePlate theme="light" callouts={false} box={{ length: 400, width: 300, height: 300, style: id }} className={className} />
    case 'diecut':
      return <DieCutDrawing className={className} />
    case 'heavy':
      return <HeavyDutyDrawing className={className} />
    case 'partition':
      return <PartitionDrawing className={className} />
    case 'angle':
      return <AngleCornerDrawing className={className} />
    case 'honeycomb':
      return <HoneycombDrawing className={className} />
  }
}

/** A format's drawing with its "Illustration" caption (Design §7.3), when one exists */
export function FormatDrawing({ drawing, className }: { drawing?: DrawingId; className?: string }) {
  if (!drawing) return null
  return (
    <figure className={className}>
      {drawing === 'rsc' || drawing === 'fol' ? (
        <DielinePlate theme="light" callouts box={{ length: 400, width: 300, height: 300, style: drawing }} />
      ) : (
        <Illustration id={drawing} />
      )}
      <figcaption className="mt-2 text-spec text-muted">Illustration</figcaption>
    </figure>
  )
}
