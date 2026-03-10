"use client"

import * as React from "react"
import Image from "next/image"
import { GripVertical, Star, StarOff, Trash2, Upload, Loader2, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface GalleryPhoto {
  src: string
  alt: string
}

export interface GalleryEditorProps {
  photos: GalleryPhoto[]
  heroImage: string
  onReorder: (photos: GalleryPhoto[]) => void
  onHeroChange: (src: string) => void
  onAdd?: (photos: GalleryPhoto[]) => void
  /** Used to build the Supabase Storage path */
  projectSlug?: string
  className?: string
}

/**
 * Gallery editor with drag-and-drop, hero toggle, file upload, and URL add.
 */
export function GalleryEditor({
  photos,
  heroImage,
  onReorder,
  onHeroChange,
  projectSlug = "",
  className,
}: GalleryEditorProps) {
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null)
  const [overIdx, setOverIdx] = React.useState<number | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [urlInput, setUrlInput] = React.useState("")
  const [altInput, setAltInput] = React.useState("")
  const [dropzoneActive, setDropzoneActive] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // ── Drag-and-drop reorder ──────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(idx))
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    setOverIdx(idx)
  }

  const handleDragLeave = () => setOverIdx(null)

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

  const handleRemove = (idx: number) => {
    const next = photos.filter((_, i) => i !== idx)
    onReorder(next)
    if (heroImage === photos[idx]?.src && next.length > 0) {
      onHeroChange(next[0].src)
    }
  }

  // ── File upload ────────────────────────────────────────────────────────────

  const uploadFiles = React.useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
      if (!list.length) {
        toast.error("Sólo se admiten imágenes (JPG, PNG, WebP)")
        return
      }
      setUploading(true)
      const uploaded: GalleryPhoto[] = []
      for (const file of list) {
        try {
          const form = new FormData()
          form.append("file", file)
          form.append("context", "project")
          form.append("slug", projectSlug)
          form.append("category", "photos")
          const res = await fetch("/api/upload", { method: "POST", body: form })
          if (!res.ok) {
            const { error } = await res.json()
            throw new Error(error ?? "Error al subir")
          }
          const { url } = await res.json()
          uploaded.push({ src: url, alt: file.name.replace(/\.[^.]+$/, "") })
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error al subir imagen")
        }
      }
      if (uploaded.length) {
        const next = [...photos, ...uploaded]
        onReorder(next)
        if (!heroImage && next.length > 0) onHeroChange(next[0].src)
        toast.success(`${uploaded.length} imagen${uploaded.length > 1 ? "es" : ""} subida${uploaded.length > 1 ? "s" : ""}`)
      }
      setUploading(false)
    },
    [photos, heroImage, onReorder, onHeroChange, projectSlug],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files)
    e.target.value = ""
  }

  const handleDropzoneFiles = (e: React.DragEvent) => {
    e.preventDefault()
    setDropzoneActive(false)
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }

  // ── URL add ────────────────────────────────────────────────────────────────

  const handleAddUrl = () => {
    const src = urlInput.trim()
    if (!src) return
    const next = [...photos, { src, alt: altInput.trim() || "Imagen" }]
    onReorder(next)
    if (!heroImage) onHeroChange(src)
    setUrlInput("")
    setAltInput("")
  }

  return (
    <div className={cn("space-y-4", className)}>

      {/* ── Upload drop zone ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDropzoneActive(true) }}
        onDragLeave={() => setDropzoneActive(false)}
        onDrop={handleDropzoneFiles}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-7 text-sm cursor-pointer transition-all select-none",
          dropzoneActive
            ? "border-accent bg-accent/5 text-accent scale-[1.01]"
            : "border-muted-foreground/25 text-muted-foreground hover:border-accent/60 hover:bg-muted/30",
          uploading && "pointer-events-none opacity-60",
        )}
        aria-label="Subir fotos"
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <span className="font-medium">Subiendo…</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6" />
            <span className="font-medium">Arrastra fotos aquí o haz clic para seleccionar</span>
            <span className="text-xs opacity-60">JPG · PNG · WebP · múltiples archivos admitidos</span>
          </>
        )}
      </div>

      {/* ── Or paste URL ── */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Link2 className="h-3.5 w-3.5" />
          O añadir por URL
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            className="flex-1"
          />
          <Input
            placeholder="Texto alt"
            value={altInput}
            onChange={(e) => setAltInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            className="w-32"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
          >
            Añadir
          </Button>
        </div>
      </div>

      {/* ── Photo grid ── */}
      {photos.length > 0 ? (
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
                  "relative group rounded-xl overflow-hidden border-2 bg-muted aspect-[4/3] cursor-grab active:cursor-grabbing transition-all",
                  draggedIdx === idx && "opacity-40 scale-95",
                  overIdx === idx ? "border-accent ring-2 ring-accent/30" : "border-transparent",
                )}
              >
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    size="icon"
                    variant={isHero ? "default" : "secondary"}
                    className="h-8 w-8 shadow-md"
                    onClick={() => onHeroChange(isHero ? (photos[0]?.src ?? photo.src) : photo.src)}
                    title={isHero ? "Quitar hero" : "Marcar como hero"}
                  >
                    {isHero ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 shadow-md"
                    onClick={() => handleRemove(idx)}
                    aria-label="Eliminar foto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {/* Drag handle */}
                <div className="absolute top-1.5 left-1.5 p-1 rounded-md bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                {isHero && (
                  <div className="absolute top-1.5 right-1.5">
                    <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md">
                      Hero
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-muted-foreground/20 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Sin fotos. Sube archivos o añade URLs arriba.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="sr-only"
        onChange={handleFileInput}
      />
    </div>
  )
}
