import { cn } from '@/lib/utils'
import { CreaseMark } from './CreaseMark'

export interface SectionHeaderProps {
  /** Section-level taxonomy label only (D-06); omit on sub-blocks */
  eyebrow?: string
  headline: string
  description?: string
  align?: 'left' | 'center'
  theme?: 'light' | 'dark'
  headingLevel?: 'h1' | 'h2'
  id?: string
  className?: string
}

/**
 * SectionHeader — the shared Group API with the Corrugations `mark`
 * (Crease Mark) variant. The mark draws once on load for now; the in-view
 * trigger arrives with the motion layer in the shell milestone.
 */
export function SectionHeader({
  eyebrow,
  headline,
  description,
  align = 'left',
  theme = 'light',
  headingLevel: Heading = 'h2',
  id,
  className,
}: SectionHeaderProps) {
  const isDark = theme === 'dark'

  return (
    <div className={cn('flex flex-col gap-4', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow && (
        <p className="flex items-center gap-3">
          <CreaseMark theme={theme} />
          <span className={cn('text-label font-semibold uppercase', isDark ? 'text-on-dark-muted' : 'text-muted')}>
            {eyebrow}
          </span>
        </p>
      )}

      <Heading
        id={id}
        className={cn(
          Heading === 'h1'
            ? 'text-display-sm font-light lg:text-display'
            : 'text-h2-sm font-normal lg:text-h2',
          isDark ? 'text-on-dark' : 'text-ink',
        )}
      >
        {headline}
      </Heading>

      {description && (
        <p className={cn('measure text-lead', isDark ? 'text-on-dark-body' : 'text-body')}>{description}</p>
      )}
    </div>
  )
}
