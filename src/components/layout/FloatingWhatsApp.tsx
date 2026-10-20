'use client'

import { usePathname } from 'next/navigation'
import { WhatsAppGlyph } from '@/components/ui/WhatsAppGlyph'
import { FLOATING_TOKEN, contextForPath, whatsappUrl } from '@/lib/whatsapp'

/**
 * Floating WhatsApp control (Sitemap §3): bottom right, safe-area aware, ink
 * glyph on green (D-05). Rendered last in the body so it sits late in the
 * tab order. The message names the page; the token marks it as the
 * floating control. Pages with a submit button near the bottom (the quote
 * form) reserve space for it with `pb-24` on mobile.
 */
export function FloatingWhatsApp({ number }: { number: string }) {
  const pathname = usePathname()
  const { subject } = contextForPath(pathname)
  const href = whatsappUrl(number, { token: FLOATING_TOKEN, subject })

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-event="whatsapp_click"
      data-location="floating"
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-wa text-on-wa shadow-[0_4px_16px_rgb(15_23_42/0.2)] transition-transform duration-150 ease-brand hover:scale-105"
    >
      <WhatsAppGlyph className="size-7" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  )
}
