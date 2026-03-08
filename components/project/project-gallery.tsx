"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

const TABS = ["Fotos", "Vídeos", "Tour 360°", "Parcela", "Construccion"] as const
type TabId = (typeof TABS)[number]

export function ProjectGallery({
  gallery,
}: {
  gallery: {
    photos: { src: string; alt: string }[]
    construction: { src: string; alt: string }[]
    videos?: { src: string; alt: string; url?: string }[]
    tour360?: { url: string; thumb?: string }[]
    parcela?: { src: string; alt: string }[]
  }
}) {
  const [activeTab, setActiveTab] = useState<TabId>("Fotos")
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [tour360LightboxUrl, setTour360LightboxUrl] = useState<string | null>(
    null
  )
  const [tour360PreviewLoaded, setTour360PreviewLoaded] = useState(false)
  const [tour360SelectedIndex, setTour360SelectedIndex] = useState(0)

  const isTour360Tab = activeTab === "Tour 360°"
  const tour360Tours = gallery.tour360 ?? []
  const hasTour360 = tour360Tours.length > 0
  const currentTour360Url = hasTour360
    ? tour360Tours[tour360SelectedIndex]?.url ?? tour360Tours[0].url
    : null

  useEffect(() => {
    if (!isTour360Tab) setTour360PreviewLoaded(false)
  }, [isTour360Tab])

  const getImagesForTab = (tab: TabId) => {
    switch (tab) {
      case "Fotos":
        return gallery.photos
      case "Construccion":
        return gallery.construction
      case "Vídeos":
        return gallery.videos ?? []
      case "Tour 360°":
        return (gallery.tour360 ?? []).map((t) => ({
          src: t.thumb ?? "/placeholder.svg",
          alt: "Tour 360°",
        }))
      case "Parcela":
        return gallery.parcela ?? []
      default:
        return []
    }
  }

  const images = getImagesForTab(activeTab)
  const currentImage = images[activeIndex]
  const hasImages = images.length > 0

  useEffect(() => {
    setActiveIndex(0)
  }, [activeTab])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i > 0 ? i - 1 : images.length - 1))
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i < images.length - 1 ? i + 1 : 0))
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, images.length])

  return (
    <section id="galeria" className="py-16 px-4 lg:py-24 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Galeria
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Conoce el Proyecto
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab}
              </button>
            ))}
        </div>

        {isTour360Tab && hasTour360 && currentTour360Url ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-muted">
              {!tour360PreviewLoaded && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-muted"
                  aria-hidden
                >
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
              <iframe
                key={currentTour360Url}
                src={currentTour360Url}
                title="Tour 360° - Vista previa"
                className="absolute inset-0 h-full w-full border-0"
                allow="fullscreen; xr-spatial-tracking"
                allowFullScreen
                onLoad={() => setTour360PreviewLoaded(true)}
              />
              <button
                type="button"
                onClick={() => setTour360LightboxUrl(currentTour360Url)}
                className="absolute bottom-4 right-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Abrir en pantalla completa
              </button>
            </div>
            {tour360Tours.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                {tour360Tours.map((tour, idx) => (
                  <button
                    key={tour.url}
                    type="button"
                    onClick={() => {
                      setTour360SelectedIndex(idx)
                      setTour360PreviewLoaded(false)
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      tour360SelectedIndex === idx
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Tour {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : hasImages ? (
          <div className="space-y-4">
            {/* Main featured image with nav buttons */}
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-muted group">
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-inset"
                aria-label="Ver imagen en pantalla completa"
              >
                <Image
                  src={currentImage?.src || "/placeholder.svg"}
                  alt={currentImage?.alt ?? "Imagen del proyecto"}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 1280px"
                  priority
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
              </button>

              {/* Prev/Next nav buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveIndex((i) =>
                        i > 0 ? i - 1 : images.length - 1
                      )
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center text-foreground hover:bg-white hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveIndex((i) =>
                        i < images.length - 1 ? i + 1 : 0
                      )
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center text-foreground hover:bg-white hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6" strokeWidth={2} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 rounded-full bg-foreground/60 backdrop-blur-sm px-3 py-1.5 text-card text-xs font-medium">
                {activeIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
                role="tablist"
                aria-label="Seleccionar imagen"
              >
                {images.map((image, idx) => (
                  <button
                    key={`${image.src}-${idx}`}
                    onClick={() => setActiveIndex(idx)}
                    role="tab"
                    aria-selected={idx === activeIndex}
                    aria-label={`Ver imagen ${idx + 1}: ${image.alt}`}
                    className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      idx === activeIndex
                        ? "border-accent ring-2 ring-accent/30"
                        : "border-transparent opacity-70 hover:opacity-100 hover:border-muted-foreground/30"
                    }`}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/10] rounded-xl bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Sin imágenes</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
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

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) =>
                    i > 0 ? i - 1 : images.length - 1
                  )
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-7 h-7" strokeWidth={2} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) =>
                    i < images.length - 1 ? i + 1 : 0
                  )
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-foreground hover:bg-white transition-all"
                aria-label="Siguiente imagen"
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
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-card/80 text-sm">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}

      {/* Tour 360° lightbox (iframe: Matterport, Wizio, etc.) */}
      <Dialog
        open={!!tour360LightboxUrl}
        onOpenChange={(open) => !open && setTour360LightboxUrl(null)}
      >
        <DialogContent
          className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 overflow-hidden border-0 bg-black [&>button]:text-white [&>button]:opacity-90 [&>button]:hover:opacity-100 [&>button]:z-10"
        >
          <DialogTitle className="sr-only">Tour 360° - Vista inmersiva</DialogTitle>
          {tour360LightboxUrl && (
            <iframe
              src={tour360LightboxUrl}
              title="Tour 360°"
              className="absolute inset-0 w-full h-full border-0"
              allow="fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
