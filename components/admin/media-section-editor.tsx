"use client"

import * as React from "react"
import Image from "next/image"
import {
  GripVertical, Plus, Trash2, Upload, Loader2,
  Film, Globe, ExternalLink, Link2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Types ─────────────────────────────────────────────────────────────────────

/** An uploaded file or a plain image URL */
export type MediaFileItem = { src: string; alt: string; url?: string }
/** An iframe embed (YouTube, Matterport, etc.) — src is intentionally empty */
export type MediaEmbedItem = { src: string; alt: string; url: string }
/** Tour 360 is always embed-only */
export type Tour360Item = { url: string; thumb?: string }

type AnyItem = MediaFileItem | Tour360Item

interface MediaSectionEditorProps<T extends AnyItem> {
  items: T[]
  onChange: (items: T[]) => void
  type?: "photos" | "videos" | "tour360" | "parcela" | "construction"
  hasHero?: boolean
  heroImage?: string
  onHeroChange?: (src: string) => void
  /**
   * The embed URL of the video currently marked as hero background.
   * Only relevant when `type === "videos"`.
   */
  heroVideoUrl?: string
  /** Called when an embed card's star is clicked. Pass "" to clear. */
  onHeroVideoChange?: (url: string) => void
  addPlaceholder?: string
  /** Supabase Storage folder for this project */
  projectSlug?: string
  className?: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const isTour360 = (item: unknown): item is Tour360Item =>
  typeof item === "object" && item !== null && "url" in item && !("src" in item)

const isFileItem = (item: AnyItem): item is MediaFileItem =>
  "src" in item && (item as MediaFileItem).src !== ""

const isEmbedItem = (item: AnyItem): item is MediaEmbedItem =>
  "src" in item && (item as MediaEmbedItem).src === "" && !!(item as MediaEmbedItem).url

/** Extract YouTube video ID from various URL formats incl. embed URLs */
function ytId(url: string): string | null {
  const patterns = [
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m?.[1]) return m[1]
  }
  return null
}

/** Turn any YouTube URL into a proper embed URL */
function normaliseYouTube(url: string): string {
  const id = ytId(url)
  if (!id) return url
  return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`
}

/** Get a thumbnail for display in the embed card */
function embedThumb(url: string): string | null {
  const id = ytId(url)
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  return null
}

/** Guess embed host label */
function embedLabel(url: string): string {
  if (/youtube\.com|youtu\.be/.test(url)) return "YouTube"
  if (/vimeo\.com/.test(url)) return "Vimeo"
  if (/matterport\.com/.test(url)) return "Matterport"
  if (/wizio\.es|wizio\.com/.test(url)) return "Wizio"
  if (/my\.matterport\.com/.test(url)) return "Matterport"
  try { return new URL(url).hostname.replace("www.", "") } catch { return "Embed" }
}

// ─── Reusable upload hook logic ────────────────────────────────────────────────

function useFileUpload(
  projectSlug: string,
  storageCategory: string,
  onUploaded: (items: { src: string; alt: string; url?: string }[]) => void,
) {
  const [uploading, setUploading] = React.useState(false)
  const [dropActive, setDropActive] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const uploadFiles = React.useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
      )
      if (!list.length) { toast.error("Sólo se admiten imágenes o vídeos"); return }
      setUploading(true)
      const uploaded: { src: string; alt: string }[] = []
      for (const file of list) {
        try {
          const form = new FormData()
          form.append("file", file)
          form.append("context", "project")
          form.append("slug", projectSlug)
          form.append("category", storageCategory)
          const res = await fetch("/api/upload", { method: "POST", body: form })
          if (!res.ok) { const { error } = await res.json(); throw new Error(error ?? "Error") }
          const { url } = await res.json()
          uploaded.push({ src: url, alt: file.name.replace(/\.[^.]+$/, "") })
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error al subir")
        }
      }
      if (uploaded.length) {
        onUploaded(uploaded)
        toast.success(`${uploaded.length} archivo${uploaded.length > 1 ? "s" : ""} subido${uploaded.length > 1 ? "s" : ""}`)
      }
      setUploading(false)
    },
    [projectSlug, storageCategory, onUploaded],
  )

  return { uploading, dropActive, setDropActive, fileInputRef, uploadFiles }
}

// ─── Main component ────────────────────────────────────────────────────────────

/** Reusable media section editor. For videos/parcela shows separate Archivos + Embeds sections. */
export function MediaSectionEditor<T extends AnyItem>({
  items,
  onChange,
  type = "photos",
  hasHero = false,
  heroImage,
  onHeroChange,
  heroVideoUrl,
  onHeroVideoChange,
  addPlaceholder = "URL de imagen",
  projectSlug = "",
  className,
}: MediaSectionEditorProps<T>) {

  const showEmbeds = type === "videos" || type === "parcela"
  const isTour360Type = type === "tour360"
  const showUpload = !isTour360Type

  const storageCategory = type === "construction" ? "construction"
    : type === "parcela" ? "parcela"
    : type === "videos" ? "videos"
    : "photos"

  // ── State ──────────────────────────────────────────────────────────────────

  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null)
  const [overIdx, setOverIdx] = React.useState<number | null>(null)

  // File-add URL inputs
  const [newSrc, setNewSrc] = React.useState("")
  const [newAlt, setNewAlt] = React.useState("")

  // Embed inputs
  const [embedUrl, setEmbedUrl] = React.useState("")
  const [embedTitle, setEmbedTitle] = React.useState("")

  // Tour360 inputs
  const [tourUrl, setTourUrl] = React.useState("")
  const [tourThumb, setTourThumb] = React.useState("")

  // ── Upload ──────────────────────────────────────────────────────────────────

  const { uploading, dropActive, setDropActive, fileInputRef, uploadFiles } =
    useFileUpload(projectSlug, storageCategory, (uploaded) => {
      const next = [...items, ...uploaded.map((u) => ({ src: u.src, alt: u.alt }) as unknown as T)]
      onChange(next)
    })

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files)
    e.target.value = ""
  }

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault()
    setDropActive(false)
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }

  // ── Add handlers ──────────────────────────────────────────────────────────

  const handleAddUrl = () => {
    if (!newSrc.trim()) return
    onChange([...items, { src: newSrc.trim(), alt: newAlt.trim() || "Imagen" } as unknown as T])
    setNewSrc(""); setNewAlt("")
  }

  const handleAddEmbed = () => {
    const raw = embedUrl.trim()
    if (!raw) return
    const normalised = type === "videos" ? normaliseYouTube(raw) : raw
    const title = embedTitle.trim() || (type === "videos" ? (embedLabel(normalised) + " embed") : "Tour 3D")
    onChange([...items, { src: "", alt: title, url: normalised } as unknown as T])
    setEmbedUrl(""); setEmbedTitle("")
  }

  const handleAddTour = () => {
    if (!tourUrl.trim()) return
    onChange([...items, { url: tourUrl.trim(), thumb: tourThumb.trim() || undefined } as unknown as T])
    setTourUrl(""); setTourThumb("")
  }

  const handleRemove = (idx: number) => onChange(items.filter((_, i) => i !== idx) as T[])

  // ── Drag reorder ──────────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(idx))
  }

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault()
    setDraggedIdx(null); setOverIdx(null)
    const fromIdx = parseInt(e.dataTransfer.getData("text/plain") ?? "-1", 10)
    if (fromIdx < 0 || fromIdx === toIdx) return
    const next = [...items]
    const [removed] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, removed)
    onChange(next as T[])
  }

  // ── Derived lists ──────────────────────────────────────────────────────────

  const fileItems = showEmbeds ? items.filter(isFileItem) : items
  const embedItems = showEmbeds ? items.filter(isEmbedItem) : []

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderFileGrid = (subset: AnyItem[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {subset.map((item, localIdx) => {
        const globalIdx = items.indexOf(item as T)
        const src = isTour360(item) ? (item.thumb ?? "/placeholder.svg") : (item as MediaFileItem).src
        const isHero = hasHero && heroImage === src
        return (
          <div
            key={`file-${globalIdx}`}
            draggable
            onDragStart={(e) => handleDragStart(e, globalIdx)}
            onDragOver={(e) => { e.preventDefault(); setOverIdx(globalIdx) }}
            onDragLeave={() => setOverIdx(null)}
            onDrop={(e) => handleDrop(e, globalIdx)}
            onDragEnd={() => { setDraggedIdx(null); setOverIdx(null) }}
            className={cn(
              "relative group rounded-xl overflow-hidden border-2 bg-muted aspect-[4/3] cursor-grab active:cursor-grabbing transition-all",
              draggedIdx === globalIdx && "opacity-40 scale-95",
              overIdx === globalIdx ? "border-accent ring-2 ring-accent/30" : "border-transparent",
            )}
          >
            <Image src={src || "/placeholder.svg"} alt={(item as MediaFileItem).alt ?? ""} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {hasHero && !isTour360(item) && onHeroChange && (
                <Button type="button" size="icon" variant={isHero ? "default" : "secondary"} className="h-8 w-8 shadow-md"
                  onClick={() => onHeroChange(isHero ? "" : (item as MediaFileItem).src)} title={isHero ? "Quitar hero" : "Hero"}>★</Button>
              )}
              <Button type="button" size="icon" variant="destructive" className="h-8 w-8 shadow-md"
                onClick={() => handleRemove(globalIdx)} aria-label="Eliminar">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-1.5 left-1.5 p-1 rounded-md bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            {isHero && (
              <div className="absolute top-1.5 right-1.5">
                <span className="text-[10px] font-semibold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-md">Hero</span>
              </div>
            )}
          </div>
        )
        void localIdx
      })}
    </div>
  )

  const renderEmbedList = (subset: AnyItem[]) => (
    <div className="flex flex-col gap-2">
      {subset.map((item) => {
        const globalIdx = items.indexOf(item as T)
        const embedItem = item as MediaEmbedItem
        const thumb = embedThumb(embedItem.url)
        const label = embedLabel(embedItem.url)
        const isHeroEmbed = type === "videos" && !!heroVideoUrl && heroVideoUrl === embedItem.url
        return (
          <div
            key={`embed-${globalIdx}`}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors",
              isHeroEmbed ? "border-accent ring-1 ring-accent/30" : "border-border",
            )}
          >
            {/* Thumbnail */}
            <div className="relative h-14 w-20 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {thumb ? (
                <Image src={thumb} alt={embedItem.alt} fill className="object-cover" sizes="80px" />
              ) : (
                <Globe className="h-6 w-6 text-muted-foreground/50" />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 text-[9px] text-white text-center py-0.5 font-medium truncate px-1">
                {label}
              </div>
              {isHeroEmbed && (
                <div className="absolute top-1 right-1">
                  <span className="text-[9px] font-bold bg-accent text-accent-foreground px-1 py-0.5 rounded">Hero</span>
                </div>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-sm font-medium text-foreground truncate">{embedItem.alt || "Sin título"}</p>
                {isHeroEmbed && (
                  <span className="shrink-0 text-[10px] font-semibold text-accent">· Hero activo</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{embedItem.url}</p>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {type === "videos" && onHeroVideoChange && (
                <Button
                  type="button"
                  size="icon"
                  variant={isHeroEmbed ? "default" : "secondary"}
                  className={cn(
                    "h-8 w-8 shadow-sm text-base leading-none",
                    isHeroEmbed && "bg-accent hover:bg-accent/90 text-accent-foreground",
                  )}
                  onClick={() => onHeroVideoChange(isHeroEmbed ? "" : embedItem.url)}
                  title={isHeroEmbed ? "Quitar video hero" : "Marcar como hero"}
                  aria-label={isHeroEmbed ? "Quitar video hero" : "Marcar como hero"}
                >
                  ★
                </Button>
              )}
              <a href={embedItem.url} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Abrir en nueva pestaña">
                <ExternalLink className="h-4 w-4" />
              </a>
              <Button type="button" size="icon" variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleRemove(globalIdx)} aria-label="Eliminar embed">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className={cn("space-y-6", className)}>

      {/* ══ SECTION A: Media files (photos / videos) — not for tour360 ══ */}
      {showUpload && (
        <section className="space-y-3">
          {showEmbeds && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Archivos {type === "videos" ? "/ Miniaturas" : "/ Imágenes"}
            </p>
          )}

          {/* Drop zone */}
          <div
            role="button" tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDropActive(true) }}
            onDragLeave={() => setDropActive(false)}
            onDrop={handleDropFiles}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-6 text-sm cursor-pointer transition-all select-none",
              dropActive ? "border-accent bg-accent/5 text-accent scale-[1.01]"
                : "border-muted-foreground/25 text-muted-foreground hover:border-accent/60 hover:bg-muted/30",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <><Loader2 className="h-5 w-5 animate-spin text-accent" /><span className="font-medium">Subiendo…</span></>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="font-medium">Arrastra archivos o haz clic</span>
                <span className="text-xs opacity-60">
                  {type === "videos" ? "JPG · PNG · MP4 · múltiples admitidos" : "JPG · PNG · WebP · múltiples admitidos"}
                </span>
              </>
            )}
          </div>

          {/* URL input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input placeholder={addPlaceholder} value={newSrc}
                onChange={(e) => setNewSrc(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                className="pl-8" />
            </div>
            <Input placeholder="Texto alt" value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
              className="w-32" />
            <Button type="button" variant="outline" size="sm" onClick={handleAddUrl} disabled={!newSrc.trim()}>
              <Plus className="h-4 w-4 mr-1" />Añadir
            </Button>
          </div>

          {/* File grid */}
          {(showEmbeds ? fileItems : items).length > 0 ? (
            renderFileGrid(showEmbeds ? fileItems : items)
          ) : (
            <div className="rounded-xl border border-dashed border-muted-foreground/20 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Sin archivos. Sube o añade URLs arriba.
              </p>
            </div>
          )}

          <input ref={fileInputRef} type="file" multiple
            accept={type === "videos" ? "image/*,video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/gif"}
            className="sr-only" onChange={handleFileInput} />
        </section>
      )}

      {/* ══ SECTION B: Embeds (YouTube/Vimeo for videos; 3D tours for parcela) ══ */}
      {showEmbeds && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Film className="h-3.5 w-3.5" />
              {type === "videos" ? "Embeds de vídeo (YouTube / Vimeo)" : "Tour 3D (Matterport / Wizio)"}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-xs text-muted-foreground">
            {type === "videos"
              ? "Pega el enlace de YouTube o Vimeo. Se normaliza automáticamente."
              : "Pega la URL de embed de tu plataforma 3D (cualquier proveedor con iframe)."}
          </p>

          {/* Embed URL input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Film className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={type === "videos"
                  ? "https://www.youtube.com/watch?v=... o youtu.be/..."
                  : "URL de embed o enlace público (cualquier proveedor)"}
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddEmbed()}
                className="pl-8"
              />
            </div>
            <Input
              placeholder="Título"
              value={embedTitle}
              onChange={(e) => setEmbedTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddEmbed()}
              className="w-32"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddEmbed} disabled={!embedUrl.trim()}>
              <Plus className="h-4 w-4 mr-1" />Añadir
            </Button>
          </div>

          {/* Embed list */}
          {embedItems.length > 0 ? (
            renderEmbedList(embedItems)
          ) : (
            <div className="rounded-xl border border-dashed border-muted-foreground/20 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {type === "videos"
                  ? "Sin embeds de vídeo. Añade un enlace de YouTube o Vimeo arriba."
                  : "Sin tours 3D. Añade una URL de embed arriba."}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ══ Tour 360° (embed-only mode) ══ */}
      {isTour360Type && (
        <section className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="URL de embed (Matterport, Wizio, etc.)" value={tourUrl}
              onChange={(e) => setTourUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTour()}
              className="flex-1" />
            <Input placeholder="Thumbnail (opcional)" value={tourThumb}
              onChange={(e) => setTourThumb(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTour()}
              className="sm:w-44" />
            <Button type="button" variant="outline" size="sm" onClick={handleAddTour} disabled={!tourUrl.trim()}>
              <Plus className="h-4 w-4 mr-1" />Añadir
            </Button>
          </div>

          {items.length > 0 ? (
            renderEmbedList(items.map((item) => {
              const t = item as Tour360Item
              return { src: "", alt: embedLabel(t.url), url: t.url } as MediaEmbedItem
            }))
          ) : (
            <div className="rounded-xl border border-dashed border-muted-foreground/20 py-8 text-center">
              <p className="text-sm text-muted-foreground">Sin tours. Añade un URL de embed arriba.</p>
            </div>
          )}
        </section>
      )}

      {/* ══ Generic photo grid (photos / construction — no embeds needed) ══ */}
      {!showEmbeds && !isTour360Type && showUpload && null /* handled in Section A above */}
    </div>
  )
}
