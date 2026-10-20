import { cn } from '@/lib/utils'

/**
 * Crease Mark (Design §7.1): one cut segment and two crease dashes in the
 * accent, drawn left to right once. Decorative, so hidden from assistive
 * technology. Styles live in globals.css (`.crease-mark`).
 */
export function CreaseMark({ theme = 'light', className }: { theme?: 'light' | 'dark'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('crease-mark', theme === 'dark' ? 'text-accent-on-dark' : 'text-accent', className)}
    />
  )
}
