-- Add LinkedIn to site_settings (run on existing DBs that were created before 007)
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS social_linkedin text NOT NULL DEFAULT '';
