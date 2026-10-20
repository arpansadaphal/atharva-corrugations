'use client'

import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Footer column that is an accordion on mobile and always open from 768 px
 * (Sitemap §3). The heading stays a heading; the toggle lives inside it.
 */
export function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="border-b border-line-dark md:border-0">
      <h2 className="text-label font-semibold text-on-dark-muted uppercase">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-11 w-full items-center justify-between uppercase md:hidden"
        >
          {title}
          <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} />
        </button>
        <span className="hidden md:block">{title}</span>
      </h2>
      <div id={panelId} className={cn(open ? 'block' : 'hidden', 'pb-4 md:mt-4 md:block md:pb-0')}>
        {children}
      </div>
    </div>
  )
}
