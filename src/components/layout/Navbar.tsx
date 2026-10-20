'use client'

import { ChevronDown, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { WhatsAppGlyph } from '@/components/ui/WhatsAppGlyph'
import { primaryNav, quoteHref, type NavLink } from '@/data/navigation'
import { cn } from '@/lib/utils'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'
import { MobileMenu } from './MobileMenu'

export interface NavbarProps {
  /** Group name, resolved on the server through the claims gate */
  groupName?: string
  /** WhatsApp number, resolved on the server; no control without it */
  whatsappNumber?: string
  /** Products dropdown links, resolved on the server (minimum content bar) */
  productLinks: NavLink[]
}

/** Same width as the `nav` variant in globals.css */
const NAV_DESKTOP_QUERY = '(width >= 72rem)'

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Header (Sitemap §3, Design §13). Permanently white, matching the as-built
 * Group navbar (D-04); scroll only deepens the hairline into a shadow.
 * Full navigation from 1152 px; below that, logo, WhatsApp control and menu button.
 */
export function Navbar({ groupName, whatsappNumber, productLinks }: NavbarProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const waHref = whatsappNumber ? whatsappUrl(whatsappNumber, contextForPath(pathname)) : undefined
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuButton.current?.focus()
  }, [])

  // The open menu locks page scrolling, so it must never stay open where it
  // cannot be seen: close it on every route change…
  const [menuPath, setMenuPath] = useState(pathname)
  if (pathname !== menuPath) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  // …and when the window grows to desktop width, where CSS hides the menu
  // (for example a Mac window switched to full screen while it was open)
  useEffect(() => {
    const desktop = window.matchMedia(NAV_DESKTOP_QUERY)
    const onChange = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-paper transition-shadow duration-200 ease-brand',
        scrolled ? 'border-line shadow-[0_1px_12px_rgb(15_23_42/0.08)]' : 'border-line',
      )}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-4 xl:gap-6">
        <Link href="/" className="flex shrink-0 flex-col">
          <span className="text-ui font-semibold text-ink">Atharva Corrugations</span>
          {groupName && <span className="text-label text-muted">An {groupName} company</span>}
        </Link>

        <nav aria-label="Main" className="hidden nav:block">
          <ul className="flex items-center gap-5 xl:gap-8">
            {primaryNav.map((item) =>
              item.hasMenu ? (
                <li key={item.href}>
                  <ProductsMenu label={item.label} links={productLinks} active={isActive(pathname, item.href)} />
                </li>
              ) : (
                <li key={item.href}>
                  <NavItem href={item.href} active={isActive(pathname, item.href)}>
                    {item.label}
                  </NavItem>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2 nav:gap-4">
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              data-event="whatsapp_click"
              data-location="nav"
              className="inline-flex size-11 items-center justify-center gap-2 rounded-lg text-ink hover:text-accent xl:size-auto xl:h-11 xl:px-2 xl:text-ui xl:font-medium"
            >
              <WhatsAppGlyph />
              <span className="sr-only xl:not-sr-only">WhatsApp</span>
            </a>
          )}
          <Button href={quoteHref} className="hidden nav:inline-flex">
            Request a quote
          </Button>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="inline-flex size-11 items-center justify-center rounded-lg text-ink nav:hidden"
          >
            <Menu aria-hidden="true" className="size-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        pathname={pathname}
        whatsappHref={waHref}
      />
    </header>
  )
}

function NavItem({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn('nav-underline py-2 text-ui font-medium whitespace-nowrap', active ? 'text-accent' : 'text-ink hover:text-accent')}
      data-active={active || undefined}
    >
      {children}
    </Link>
  )
}

/**
 * Products dropdown as a disclosure (not an ARIA menu): the trigger is a
 * button, so Enter and Space open it for keyboard users (Sitemap §3);
 * Escape closes it and returns focus; leaving it by Tab or click closes it.
 */
/** How long the panel stays after a mouse leaves it, so a diagonal move to a link does not close it */
const HOVER_CLOSE_MS = 200

function ProductsMenu({ label, links, active }: { label: string; links: NavLink[]; active: boolean }) {
  // 'hover': opened by a mouse resting on it, closes when the mouse leaves.
  // 'pinned': opened by click, tap, Enter or Space, stays until dismissed.
  // A click while hover-open pins it rather than closing it: the defect
  // found in the frontend audit (hover opened it, the click toggled it shut).
  const [mode, setMode] = useState<null | 'hover' | 'pinned'>(null)
  const open = mode !== null
  const pathname = usePathname()
  const panelId = useId()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Pointer hover (mouse only: touch taps also fire enter events), Escape
  // and focus leaving the group. Delegated listeners on the wrapper: the
  // controls themselves stay a native button and links.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      clearTimeout(closeTimer.current)
      setMode((m) => m ?? 'hover')
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      clearTimeout(closeTimer.current)
      closeTimer.current = setTimeout(() => setMode((m) => (m === 'hover' ? null : m)), HOVER_CLOSE_MS)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMode((m) => {
        if (m) trigger.current?.focus()
        return null
      })
    }
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node)) setMode(null)
    }
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('keydown', onKey)
    el.addEventListener('focusout', onFocusOut)
    return () => {
      clearTimeout(closeTimer.current)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('keydown', onKey)
      el.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setMode(null)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimeout(closeTimer.current)
          setMode((m) => (m === 'pinned' ? null : 'pinned'))
        }}
        data-active={active || undefined}
        className={cn(
          'nav-underline inline-flex items-center gap-1 py-2 text-ui font-medium whitespace-nowrap',
          active ? 'text-accent' : 'text-ink hover:text-accent',
        )}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn('size-4 transition-transform duration-200 ease-brand', open && 'rotate-180')}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-3"
      >
        <ul className="border border-line bg-paper py-2 shadow-[0_8px_24px_rgb(15_23_42/0.08)]">
          {links.map((l, i) => (
            <li key={l.href} className={cn(i === links.length - 1 && 'mt-2 border-t border-line pt-2')}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? 'page' : undefined}
                onClick={() => setMode(null)}
                className="block px-5 py-2.5 text-ui text-ink hover:bg-paper-50 hover:text-accent"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
