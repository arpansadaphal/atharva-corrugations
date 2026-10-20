import Link from 'next/link'
import type { ReactNode } from 'react'
import { Gated } from '@/components/ui/Gated'
import { companyLinks, privacyHref } from '@/data/navigation'
import { group } from '@/group/group'
import { formatPhone, telHref } from '@/lib/format'
import { productLinks } from '@/lib/mcb'
import { contextForPath, whatsappUrl } from '@/lib/whatsapp'
import { FooterColumn } from './FooterColumn'

const linkClass = 'text-spec text-on-dark-body hover:text-on-dark underline-offset-4 hover:underline'

function Address({ a }: { a: { line1: string; line2: string; city: string; region: string; postalCode: string } }) {
  return (
    <address className="text-spec not-italic">
      {a.line1}
      <br />
      {a.line2}
      <br />
      {a.city}, {a.region} {a.postalCode}
    </address>
  )
}

function StaticColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-line-dark pb-6 md:border-0 md:pb-0">
      <h2 className="text-label font-semibold text-on-dark-muted uppercase">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}

/**
 * Footer (Sitemap §3, Design §13): flat ink, no texture (P-04); four columns,
 * 2×2 on tablet, accordion on mobile with plant and contact always open.
 * Group panel above the legal row; GSTIN and CIN only once verified.
 */
export function Footer() {
  const groupOffice = group['F-08']

  return (
    <footer data-surface="dark" className="surface-dark">
      <div className="container-site grid grid-cols-1 gap-x-8 gap-y-6 pt-16 pb-10 md:grid-cols-2 md:gap-y-12 lg:grid-cols-4">
        <StaticColumn title="Atharva Corrugations">
          <div className="flex flex-col gap-4">
            <Gated claim="F-05">
              {(a) => (
                <div>
                  <p className="text-spec font-medium text-on-dark">Plant</p>
                  <Address a={a} />
                </div>
              )}
            </Gated>
            <Gated claim="F-15">
              {(url) => (
                <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Open in Maps
                </a>
              )}
            </Gated>
            <Gated claim="F-14">
              {(h) => (
                <p className="text-spec">
                  {h.days}, {h.hours}. Closed {h.closed}.
                </p>
              )}
            </Gated>
          </div>
        </StaticColumn>

        <FooterColumn title="Products">
          <ul className="flex flex-col gap-2">
            {productLinks().map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Company">
          <ul className="flex flex-col gap-2">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <StaticColumn title="Contact">
          <ul className="flex flex-col gap-2 text-spec">
            <Gated claim="F-12">
              {(p) => (
                <>
                  <li>
                    Main:{' '}
                    <a href={telHref(p.main)} className={linkClass} data-event="phone_click" data-location="footer">
                      {formatPhone(p.main)}
                    </a>
                  </li>
                  <li>
                    Sales:{' '}
                    <a href={telHref(p.sales)} className={linkClass} data-event="phone_click" data-location="footer">
                      {formatPhone(p.sales)}
                    </a>
                  </li>
                  <li>
                    <a
                      href={whatsappUrl(p.whatsapp, contextForPath('/contact'))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                      data-event="whatsapp_click"
                      data-location="footer"
                    >
                      WhatsApp {formatPhone(p.whatsapp)}
                    </a>
                  </li>
                </>
              )}
            </Gated>
            <Gated claim="F-13">
              {(e) => (
                <>
                  <li>
                    <a href={`mailto:${e.sales}`} className={linkClass} data-event="email_click" data-location="footer">
                      {e.sales}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${e.general}`} className={`${linkClass} break-all`} data-event="email_click" data-location="footer">
                      {e.general}
                    </a>
                  </li>
                  <li className="mt-2 border-t border-line-dark pt-3">
                    Careers:{' '}
                    <a href={`mailto:${e.hr}`} className={linkClass}>
                      {e.hr}
                    </a>
                    , {formatPhone(e.careersPhone)}
                  </li>
                </>
              )}
            </Gated>
          </ul>
        </StaticColumn>
      </div>

      {/* Group panel (SD-05): name and Group office only, no sister-company list until Q-26 */}
      <Gated claim="F-07">
        <div className="border-t border-line-dark">
          <div className="container-site flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8">
            <p className="text-spec font-medium text-on-dark">Part of the {group['G-name'].value}</p>
            <div className="text-spec text-on-dark-muted">
              <span className="font-medium text-on-dark-body">Group office: </span>
              {groupOffice.value.line1}, {groupOffice.value.line2}, {groupOffice.value.city}{' '}
              {groupOffice.value.postalCode}
            </div>
          </div>
        </div>
      </Gated>

      <div className="border-t border-line-dark">
        <div className="container-site flex flex-col gap-3 py-6 text-spec text-on-dark-muted md:flex-row md:flex-wrap md:items-center md:gap-x-8">
          <p>© Atharva Corrugations</p>
          <Gated claim="F-64">{(gstin) => <p className="tabular">GSTIN {gstin}</p>}</Gated>
          <Gated claim="F-65">{(cin) => <p className="tabular">CIN {cin}</p>}</Gated>
          <Link href={privacyHref} className={linkClass}>
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
