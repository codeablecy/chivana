"use client"

import * as React from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ImageUploaderProps {
  /** Current image URL (already stored or local preview) */
  value?: string
  onChange: (url: string) => void
  /** Supabase storage category context */
  context?: "project" | "blog"
  slug?: string
  category?: "photos" | "construction" | "parcela" | "videos" | "hero"
  postId?: string
  className?: string
  label?: string
  accept?: string
}

/**
 * Drag-and-drop / click-to-upload image input.
 * Uploads to /api/upload (server route → Supabase Storage).
 * Returns the CDN public URL via onChange.
 */
export function ImageUploader({
  value,
  onChange,
  context = "project",
  slug = "",
  category = "photos",
  postId = "",
  className,
  label = "Subir imagen",
  accept = "image/jpeg,image/png,image/webp,image/gif",
}: ImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const upload = React.useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const form = new FormData()
        form.append("file", file)
        form.append("context", context)
        if (context === "project") {
          form.append("slug", slug)
          form.append("category", category)
        } else {
          form.append("postId", postId)
        }

        const res = await fetch("/api/upload", { method: "POST", body: form })
        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error ?? "Upload failed")
        }
        const { url } = await res.json()
        onChange(url)
        toast.success("Imagen subida correctamente")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al subir imagen")
      } finally {
        setUploading(false)
      }
    },
    [context, slug, category, postId, onChange],
  )

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Solo se aceptan imágenes o vídeos")
      return
    }
    upload(file)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Preview */}
      {value && (
        <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-border bg-muted">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            sizes="384px"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 rounded-full bg-foreground/70 text-card p-1 hover:bg-foreground transition-colors"
            aria-label="Eliminar imagen"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files[0])
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-sm cursor-pointer transition-colors",
          dragging
            ? "border-accent bg-accent/5 text-accent"
            : "border-muted-foreground/30 text-muted-foreground hover:border-accent/60 hover:text-accent",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Subiendo…</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6" />
            <span>{label}</span>
            <span className="text-xs opacity-70">Arrastra o haz clic · JPG, PNG, WebP (máx 50 MB)</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Or paste URL manually */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">o pegar URL</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <input
        type="url"
        placeholder="https://..."
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}
