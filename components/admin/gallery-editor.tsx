"use client"

import * as React from "react"
import Image from "next/image"
import { GripVertical, Star, StarOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface GalleryPhoto {
  src: string
  alt: string
}

export interface GalleryEditorProps {
  photos: GalleryPhoto[]
  heroImage: string
  onReorder: (photos: GalleryPhoto[]) => void
  onHeroChange: (src: string) => void
  className?: string
}

/**
 * Drag-and-drop gallery editor with hero image toggle.
 * First item or the one marked as hero is the main image.
 */
export function GalleryEditor({
  photos,
  heroImage,
  onReorder,
  onHeroChange,
  className,
}: GalleryEditorProps) {
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null)
  const [overIdx, setOverIdx] = React.useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(idx))
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    setOverIdx(idx)
  }

  const handleDragLeave = () => {
    setOverIdx(null)
  }

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault()
    setDraggedIdx(null)
    setOverIdx(null)
    const fromIdx = parseInt(e.dataTransfer.getData("text/plain") ?? "-1", 10)
    if (fromIdx < 0 || fromIdx === toIdx) return
    const next = [...photos]
    const [removed] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, removed)
    onReorder(next)
  }

  const handleDragEnd = () => {
    setDraggedIdx(null)
    setOverIdx(null)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-xs text-muted-foreground">
        Arrastra para reordenar. Haz clic en la estrella para marcar como imagen
        hero.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo, idx) => {
          const isHero = heroImage === photo.src
          return (
            <div
              key={`${photo.src}-${idx}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative group rounded-lg overflow-hidden border-2 border-transparent bg-muted aspect-[4/3] cursor-grab active:cursor-grabbing",
                draggedIdx === idx && "opacity-50",
                overIdx === idx && "border-primary ring-2 ring-primary/20"
              )}
            >
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center gap-2">
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 p-1 rounded bg-background/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="button"
                    size="icon"
                    variant={isHero ? "default" : "ghost"}
                    className="h-8 w-8"
                    onClick={() =>
                      onHeroChange(
                        isHero
                          ? photos[0]?.src ?? photo.src
                          : photo.src
                      )
                    }
                    title={
                      isHero
                        ? "Quitar como hero (usar primera)"
                        : "Usar como imagen hero"
                    }
                  >
                    {isHero ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="absolute top-1 left-1 p-1 rounded bg-background/80">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              {isHero && (
                <div className="absolute top-1 right-1">
                  <span className="text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    Hero
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
