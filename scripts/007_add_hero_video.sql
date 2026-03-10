-- Migration 007: Add hero_video_url column to projects
-- Run this in the Supabase SQL editor AFTER 006_seed.sql
--
-- Purpose: allows admins to mark a YouTube (or Vimeo) embed as the project
-- hero background video. When set, the project page renders a full-bleed
-- autoplay iframe instead of the static hero_image — identical to the
-- homepage hero behaviour.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS hero_video_url text DEFAULT NULL;

COMMENT ON COLUMN projects.hero_video_url IS
  'YouTube/Vimeo embed URL used as the full-bleed autoplay hero background. '
  'Overrides hero_image when present. Stored as the raw embed URL; the '
  'frontend upgrades it to autoplay=1&mute=1&loop=1 at render time.';
