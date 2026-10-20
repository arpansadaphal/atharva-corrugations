'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { primaryNav, quoteHref } from '@/data/navigation'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  pathname: string
  whatsappHref?: string
}

/**
 * Mobile overlay (Sitemap §3, Design §13): ink surface with texture, the six
 * links at 24 px, actions at the bottom. Modal: focus is kept inside, body
 * scroll is locked, Escape and any link tap close it.
 */
export function MobileMenu({ open, onClose, pathname, whatsappHref }: MobileMenuProps) {
  const dialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    dialog.current?.querySelector<HTMLElement>('a, button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !dialog.current) return
      const items = [...dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="surface-dark surface-texture fixed inset-0 z-50 flex flex-col nav:hidden"
    >
      <div className="container-site flex h-[72px] items-center justify-between">
        <span className="text-ui font-semibold text-on-dark">Atharva Corrugations</span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-lg text-on-dark"
        >
          <X aria-hidden="true" className="size-6" />
          <span className="sr-only">Close menu</span>
        </button>
      </div>

      <nav aria-label="Main" className="container-site flex-1 overflow-y-auto py-6">
        <ul className="flex flex-col">
          {primaryNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href} className="border-b border-line-dark">
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={cn('block py-4 text-h3 font-normal', active ? 'text-accent-on-dark' : 'text-on-dark')}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="container-site flex flex-col gap-3 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Button href={quoteHref} size="lg" onClick={onClose}>
          Request a quote
        </Button>
        {whatsappHref && (
          <Button
            href={whatsappHref}
            size="lg"
            variant="outline-dark"
            target="_blank"
            rel="noopener noreferrer"
            data-event="whatsapp_click"
            data-location="menu"
          >
            Chat on WhatsApp
          </Button>
        )}
      </div>
    </div>
  )
}
