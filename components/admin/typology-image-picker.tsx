"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChevronUp,
  ChevronDown,
  ImagePlus,
  Trash2,
  Upload,
  Loader2,
  GripVertical,
  Pencil,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface TypologyImage {
  src: string
  alt: string
}

const QUICK_IMAGES = [
  "/images/living-room.jpg",
  "/images/kitchen.jpg",
  "/images/bedroom.jpg",
  "/images/bathroom.jpg",
  "/images/exterior.jpg",
  "/images/hero.jpg",
]

const HIDDEN_QUICK_SAMPLES_KEY = "typology-picker-hidden-quick-samples"

function loadHiddenQuickSamples(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(HIDDEN_QUICK_SAMPLES_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

/**
 * Compact image manager for typology (Las Viviendas).
 * Full CRUD: upload, add URL, reorder, rename alt, delete.
 * First image = hero/principal.
 */
export function TypologyImagePicker({
  images = [],
  onChange,
  typologyName,
  projectSlug = "",
  className,
}: {
  images: TypologyImage[]
  onChange: (images: TypologyImage[]) => void
  typologyName?: string
  projectSlug?: string
  className?: string
}) {
  const [open,        setOpen]        = React.useState(false)
  const [newUrl,      setNewUrl]      = React.useState("")
  const [newAlt,      setNewAlt]      = React.useState("")
  const [uploading,   setUploading]   = React.useState(false)
  const [dropActive,  setDropActive]  = React.useState(false)
  const [editingIdx,  setEditingIdx]  = React.useState<number | null>(null)
  const [editAltVal,  setEditAltVal]  = React.useState("")
  const [hiddenQuickSamples, setHiddenQuickSamples] = React.useState<Set<string>>(new Set())
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Hydrate hidden quick samples from localStorage (client-only)
  React.useEffect(() => {
    setHiddenQuickSamples(loadHiddenQuickSamples())
  }, [])

  const removeQuickSample = React.useCallback((src: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setHiddenQuickSamples((prev) => {
      const next = new Set(prev)
      next.add(src)
      try {
        localStorage.setItem(HIDDEN_QUICK_SAMPLES_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
    toast.success("Muestra eliminada del panel")
  }, [])

  const restoreQuickSamples = React.useCallback(() => {
    setHiddenQuickSamples(new Set())
    try {
      localStorage.removeItem(HIDDEN_QUICK_SAMPLES_KEY)
    } catch {
      /* ignore */
    }
    toast.success("Muestras restauradas")
  }, [])

  const visibleQuickImages = QUICK_IMAGES.filter((src) => !hiddenQuickSamples.has(src))

  // ── Upload ──────────────────────────────────────────────────────────────────

  const uploadFiles = React.useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
      if (!list.length) { toast.error("Sólo se admiten imágenes"); return }
      if (!projectSlug) { toast.error("Guarda el proyecto antes de subir imágenes"); return }
      setUploading(true)
      const uploaded: TypologyImage[] = []
      for (const file of list) {
        try {
          const form = new FormData()
          form.append("file", file)
          form.append("context", "project")
          form.append("slug", projectSlug)
          form.append("category", "photos")
          const res = await fetch("/api/upload", { method: "POST", body: form })
          if (!res.ok) throw new Error(((await res.json()) as { error?: string }).error ?? "Error al subir")
          const { url } = await res.json() as { url: string }
          uploaded.push({ src: url, alt: typologyName ?? file.name.replace(/\.[^.]+$/, "") })
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error al subir imagen")
        }
      }
      if (uploaded.length) {
        onChange([...images, ...uploaded])
        toast.success(`${uploaded.length} imagen${uploaded.length > 1 ? "es" : ""} añadida${uploaded.length > 1 ? "s" : ""}`)
      }
      setUploading(false)
    },
    [images, onChange, projectSlug, typologyName],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDropActive(false)
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }

  // ── CRUD ────────────────────────────────────────────────────────────────────

  const addFromUrl = () => {
    const src = newUrl.trim()
    if (!src) return
    onChange([...images, { src, alt: newAlt.trim() || typologyName || "Imagen" }])
    setNewUrl(""); setNewAlt("")
  }

  const addQuick = (src: string) => {
    if (images.some((i) => i.src === src)) return
    onChange([...images, { src, alt: typologyName || "Imagen" }])
  }

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
    if (editingIdx === idx) setEditingIdx(null)
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
    if (editingIdx === from) setEditingIdx(to)
  }

  const startEditAlt = (idx: number) => {
    setEditingIdx(idx)
    setEditAltVal(images[idx].alt)
  }

  const saveAlt = (idx: number) => {
    const next = images.map((img, i) =>
      i === idx ? { ...img, alt: editAltVal.trim() || img.alt } : img,
    )
    onChange(next)
    setEditingIdx(null)
  }

  const count      = images.length
  const heroImage  = images[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ── Trigger ── */}
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border border-dashed border-border p-2 text-left",
            "transition-colors hover:border-primary hover:bg-muted/30",
            "min-h-[52px] w-full sm:w-auto sm:min-w-[160px]",
            className,
          )}
          aria-label="Gestionar imágenes"
        >
          <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded bg-muted">
            {heroImage?.src ? (
              <Image src={heroImage.src} alt={heroImage.alt} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImagePlus className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-foreground">
              {count > 0 ? `${count} imagen${count !== 1 ? "es" : ""}` : "Añadir imágenes"}
            </span>
            <span className="block text-[10px] text-muted-foreground truncate">
              {typologyName ?? "Las Viviendas"}
            </span>
          </div>
        </button>
      </DialogTrigger>

      {/* ── Dialog ── */}
      <DialogContent className="max-w-xl w-full p-0 gap-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border shrink-0">
          <DialogTitle className="text-base font-semibold">
            Imágenes · {typologyName ?? "Tipología"}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            La primera imagen es la principal. Sube, reordena o elimina.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 min-h-0">

          {/* ── Upload zone ── */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDropActive(true) }}
            onDragLeave={() => setDropActive(false)}
            onDrop={handleDrop}
            className={cn(
              "flex items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 text-sm cursor-pointer transition-all select-none",
              dropActive
                ? "border-accent bg-accent/5 text-accent"
                : "border-muted-foreground/25 text-muted-foreground hover:border-accent/50 hover:bg-muted/20",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <><Loader2 className="h-5 w-5 animate-spin text-accent" /><span className="font-medium">Subiendo…</span></>
            ) : (
              <><Upload className="h-5 w-5" /><div><p className="font-medium">Subir desde dispositivo</p><p className="text-xs opacity-60">JPG · PNG · WebP · múltiples a la vez</p></div></>
            )}
          </div>

          {/* ── Quick-add (samples are deletable / restorable) ── */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Añadir rápidamente
              </p>
              {hiddenQuickSamples.size > 0 && (
                <button
                  type="button"
                  onClick={restoreQuickSamples}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Restaurar muestras ({hiddenQuickSamples.size})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleQuickImages.map((src) => {
                const added = images.some((i) => i.src === src)
                return (
                  <div key={src} className="relative group/thumb">
                    <button
                      type="button"
                      onClick={() => addQuick(src)}
                      disabled={added}
                      className={cn(
                        "relative h-11 w-16 rounded-lg overflow-hidden border-2 transition-all touch-manipulation",
                        added
                          ? "border-primary/40 opacity-40 cursor-not-allowed"
                          : "border-transparent hover:border-primary",
                      )}
                      title={added ? "Ya añadida" : "Añadir a la lista"}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => removeQuickSample(src, e)}
                      className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow hover:bg-destructive"
                      title="Quitar muestra del panel"
                      aria-label="Eliminar muestra"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
            {visibleQuickImages.length === 0 && (
              <p className="text-xs text-muted-foreground py-1">
                No hay muestras visibles.{" "}
                <button type="button" onClick={restoreQuickSamples} className="text-primary font-medium hover:underline">
                  Restaurar todas
                </button>
              </p>
            )}
          </div>

          {/* ── URL add ── */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Añadir por URL
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFromUrl()}
                className="flex-1 h-9 text-sm"
              />
              <Input
                placeholder="Alt text"
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFromUrl()}
                className="w-28 h-9 text-sm hidden sm:block"
              />
              <Button type="button" size="sm" onClick={addFromUrl} disabled={!newUrl.trim()} className="h-9 shrink-0">
                <ImagePlus className="h-3.5 w-3.5 mr-1" />
                Añadir
              </Button>
            </div>
          </div>

          {/* ── Image list (full CRUD) ── */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Imágenes ({count})
            </p>
            {count === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/15 py-8">
                <ImagePlus className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Sin imágenes aún</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-1.5" role="list">
                {images.map((img, idx) => (
                  <li
                    key={`${img.src}-${idx}`}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-xl border bg-card p-2 transition-colors",
                      idx === 0 ? "border-primary/30 bg-primary/3" : "border-border",
                    )}
                  >
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => move(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-muted disabled:opacity-20 touch-manipulation"
                        aria-label="Mover arriba"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <GripVertical className="h-3 w-3 text-muted-foreground/40 mx-auto" />
                      <button
                        type="button"
                        onClick={() => move(idx, idx + 1)}
                        disabled={idx === images.length - 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-20 touch-manipulation"
                        aria-label="Mover abajo"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-primary/85 text-[9px] text-primary-foreground text-center py-0.5 font-medium">
                          Principal
                        </span>
                      )}
                    </div>

                    {/* Alt text (inline edit) */}
                    <div className="flex-1 min-w-0">
                      {editingIdx === idx ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editAltVal}
                            onChange={(e) => setEditAltVal(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveAlt(idx); if (e.key === "Escape") setEditingIdx(null) }}
                            className="h-7 text-xs py-1 px-2"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => saveAlt(idx)}
                            className="p-1 rounded text-primary hover:bg-primary/10"
                            aria-label="Guardar"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingIdx(null)}
                            className="p-1 rounded text-muted-foreground hover:bg-muted"
                            aria-label="Cancelar"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditAlt(idx)}
                          className="flex items-center gap-1 text-left group/alt min-w-0 w-full"
                          title="Editar texto alternativo"
                        >
                          <span className="truncate text-xs text-muted-foreground group-hover/alt:text-foreground transition-colors">
                            {img.alt || "Sin descripción"}
                          </span>
                          <Pencil className="h-3 w-3 text-muted-foreground/0 group-hover/alt:text-muted-foreground transition-colors shrink-0" />
                        </button>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                      aria-label="Eliminar imagen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">
            {count} imagen{count !== 1 ? "es" : ""} · Primera = principal
          </span>
          <Button size="sm" onClick={() => setOpen(false)}>
            Listo
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={handleFileInput}
        />
      </DialogContent>
    </Dialog>
  )
}
