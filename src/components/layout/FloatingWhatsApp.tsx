'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WhatsAppGlyph } from '@/components/ui/WhatsAppGlyph'
import { FLOATING_TOKEN, contextForPath, whatsappUrl } from '@/lib/whatsapp'

/**
 * Floating WhatsApp control (Sitemap §3): bottom right, safe-area aware, ink
 * glyph on green (D-05). Rendered last in the body so it sits late in the
 * tab order. The message names the page; the token marks it as the
 * floating control. Hidden on the quote page so it can never cover the
 * submit button (Sitemap §3); that page has its own WhatsApp links.
 *
 * Below 768 px it would sit over the first screen's content (the hero facts),
 * so there it appears only once the visitor has scrolled half a screen, and
 * steps aside while the footer, which carries WhatsApp itself, is in view.
 * The header's WhatsApp icon covers the first screen. Desktop: always shown.
 */
export function FloatingWhatsApp({ number }: { number: string }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [footerInView, setFooterInView] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight / 2)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const footer = document.getElementById('site-footer')
    const io = footer ? new IntersectionObserver(([e]) => setFooterInView(e.isIntersecting)) : undefined
    if (footer) io?.observe(footer)
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [pathname])

  if (pathname === '/request-quote') return null
  const { subject } = contextForPath(pathname)
  const href = whatsappUrl(number, { token: FLOATING_TOKEN, subject })

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-event="whatsapp_click"
      data-location="floating"
      data-mobile-hidden={!scrolled || footerInView ? '' : undefined}
      // `invisible` also takes it out of the tab order while hidden
      className="data-[mobile-hidden]:max-md:invisible data-[mobile-hidden]:max-md:translate-y-4 data-[mobile-hidden]:max-md:opacity-0 transition-[opacity,translate,visibility] fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-wa text-on-wa shadow-[0_4px_16px_rgb(15_23_42/0.2)] duration-200 ease-brand hover:scale-105"
    >
      <WhatsAppGlyph className="size-7" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  )
}
