import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'outline' | 'outline-dark' | 'whatsapp'
export type ButtonSize = 'md' | 'lg'

// md = 48 px, lg = 52 px: both clear the 44 px target size (Design §14)
const sizeMap: Record<ButtonSize, string> = {
  md: 'h-12 px-6',
  lg: 'h-[52px] px-8',
}

const variantMap: Record<ButtonVariant, string> = {
  /** Solid accent — the one primary action per section */
  primary: 'bg-accent text-on-dark hover:bg-accent-hover',
  /** Outlined on light surfaces */
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-on-dark',
  /** Outlined on ink — e.g. the hero's "Chat on WhatsApp" (not green) */
  'outline-dark': 'border-2 border-on-dark-muted text-on-dark hover:border-on-dark',
  /** WhatsApp green with ink text (white on #25D366 is 1.98:1, D-05).
      Only in the quote band and the floating control. */
  whatsapp: 'bg-wa text-on-wa hover:opacity-90',
}

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-ui font-semibold transition-colors duration-150 ease-brand disabled:cursor-not-allowed disabled:opacity-60'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type ButtonAsLink = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<'button'>, 'className' | 'children'>

/**
 * Button — renders a Next.js <Link> when `href` is given, otherwise a
 * <button>. No arrows on buttons (Design §4).
 */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = 'primary', size = 'md', className, children } = props
  const classes = cn(base, sizeMap[size], variantMap[variant], className)

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...linkProps } = props
    return (
      <Link {...linkProps} className={classes}>
        {children}
      </Link>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...buttonProps } = props
  return (
    <button {...buttonProps} type={type} className={classes}>
      {children}
    </button>
  )
}
