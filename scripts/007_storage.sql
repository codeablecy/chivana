-- ============================================================
-- 007_storage.sql
-- Create Supabase Storage buckets and RLS policies.
-- Paste into the Supabase SQL Editor.
-- ============================================================

-- ------------------------------------------------------------
-- Create buckets
-- ------------------------------------------------------------

-- Main media bucket: project photos, videos, gallery, blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,               -- publicly readable via CDN URL
  52428800,           -- 50 MB per file max
  ARRAY[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/ogg'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Documents bucket: PDFs (floor plans, brochures) - private
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,              -- requires signed URL to access
  52428800,           -- 50 MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- Storage RLS policies for "media" bucket
-- ------------------------------------------------------------

-- Anyone can read public media (images/videos on the site)
CREATE POLICY "media_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

-- Only service_role (admin server actions) can upload/update/delete
CREATE POLICY "media_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "media_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "media_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- ------------------------------------------------------------
-- Storage RLS policies for "documents" bucket
-- ------------------------------------------------------------

-- Service_role can do everything (bypasses RLS anyway)
-- Authenticated users can read documents (signed URLs)
CREATE POLICY "documents_authenticated_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "documents_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "documents_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');

-- ------------------------------------------------------------
-- NOTE: Recommended folder structure inside "media" bucket:
--
--   media/
--   ├── projects/
--   │   ├── {slug}/
--   │   │   ├── hero.webp
--   │   │   ├── photos/
--   │   │   │   ├── 001.webp
--   │   │   │   └── ...
--   │   │   ├── construction/
--   │   │   ├── parcela/
--   │   │   ├── videos/
--   │   │   └── plans/          ← floor-plan PDFs (application/pdf)
--   └── blog/
--       ├── {post-id}/
--       │   └── cover.webp
--
-- Public URL format:
--   {SUPABASE_URL}/storage/v1/object/public/media/{path}
-- ------------------------------------------------------------
