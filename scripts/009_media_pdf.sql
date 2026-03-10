-- Migration 009: Allow application/pdf in the "media" bucket
-- Floor-plan PDFs are stored under projects/{slug}/plans/ and need to be
-- publicly accessible via CDN URL, so they live in "media" (not "documents").

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/ogg',
  'application/pdf'
]
WHERE id = 'media';

-- Verify
SELECT id, allowed_mime_types FROM storage.buckets WHERE id = 'media';
