"use client"

import * as React from "react"
import { MapPin, ExternalLink } from "lucide-react"
import { formatAddressLine, useSettings } from "@/lib/settings-context"

/** How long to wait for iframe load before showing fallback CTA (ms). */
const MAP_LOAD_TIMEOUT_MS = 10_000

/** Preconnect to Google Maps when component mounts so the embed loads faster once we set iframe src. */
function usePreconnectGoogleMaps() {
  React.useEffect(() => {
    const origins = [
      "https://www.google.com",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
    ]
    const links: HTMLLinkElement[] = []
    origins.forEach((origin) => {
      const link = document.createElement("link")
      link.rel = "preconnect"
      link.href = origin
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
      links.push(link)
    })
    return () => links.forEach((link) => link.remove())
  }, [])
}

/**
 * Footer map — mobile-first, reliable UX.
 * - Preconnects to Google Maps when component mounts (faster first byte when embed loads).
 * - Lazy-loads when near viewport (larger rootMargin so map starts loading before user reaches footer).
 * - Skeleton placeholder with shimmer to reduce perceived wait.
 * - Timeout fallback: if embed doesn’t load in time, show CTA to open in Google Maps.
 * Uses office coordinates and address from site settings (DB).
 */
export function FooterMap() {
  const settings = useSettings()
  const [isVisible, setIsVisible] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [showTimeoutFallback, setShowTimeoutFallback] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const loadTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  usePreconnectGoogleMaps()

  const officeLat = settings.officeLat ?? 40.14199365784348
  const officeLng = settings.officeLng ?? -3.92464362144097
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${officeLat},${officeLng}`
  const embedUrl = `https://www.google.com/maps?q=${officeLat},${officeLng}&hl=es&z=15&output=embed`
  const addressLine =
    formatAddressLine(settings) ||
    "Urb. Apr 19, 1P, 45215 El Viso de San Juan, Toledo"

  // Start loading when section is near viewport so embed has time to paint before user sees it
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { rootMargin: "300px", threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Timeout: if iframe doesn't load in time, show fallback CTA
  React.useEffect(() => {
    if (!isVisible || isLoaded || showTimeoutFallback) return

    loadTimeoutRef.current = setTimeout(() => {
      setShowTimeoutFallback(true)
    }, MAP_LOAD_TIMEOUT_MS)

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    }
  }, [isVisible, isLoaded, showTimeoutFallback])

  const handleIframeLoad = React.useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
    setIsLoaded(true)
  }, [])

  const isLoading = isVisible && !isLoaded && !showTimeoutFallback
  const showIframe = isVisible && (isLoaded || !showTimeoutFallback)

  return (
    <div
      id="mapa"
      ref={containerRef}
      className="mt-8 lg:mt-10 rounded-xl overflow-hidden border border-navy-foreground/10 scroll-mt-24"
    >
      {/* Map header — address + CTA, mobile-first */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 bg-navy-foreground/5">
        <div className="flex items-start gap-2 min-w-0">
          <MapPin
            className="h-5 w-5 text-accent shrink-0 mt-0.5"
            aria-hidden
          />
          <div>
            {settings.address && (
              <p className="text-navy-foreground font-medium text-sm">
                {settings.address}
              </p>
            )}
            <p className="text-navy-foreground/70 text-xs">
              {addressLine}
              {addressLine && (settings.city || settings.province)
                ? ", Spain"
                : ""}
            </p>
          </div>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors touch-manipulation shrink-0"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Cómo llegar
        </a>
      </div>

      {/* Map container — stable aspect ratio, no CLS */}
      <div
        className="relative aspect-[4/3] min-h-[220px] sm:aspect-[21/9] sm:min-h-[280px] lg:min-h-[320px] bg-muted"
        aria-busy={isLoading}
        aria-live="polite"
        aria-label="Mapa de ubicación de la oficina"
      >
        {/* Placeholder: before we've started loading (not yet visible) */}
        {!isVisible && (
          <MapSkeleton
            message="Cargando mapa..."
            className="absolute inset-0"
          />
        )}

        {/* Placeholder: visible but iframe not loaded yet (shimmer) */}
        {isLoading && (
          <MapSkeleton
            message=""
            className="absolute inset-0 z-10"
            withShimmer
          />
        )}

        {/* Timeout fallback: embed took too long — offer direct link */}
        {showTimeoutFallback && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-muted/95 px-4"
            role="status"
            aria-live="polite"
          >
            <MapPin className="h-12 w-12 text-muted-foreground" aria-hidden />
            <p className="text-sm text-center text-muted-foreground max-w-[280px]">
              El mapa tarda más de lo habitual. Puedes abrirlo directamente en
              Google Maps.
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors touch-manipulation"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Abrir en Google Maps
            </a>
          </div>
        )}

        {/* Embed: only mount when in view; loading="lazy" is redundant but harmless */}
        {showIframe && (
          <iframe
            title={`Oficina ${settings.companyName} — ${addressLine}`}
            src={embedUrl}
            width="100%"
            height="100%"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Skeleton placeholder for the map area — reduces perceived wait and layout shift.
 */
function MapSkeleton({
  message,
  className,
  withShimmer = false,
}: {
  message: string
  className?: string
  withShimmer?: boolean
}) {
  return (
    <div
      className={className}
      aria-hidden={!message}
      role={message ? "status" : undefined}
      aria-label={message || undefined}
    >
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted ${withShimmer ? "overflow-hidden" : ""}`}
      >
        {withShimmer && (
          <div
            className="absolute inset-0 -translate-x-full map-skeleton-shimmer w-[60%] bg-gradient-to-r from-transparent via-white/10 to-transparent"
            aria-hidden
          />
        )}
        <MapPin
          className={`h-10 w-10 shrink-0 ${withShimmer ? "text-muted-foreground/40" : "text-navy-foreground/50"}`}
        />
        {message && (
          <span className="text-sm text-navy-foreground/50">{message}</span>
        )}
      </div>
    </div>
  )
}
