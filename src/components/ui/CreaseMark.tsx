'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Crease Mark (Design §7.1): one cut segment and two crease dashes in the
 * accent, drawn left to right once when it enters the viewport. Decorative,
 * so hidden from assistive technology. Styles live in globals.css.
 */
export function CreaseMark({ theme = 'light', className }: { theme?: 'light' | 'dark'; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.drawn = ''
        observer.disconnect()
      },
      { rootMargin: '0px 0px -80px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('crease-mark', theme === 'dark' ? 'text-accent-on-dark' : 'text-accent', className)}
    />
  )
}
