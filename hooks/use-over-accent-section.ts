"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

/** Detection zone size used for floating UI contrast switching. */
const ZONE_HEIGHT = 80

type AccentZonePosition = "top" | "bottom"

/**
 * Detects when fixed UI overlaps an accent (orange) section.
 * Uses scroll/resize listeners + Intersection Observer to check if any
 * [data-accent-section] element occupies the requested viewport zone.
 */
export function useOverAccentSection(position: AccentZonePosition = "bottom") {
  const [isOverAccent, setIsOverAccent] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const sections = document.querySelectorAll("[data-accent-section]")
    if (sections.length === 0) return

    const checkOverlap = () => {
      const zoneTop = position === "top" ? 0 : window.innerHeight - ZONE_HEIGHT
      const zoneBottom = position === "top" ? ZONE_HEIGHT : window.innerHeight

      for (const el of sections) {
        const rect = el.getBoundingClientRect()
        const overlapsZone = rect.top < zoneBottom && rect.bottom > zoneTop
        if (overlapsZone) {
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
  }, [pathname, position])

  return isOverAccent
}
