'use client'

import { useEffect, useState } from 'react'

const KEY = 'acpl-review-marks'
const OFF_CLASS = 'review-marks-off'

/**
 * Lets the reviewer hide the dashed outlines to see the design as it will
 * look, and bring them back. The choice is kept in this browser only.
 */
export function ReviewMarksToggle() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let stored = false
    try {
      stored = localStorage.getItem(KEY) === 'hidden'
    } catch {
      // storage unavailable: outlines stay on
    }
    document.documentElement.classList.toggle(OFF_CLASS, stored)
    // reading browser storage is only possible after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHidden(stored)
  }, [])

  const toggle = () => {
    const next = !hidden
    setHidden(next)
    document.documentElement.classList.toggle(OFF_CLASS, next)
    try {
      localStorage.setItem(KEY, next ? 'hidden' : 'shown')
    } catch {
      // storage unavailable: the choice lasts for this page view
    }
  }

  return (
    <button type="button" onClick={toggle} className="min-h-11 underline underline-offset-4">
      {hidden ? 'Show outlines' : 'Hide outlines'}
    </button>
  )
}
