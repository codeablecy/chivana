"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Maximize2, Minimize2 } from "lucide-react"
import { embedDisplayUrl, embedTitle } from "@/lib/embed-display-url"
import { cn } from "@/lib/utils"

interface ProjectHeroVirtualTourProps {
  embedUrl: string
  projectName: string
}

/**
 * Full-bleed virtual tour / 360 block below the hero — distinct from gallery tab embeds.
 * Mobile-first: overlay fullscreen for iframe reliability on iOS; Fullscreen API on desktop.
 */
export function ProjectHeroVirtualTour({
  embedUrl,
  projectName,
}: ProjectHeroVirtualTourProps) {
  const src = embedDisplayUrl(embedUrl)
  const title = embedTitle(embedUrl)
  const [loaded, setLoaded] = useState(false)
  const [embedFullscreenOverlay, setEmbedFullscreenOverlay] = useState(false)
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  const [useOverlayFullscreen, setUseOverlayFullscreen] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    setUseOverlayFullscreen(!mq.matches)
    const handler = () => setUseOverlayFullscreen(!mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    const onFs = () => {
      setIsNativeFullscreen(
        !!document.fullscreenElement && document.fullscreenElement === viewerRef.current,
      )
    }
    document.addEventListener("fullscreenchange", onFs)
    return () => document.removeEventListener("fullscreenchange", onFs)
  }, [])

  const toggleEmbedFullscreen = useCallback(() => {
    if (useOverlayFullscreen) {
      setEmbedFullscreenOverlay((v) => !v)
    } else if (document.fullscreenElement === viewerRef.current) {
      document.exitFullscreen?.()
    } else {
      viewerRef.current?.requestFullscreen?.()
    }
  }, [useOverlayFullscreen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && embedFullscreenOverlay) {
        setEmbedFullscreenOverlay(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [embedFullscreenOverlay])

  useEffect(() => {
    if (embedFullscreenOverlay) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [embedFullscreenOverlay])

  const isFs = isNativeFullscreen || embedFullscreenOverlay

  return (
    <section
      id="tour-virtual"
      className="relative w-full scroll-mt-20 bg-gradient-to-b from-background via-muted/20 to-background"
      aria-labelledby="hero-vt-heading"
    >
      <div className="mx-auto max-w-[100vw] px-0 pt-6 pb-10 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16">
        <div className="mb-6 px-4 text-center sm:px-6 lg:px-8">
          <p className="text-accent font-semibold text-xs tracking-[0.25em] uppercase mb-2">
            Experiencia inmersiva
          </p>
          <h2
            id="hero-vt-heading"
            className="font-serif text-xl font-bold text-foreground sm:text-2xl lg:text-3xl text-balance"
          >
            Tour virtual · {projectName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Explora el proyecto en {title} sin salir de la web.
          </p>
        </div>

        <div className="relative px-2 sm:px-4 lg:px-6">
          <div
            className={cn(
              "relative mx-auto overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-2xl shadow-foreground/5",
              "min-h-[min(72vh,920px)] w-full max-w-[1600px]",
            )}
          >
            <div
              ref={viewerRef}
              className="relative h-[min(72vh,920px)] w-full bg-foreground/5"
            >
              {!loaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                </div>
              )}
              <iframe
                src={src}
                title={`Tour virtual — ${projectName}`}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking; fullscreen"
                allowFullScreen
                onLoad={() => setLoaded(true)}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleEmbedFullscreen()
                }}
                className="absolute bottom-4 right-4 z-20 flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl bg-foreground/85 px-3 py-2.5 text-sm font-medium text-background backdrop-blur-sm transition-colors hover:bg-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
                aria-label={isFs ? "Salir de pantalla completa" : "Pantalla completa"}
              >
                {isFs ? (
                  <>
                    <Minimize2 className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="hidden sm:inline">Salir</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="hidden sm:inline">Pantalla completa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {embedFullscreenOverlay && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Tour virtual a pantalla completa"
        >
          <div className="relative min-h-0 flex-1">
            <iframe
              src={src}
              title={`Tour virtual — ${projectName}`}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking; fullscreen"
              allowFullScreen
            />
          </div>
          <button
            type="button"
            onClick={() => setEmbedFullscreenOverlay(false)}
            className="absolute right-4 top-4 z-10 flex min-h-[44px] items-center gap-2 rounded-xl bg-white/90 px-3 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
            aria-label="Salir de pantalla completa"
          >
            <Minimize2 className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      )}
    </section>
  )
}
