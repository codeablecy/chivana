import type { Project } from "@/lib/types"

/** Whether the project gallery should render (any tab would have items). */
export function galleryHasAnyTabContent(gallery: Project["gallery"]): boolean {
  if (gallery.photos.some((p) => p.src?.trim())) return true
  for (const v of gallery.videos ?? []) {
    if (v.url?.trim() || v.src?.trim()) return true
  }
  if ((gallery.tour360 ?? []).some((t) => t.url?.trim())) return true
  for (const p of gallery.parcela ?? []) {
    if (p.url?.trim() || p.src?.trim()) return true
  }
  if (gallery.construction.some((p) => p.src?.trim())) return true
  return false
}
