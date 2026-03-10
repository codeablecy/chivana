"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Scrolls the window to top on every route change, before paint.
 * Prevents "start from bottom then scroll up" when navigating to home or any page.
 * Uses useLayoutEffect + behavior 'instant' so the user never sees the wrong position.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}
