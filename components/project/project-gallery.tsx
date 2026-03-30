"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Globe, Play } from "lucide-react"
import { embedDisplayUrl, embedTitle, embedThumb } from "@/lib/embed-display-url"

// ─── Types ─────────────────────────────────────────────────────────────────────

/** Unified display item — either an image or an iframe embed */
type DisplayItem =
  | { kind: "image"; src: string; alt: string }
  | { kind: "embed"; url: string; title: string; thumb?: string }

interface GalleryProps {
  gallery: {
    photos: { src: string; alt: string }[]
    construction: { src: string; alt: string }[]
    videos?: { src: string; alt: string; url?: string }[]
    tour360?: { url: string; thumb?: string }[]
    parcela?: { src: string; alt: string; url?: string }[]
  }
}

const ALL_TABS = ["Fotos", "Vídeos", "Tour 360°", "Parcela", "Construccion"] as const
type TabId = (typeof ALL_TABS)[number]

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Convert raw gallery arrays to a flat list of DisplayItems for a tab */
function getDisplayItems(tab: TabId, gallery: GalleryProps["gallery"]): DisplayItem[] {
  switch (tab) {
    case "Fotos":
      return gallery.photos
        .filter((p) => p.src)
        .map((p) => ({ kind: "image", src: p.src, alt: p.alt }))

    case "Construccion":
      return gallery.construction
        .filter((p) => p.src)
        .map((p) => ({ kind: "image", src: p.src, alt: p.alt }))

    case "Vídeos": {
      const items: DisplayItem[] = []
      for (const v of gallery.videos ?? []) {
        if (v.url && !v.src) {
          // Embed item (YouTube/Vimeo)
          items.push({ kind: "embed", url: v.url, title: v.alt || embedTitle(v.url), thumb: embedThumb(v.url) })
        } else if (v.src) {
          items.push({ kind: "image", src: v.src, alt: v.alt })
        }
      }
      return items
    }

    case "Tour 360°":
      return (gallery.tour360 ?? [])
        .filter((t) => t.url?.trim())
        .map((t) => ({
          kind: "embed" as const,
          url: t.url,
          title: embedTitle(t.url),
          thumb: t.thumb,
        }))

    case "Parcela": {
      const items: DisplayItem[] = []
      for (const p of gallery.parcela ?? []) {
        if (p.url && !p.src) {
          items.push({ kind: "embed", url: p.url, title: p.alt || embedTitle(p.url), thumb: embedThumb(p.url) })
        } else if (p.src) {
          items.push({ kind: "image", src: p.src, alt: p.alt })
        }
      }
      return items
    }

    default:
      return []
  }
}

function tabsWithContent(gallery: GalleryProps["gallery"]): TabId[] {
  return ALL_TABS.filter((tab) => getDisplayItems(tab, gallery).length > 0)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectGallery({ gallery }: GalleryProps) {
  const availableTabs = useMemo(() => tabsWithContent(gallery), [gallery])
  const [activeTab, setActiveTab] = useState<TabId>(() => availableTabs[0] ?? "Fotos")

  useEffect(() => {
    if (availableTabs.length === 0) return
    setActiveTab((cur) => (availableTabs.includes(cur) ? cur : availableTabs[0]))
  }, [availableTabs])
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [embedLoaded, setEmbedLoaded] = useState(false)
  const [embedFullscreenOverlay, setEmbedFullscreenOverlay] = useState(false)
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)
  /** Mobile/tablet: overlay fullscreen; desktop: Fullscreen API */
  const [useOverlayFullscreen, setUseOverlayFullscreen] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    setUseOverlayFullscreen(!mq.matches)
    const handler = () => setUseOverlayFullscreen(!mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const items = useMemo(
    () => getDisplayItems(activeTab, gallery),
    [activeTab, gallery],
  )
  const current = items[activeIndex] ?? null
  const hasItems = items.length > 0
  const isFullscreen = isNativeFullscreen || embedFullscreenOverlay

  // Reset index when tab changes
  useEffect(() => { setActiveIndex(0); setEmbedLoaded(false) }, [activeTab])
  useEffect(() => { setEmbedLoaded(false) }, [activeIndex])

  // Sync native fullscreen state when user exits via Escape or browser UI (desktop only)
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement && document.fullscreenElement === viewerRef.current)
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  const prev = useCallback(() => {
    setActiveIndex((i) => (items.length === 0 ? 0 : i > 0 ? i - 1 : items.length - 1))
  }, [items.length])
  const next = useCallback(() => {
    setActiveIndex((i) => (items.length === 0 ? 0 : i < items.length - 1 ? i + 1 : 0))
  }, [items.length])

  /** Toggle fullscreen: overlay on mobile/tablet (reliable); Fullscreen API on desktop */
  const toggleEmbedFullscreen = useCallback(() => {
    if (useOverlayFullscreen) {
      setEmbedFullscreenOverlay((v) => !v)
    } else {
      if (document.fullscreenElement === viewerRef.current) {
        document.exitFullscreen?.()
      } else {
        viewerRef.current?.requestFullscreen?.()
      }
    }
  }, [useOverlayFullscreen])

  // Keyboard navigation for lightbox and embed fullscreen overlay
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (embedFullscreenOverlay) setEmbedFullscreenOverlay(false)
        else if (lightboxOpen) setLightboxOpen(false)
      }
      if (lightboxOpen) {
        if (e.key === "ArrowLeft") prev()
        if (e.key === "ArrowRight") next()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxOpen, embedFullscreenOverlay, prev, next])

  // Lock body scroll when embed fullscreen overlay is open
  useEffect(() => {
    if (embedFullscreenOverlay) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = prevOverflow }
    }
  }, [embedFullscreenOverlay])

  if (availableTabs.length === 0) {
    return null
  }

  return (
    <section id="galeria" className="py-16 px-4 lg:py-24 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Header — left-aligned editorial style */}
        <div className="mb-8">
          <p className="text-accent font-semibold text-xs tracking-[0.2em] uppercase mb-3">Galería</p>
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Conoce el Proyecto
          </h2>
        </div>

        {/* Tab nav — underline style: navigation feel, not settings panel */}
        {availableTabs.length > 1 && (
          <div
            className="flex border-b border-border/60 mb-8 overflow-x-auto scrollbar-hide"
            role="tablist"
            aria-label="Categorías de galería"
          >
            {availableTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  activeTab === tab
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Main viewer */}
        {hasItems && current ? (
          <div className="space-y-4">

            {/* ── Primary viewer (ref used for embed fullscreen so same video plays) ── */}
            <div ref={viewerRef} className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-muted group">

              {current.kind === "image" ? (
                /* ── Image viewer ── */
            <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                  aria-label="Ver imagen en pantalla completa"
            >
              <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 1280px"
                    priority
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-foreground/60 backdrop-blur-sm px-3 py-1.5 text-card text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-3.5 w-3.5" />
                    Ampliar
                  </div>
                </button>
              ) : (
                /* ── Embed viewer (YouTube, Matterport, etc.) ── */
                <>
                  {!embedLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    </div>
                  )}
                  <iframe
                    key={current.url}
                    src={embedDisplayUrl(current.url)}
                    title={current.title}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setEmbedLoaded(true)}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleEmbedFullscreen() }}
                    className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-lg bg-foreground/80 backdrop-blur-sm px-3 py-2.5 min-h-[44px] min-w-[44px] text-sm font-medium text-background hover:bg-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
                    aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 className="h-4 w-4 sm:h-4 sm:w-4 shrink-0" aria-hidden />
                        <span className="hidden sm:inline">Salir</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-4 w-4 sm:h-4 sm:w-4 shrink-0" aria-hidden />
                        <span className="hidden sm:inline">Pantalla completa</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {/* ── Prev / Next ── */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev() }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center text-foreground hover:bg-white hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center text-foreground hover:bg-white hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="w-6 h-6" strokeWidth={2} />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-4 z-20 rounded-full bg-foreground/60 backdrop-blur-sm px-3 py-1.5 text-card text-xs font-medium pointer-events-none">
                {activeIndex + 1} / {items.length}
              </div>
            </div>

            {/* ── Thumbnail strip ── */}
            {items.length > 1 && (
              <div
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
                role="tablist"
                aria-label="Seleccionar elemento"
              >
                {items.map((item, idx) => {
                  const thumbSrc = item.kind === "image"
                    ? item.src
                    : (item.thumb ?? null)
                  return (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => setActiveIndex(idx)}
                      role="tab"
                      aria-selected={idx === activeIndex}
                      aria-label={item.kind === "image" ? `Imagen ${idx + 1}: ${item.alt}` : `${item.title} ${idx + 1}`}
                      className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        idx === activeIndex
                          ? "border-accent ring-2 ring-accent/30"
                          : "border-transparent opacity-70 hover:opacity-100 hover:border-muted-foreground/30"
                      }`}
                    >
                      {thumbSrc ? (
                        <Image src={thumbSrc} alt={item.kind === "image" ? item.alt : item.title} fill className="object-cover" sizes="96px" />
                      ) : (
                        /* Fallback for embeds without a thumbnail */
                        <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center gap-1">
                          {item.kind === "embed" && /youtube/.test(item.url) ? (
                            <Play className="h-5 w-5 text-muted-foreground/70" />
                          ) : (
                            <Globe className="h-5 w-5 text-muted-foreground/70" />
                          )}
                          <span className="text-[9px] text-muted-foreground/60 font-medium truncate w-full text-center px-1">
                            {item.kind === "embed" ? item.title : ""}
                          </span>
                        </div>
                      )}
                      {/* Embed badge */}
                      {item.kind === "embed" && (
                        <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 text-[9px] text-white text-center py-0.5 font-medium">
                          {item.title}
                        </div>
                      )}
            </button>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/10] rounded-xl bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Sin contenido</p>
        </div>
        )}
      </div>

      {/* ── Image lightbox ── */}
      {lightboxOpen && current?.kind === "image" && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-card/10 text-card hover:bg-card/20 transition-colors text-2xl leading-none"
            aria-label="Cerrar"
          >
            &times;
          </button>
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-7 h-7" strokeWidth={2} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-7 h-7" strokeWidth={2} />
              </button>
            </>
          )}
          <div
            className="relative w-full max-w-5xl aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-card/80 text-sm">
            {activeIndex + 1} / {items.length}
          </p>
        </div>
      )}

      {/* Embed fullscreen overlay — used on mobile/tablet where Fullscreen API is unreliable for iframes */}
      {embedFullscreenOverlay && current?.kind === "embed" && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo o tour en pantalla completa"
        >
          <div className="flex-1 relative min-h-0 w-full">
            <iframe
              src={embedDisplayUrl(current.url)}
              title={current.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <button
            type="button"
            onClick={() => setEmbedFullscreenOverlay(false)}
            className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2.5 min-h-[44px] text-sm font-medium text-foreground hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
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
