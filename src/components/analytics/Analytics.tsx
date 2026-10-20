'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CONSENT_KEY, CONSENT_SETTINGS_EVENT, captureUtm, track, whatsappToken, type EventName } from '@/lib/analytics'

type Consent = 'granted' | 'denied' | null

const TRACKED: EventName[] = ['whatsapp_click', 'phone_click', 'email_click', 'product_cta_click']

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

/**
 * Analytics (Technical §10, TD-06): UTM capture on landing, one delegated
 * listener for links marked with data-event, and GA4 behind a minimal
 * accept/decline notice. Without a GA ID there is no notice and nothing is
 * sent anywhere. The choice is stored in this browser and can be changed
 * from the footer.
 */
export function Analytics({ gaId, privacyHref }: { gaId?: string; privacyHref?: string }) {
  const pathname = usePathname()
  const [consent, setConsent] = useState<Consent>(null)
  const [noticeOpen, setNoticeOpen] = useState(false)

  useEffect(() => {
    captureUtm(window.location.search)
    if (!gaId) return
    const stored = readConsent()
    // reading browser storage is only possible after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored)
    setNoticeOpen(stored === null)
    const reopen = () => setNoticeOpen(true)
    window.addEventListener(CONSENT_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, reopen)
  }, [gaId])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-event]')
      const event = el?.dataset.event as EventName | undefined
      if (!el || !event || !TRACKED.includes(event)) return
      const href = el.getAttribute('href') ?? ''
      track(event, {
        location: el.dataset.location,
        page: window.location.pathname,
        family: el.dataset.family,
        token: event === 'whatsapp_click' ? whatsappToken(href) : undefined,
      })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  const choose = (value: 'granted' | 'denied') => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      // storage unavailable: the choice lasts for this page view only
    }
    setConsent(value)
    setNoticeOpen(false)
    if (value === 'denied' && window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' })
  }

  return (
    <>
      {gaId && consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaId)},{page_path:${JSON.stringify(pathname)}});`}
          </Script>
        </>
      )}

      {gaId && noticeOpen && (
        <section
          aria-label="Analytics choice"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper shadow-[0_-4px_24px_rgb(15_23_42/0.08)]"
        >
          <div className="container-site flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <p className="measure text-spec text-ink">
              May we use Google Analytics to see how this site is used? It sets cookies and is off unless you accept.
              {privacyHref && (
                <>
                  {' '}
                  <Link href={privacyHref} className="text-accent underline underline-offset-4">
                    Privacy policy
                  </Link>
                  .
                </>
              )}
            </p>
            <div className="flex shrink-0 gap-3">
              <Button onClick={() => choose('granted')}>Accept</Button>
              <Button variant="outline" onClick={() => choose('denied')}>
                Decline
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

/** Footer link that reopens the analytics notice */
export function ConsentSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))}>
      Analytics choices
    </button>
  )
}
