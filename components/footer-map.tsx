"use client"

import * as React from "react"
import { MapPin, ExternalLink } from "lucide-react"

const OFFICE_LAT = 40.14199365784348
const OFFICE_LNG = -3.924643621440974
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${OFFICE_LAT},${OFFICE_LNG}`
const EMBED_URL = `https://www.google.com/maps?q=${OFFICE_LAT},${OFFICE_LNG}&hl=es&z=15&output=embed`

/**
 * Footer map — mobile-first, industry-standard.
 * Lazy-loads when in view (performance). CTA to open in Google Maps.
 * Awwwards-inspired: clean, accessible, touch-friendly.
 */
export function FooterMap() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { rootMargin: "100px", threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      id="mapa"
      ref={containerRef}
      className="mt-8 lg:mt-10 rounded-xl overflow-hidden border border-navy-foreground/10 scroll-mt-24"
    >
      {/* Map header — address + CTA, mobile-first */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 bg-navy-foreground/5">
        <div className="flex items-start gap-2 min-w-0">
          <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-navy-foreground font-medium text-sm">
              Urb. Apr 19, 1P
            </p>
            <p className="text-navy-foreground/70 text-xs">
              45215 El Viso de San Juan, Toledo, Spain
            </p>
          </div>
        </div>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors touch-manipulation shrink-0"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Cómo llegar
        </a>
      </div>

      {/* Map container — aspect ratio, responsive height */}
      <div className="relative aspect-[4/3] min-h-[220px] sm:aspect-[21/9] sm:min-h-[280px] lg:min-h-[320px] bg-muted">
        {!isVisible ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div className="flex flex-col items-center gap-3 text-navy-foreground/50">
              <MapPin className="h-10 w-10" />
              <span className="text-sm">Cargando mapa...</span>
            </div>
          </div>
        ) : (
          <>
            {!isLoaded && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse"
                aria-hidden
              >
                <MapPin className="h-10 w-10 text-muted-foreground/50" />
              </div>
            )}
            <iframe
              title="Oficina Chivana Real Estate — Urb. Apr 19, 1P, El Viso de San Juan"
              src={EMBED_URL}
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsLoaded(true)}
            />
          </>
        )}
      </div>
    </div>
  )
}
