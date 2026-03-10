/**
 * Supabase Storage helpers.
 * All uploads go through server-side API routes (using service role key).
 * Public URLs are CDN-served directly by Supabase.
 */
import { createAdminClient } from "./admin"

const BUCKET = "media"

export function getPublicUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`
}

export type UploadResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string }

/**
 * Upload a file buffer to Supabase Storage (server-side only).
 * @param path   Storage path, e.g. "projects/viso-1/photos/001.webp"
 * @param file   File buffer (ArrayBuffer or Uint8Array)
 * @param mime   MIME type, e.g. "image/webp"
 */
export async function uploadFile(
  path: string,
  file: ArrayBuffer | Uint8Array,
  mime: string,
): Promise<UploadResult> {
  const db = createAdminClient()
  const { error } = await db.storage.from(BUCKET).upload(path, file, {
    contentType: mime,
    upsert: true,
  })

  if (error) return { success: false, error: error.message }
  return { success: true, url: getPublicUrl(path), path }
}

/**
 * Delete a file from storage by its full storage path.
 */
export async function deleteFile(path: string): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.storage.from(BUCKET).remove([path])
  return !error
}

/**
 * List all files under a folder prefix.
 * e.g. listFiles("projects/viso-1/photos")
 */
export async function listFiles(folder: string) {
  const db = createAdminClient()
  const { data, error } = await db.storage.from(BUCKET).list(folder, {
    sortBy: { column: "name", order: "asc" },
  })
  if (error) return []
  return (data ?? []).map((f) => ({
    name: f.name,
    path: `${folder}/${f.name}`,
    url: getPublicUrl(`${folder}/${f.name}`),
    size: f.metadata?.size as number | undefined,
    updatedAt: f.updated_at,
  }))
}

/**
 * Build a deterministic storage path for a project gallery image.
 * e.g. storagePath("viso-1", "photos", "exterior.webp")
 *   → "projects/viso-1/photos/exterior.webp"
 */
export function storagePath(
  projectSlug: string,
  category: "photos" | "construction" | "parcela" | "videos" | "hero" | "plans",
  filename: string,
): string {
  return `projects/${projectSlug}/${category}/${filename}`
}

/**
 * Build a storage path for a blog post image.
 */
export function blogStoragePath(postId: string, filename: string): string {
  return `blog/${postId}/${filename}`
}
