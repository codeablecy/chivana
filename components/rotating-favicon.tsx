"use client"

import { useEffect, useRef } from "react"

/**
 * Real estate themed favicon paths (house, key, map pin, building).
 * Served from public/favicons so href works in browser tab.
 */
const FAVICON_PATHS = [
  "/favicons/icon-house.svg",
  "/favicons/icon-key.svg",
  "/favicons/icon-pin.svg",
  "/favicons/icon-building.svg",
] as const

const ROTATE_INTERVAL_MS = 1_500

/**
 * Cycles the browser tab favicon through 2–4 real estate icons.
 * Respects prefers-reduced-motion by not rotating.
 */
export function RotatingFavicon() {
  const indexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !document.head) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const setFavicon = (href: string) => {
      let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
      if (!link) {
        link = document.createElement("link")
        link.rel = "icon"
        link.type = "image/svg+xml"
        document.head.appendChild(link)
      }
      link.href = href
    }

    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % FAVICON_PATHS.length
      setFavicon(FAVICON_PATHS[indexRef.current])
    }, ROTATE_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return null
}
