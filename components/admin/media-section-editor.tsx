"use client"

import * as React from "react"
import Image from "next/image"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type MediaItem = { src: string; alt: string } | { src: string; alt: string; url?: string }
type Tour360Item = { url: string; thumb?: string }

interface MediaSectionEditorProps<T extends MediaItem | Tour360Item> {
  items: T[]
  onChange: (items: T[]) => void
  /** For Tour 360 only */
  type?: "photos" | "videos" | "tour360" | "parcela"
  hasHero?: boolean
  heroImage?: string
  onHeroChange?: (src: string) => void
  addPlaceholder?: string
  className?: string
}

const isPhotoItem = (item: unknown): item is { src: string; alt: string } =>
  typeof item === "object" && item !== null && "src" in item && "alt" in item

const isTour360Item = (item: unknown): item is { url: string; thumb?: string } =>
  typeof item === "object" && item !== null && "url" in item

/** Reusable media section editor: reorder, add (URL), remove. */
export function MediaSectionEditor<T extends MediaItem | Tour360Item>({
  items,
  onChange,
  type = "photos",
  hasHero = false,
  heroImage,
  onHeroChange,
  addPlaceholder = "URL de imagen",
  className,
}: MediaSectionEditorProps<T>) {
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null)
  const [overIdx, setOverIdx] = React.useState<number | null>(null)
  const [newUrl, setNewUrl] = React.useState("")
  const [newAlt, setNewAlt] = React.useState("")

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(idx))
  }

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault()
    setDraggedIdx(null)
    setOverIdx(null)
    const fromIdx = parseInt(e.dataTransfer.getData("text/plain") ?? "-1", 10)
    if (fromIdx < 0 || fromIdx === toIdx) return
    const next = [...items]
    const [removed] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, removed)
    onChange(next as T[])
  }

  const handleAdd = () => {
    if (type === "tour360") {
      if (!newUrl.trim()) return
      onChange([...items, { url: newUrl.trim(), thumb: newAlt.trim() || undefined }] as T[])
      setNewUrl("")
      setNewAlt("")
    } else {
      if (!newUrl.trim()) return
      onChange([
        ...items,
        { src: newUrl.trim(), alt: newAlt.trim() || "Sin descripción", ...(type === "videos" ? { url: newUrl.trim() } : {}) },
      ] as T[])
      setNewUrl("")
      setNewAlt("")
    }
  }

  const handleRemove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx) as T[])
  }

  const getThumbSrc = (item: T) => {
    if (isTour360Item(item)) return item.thumb ?? "/placeholder.svg"
    return (item as { src: string }).src
  }

  const getItemLabel = (item: T) => {
    if (isTour360Item(item)) return item.url
    return (item as { alt: string }).alt || "Imagen"
  }

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-xs text-muted-foreground">
        Arrastra para reordenar. Añade URLs de imágenes o videos.
      </p>

      {/* Add new */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder={type === "tour360" ? "URL de embed (Matterport, Wizio, etc.)" : addPlaceholder}
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1"
        />
        {type !== "tour360" && (
          <Input
            placeholder="Texto alternativo"
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            className="sm:w-40"
          />
        )}
        {type === "tour360" && (
          <Input
            placeholder="Thumbnail (opcional)"
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            className="sm:w-40"
          />
        )}
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Añadir
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item, idx) => {
          const thumbSrc = getThumbSrc(item)
          const isHero = hasHero && heroImage === (isPhotoItem(item) ? item.src : thumbSrc)
          return (
            <div
              key={`${idx}-${JSON.stringify(item)}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => {
                e.preventDefault()
                setOverIdx(idx)
              }}
              onDragLeave={() => setOverIdx(null)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={() => {
                setDraggedIdx(null)
                setOverIdx(null)
              }}
              className={cn(
                "relative group rounded-lg overflow-hidden border-2 border-transparent bg-muted aspect-[4/3] cursor-grab active:cursor-grabbing",
                draggedIdx === idx && "opacity-50",
                overIdx === idx && "border-accent ring-2 ring-accent/20"
              )}
            >
              <Image
                src={thumbSrc || "/placeholder.svg"}
                alt={getItemLabel(item)}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2">
                {hasHero && isPhotoItem(item) && onHeroChange && (
                  <Button
                    type="button"
                    size="icon"
                    variant={isHero ? "default" : "secondary"}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onHeroChange(isHero ? "" : item.src)}
                    title={isHero ? "Quitar hero" : "Marcar como hero"}
                  >
                    ★
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(idx)}
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-1 left-1 p-1 rounded bg-background/80">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              {isHero && (
                <div className="absolute top-1 right-1">
                  <span className="text-[10px] font-medium bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                    Hero
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No hay elementos. Añade URLs arriba.
          </p>
        </div>
      )}
    </div>
  )
}
