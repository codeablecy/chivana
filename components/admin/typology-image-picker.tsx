"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronUp, ChevronDown, ImagePlus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TypologyImage {
  src: string
  alt: string
}

const DEFAULT_IMAGES = [
  "/images/living-room.jpg",
  "/images/kitchen.jpg",
  "/images/bedroom.jpg",
  "/images/bathroom.jpg",
  "/images/exterior.jpg",
  "/images/hero.jpg",
]

/**
 * Mobile-first image picker for typology (Las Viviendas).
 * Add URLs, reorder, remove. First image = hero/thumbnail.
 */
export function TypologyImagePicker({
  images = [],
  onChange,
  typologyName,
  className,
}: {
  images: TypologyImage[]
  onChange: (images: TypologyImage[]) => void
  typologyName?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [newUrl, setNewUrl] = React.useState("")
  const [newAlt, setNewAlt] = React.useState("")

  const addFromUrl = () => {
    const src = newUrl.trim()
    if (!src) return
    onChange([...images, { src, alt: newAlt.trim() || typologyName || "Imagen" }])
    setNewUrl("")
    setNewAlt("")
  }

  const addQuick = (src: string) => {
    const exists = images.some((i) => i.src === src)
    if (exists) return
    onChange([...images, { src, alt: typologyName || "Imagen" }])
  }

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [removed] = next.splice(from, 1)
    next.splice(to, 0, removed)
    onChange(next)
  }

  const heroImage = images[0]
  const count = images.length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border border-dashed border-border p-2 text-left transition-colors hover:border-primary hover:bg-muted/30",
            "min-h-[52px] w-full sm:w-auto sm:min-w-[140px]",
            className
          )}
          aria-label="Gestionar imágenes para Las Viviendas"
        >
          <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded bg-muted">
            {heroImage?.src ? (
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImagePlus className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-foreground">
              {count > 0 ? `${count} imagen${count !== 1 ? "es" : ""}` : "Añadir imágenes"}
            </span>
            <span className="block text-[10px] text-muted-foreground">
              Las Viviendas
            </span>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-2xl flex flex-col"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Imágenes de tipología</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto pb-6">
          <p className="text-sm text-muted-foreground">
            La primera imagen se usa como principal. Arrastra para reordenar.
          </p>

          {/* Quick-add common images */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Añadir rápidamente
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_IMAGES.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => addQuick(src)}
                  className="relative h-12 w-16 rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Añadir por URL
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Texto alternativo"
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                className="sm:w-32"
              />
              <Button type="button" size="sm" onClick={addFromUrl} disabled={!newUrl.trim()}>
                <ImagePlus className="h-4 w-4 mr-1" />
                Añadir
              </Button>
            </div>
          </div>

          {/* Image list */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Imágenes ({images.length})
            </p>
            {images.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Sin imágenes. Añade una desde arriba.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {images.map((img, idx) => (
                  <div
                    key={`${img.src}-${idx}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => move(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded hover:bg-muted disabled:opacity-30 touch-manipulation"
                        aria-label="Mover arriba"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(idx, idx + 1)}
                        disabled={idx === images.length - 1}
                        className="p-1.5 rounded hover:bg-muted disabled:opacity-30 touch-manipulation"
                        aria-label="Mover abajo"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-muted">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-primary/90 text-[10px] text-primary-foreground text-center py-0.5">
                          Principal
                        </span>
                      )}
                    </div>
                    <span className="flex-1 truncate text-xs text-muted-foreground">
                      {img.alt || "Sin descripción"}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => remove(idx)}
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
