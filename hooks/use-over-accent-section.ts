"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

/** Height of the CTA bar zone from bottom of viewport (px) */
const CTA_ZONE_HEIGHT = 80

/**
 * Detects when the CTA bar overlaps an accent (orange) section.
 * Uses scroll/resize listeners + Intersection Observer to check if any
 * [data-accent-section] element occupies the bottom CTA zone of the viewport.
 */
export function useOverAccentSection() {
  const [isOverAccent, setIsOverAccent] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const sections = document.querySelectorAll("[data-accent-section]")
    if (sections.length === 0) return

    const checkOverlap = () => {
      const viewportBottom = window.innerHeight
      const ctaZoneTop = viewportBottom - CTA_ZONE_HEIGHT

      for (const el of sections) {
        const rect = el.getBoundingClientRect()
        const overlapsCtaZone =
          rect.top < viewportBottom && rect.bottom > ctaZoneTop
        if (overlapsCtaZone) {
          setIsOverAccent(true)
          return
        }
      }
      setIsOverAccent(false)
    }

    checkOverlap()

    const observer = new IntersectionObserver(
      () => checkOverlap(),
      {
        threshold: 0,
        rootMargin: "0px",
      }
    )

    sections.forEach((el) => observer.observe(el))

    window.addEventListener("scroll", checkOverlap, { passive: true })
    window.addEventListener("resize", checkOverlap)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", checkOverlap)
      window.removeEventListener("resize", checkOverlap)
    }
  }, [pathname])

  return isOverAccent
}
