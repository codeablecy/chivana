import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { uploadFile, storagePath, blogStoragePath } from "@/lib/supabase/storage"

const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

async function isAdmin(): Promise<boolean> {
  const jar = await cookies()
  return jar.get("admin_session")?.value === "authenticated"
}

/**
 * POST /api/upload
 * Multipart form fields:
 *   file     - the file blob
 *   context  - "project" | "blog"
 *   slug     - project slug (required when context=project)
 *   category - "photos" | "construction" | "parcela" | "videos" | "hero" (project only)
 *   postId   - blog post id (required when context=blog)
 */
export async function POST(req: NextRequest) {
  // Auth guard — only the admin session can upload
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get("file") as File | null
  const context = (form.get("context") as string) ?? "project"
  const slug = (form.get("slug") as string) ?? ""
  const category = (form.get("category") as string) ?? "photos"
  const postId = (form.get("postId") as string) ?? ""

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 413 })
  }

  // Sanitise filename: lowercase, spaces → dashes, keep extension
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin"
  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
  const timestamp = Date.now()
  const filename = `${baseName}-${timestamp}.${ext}`

  let path: string
  if (context === "blog") {
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 })
    path = blogStoragePath(postId, filename)
  } else {
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })
    const cat = category as "photos" | "construction" | "parcela" | "videos" | "hero" | "plans"
    path = storagePath(slug, cat, filename)
  }

  const buffer = await file.arrayBuffer()
  const result = await uploadFile(path, buffer, file.type)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url, path: result.path })
}

/**
 * DELETE /api/upload
 * Body: { path: string }  — storage path to delete
 */
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { path } = (await req.json()) as { path?: string }
  if (!path) return NextResponse.json({ error: "path required" }, { status: 400 })

  const { deleteFile } = await import("@/lib/supabase/storage")
  const ok = await deleteFile(path)
  return NextResponse.json({ success: ok })
}
