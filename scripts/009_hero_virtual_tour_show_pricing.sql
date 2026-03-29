-- Migration 009: Hero virtual tour (SSOT embed) + optional price table visibility
-- Run in Supabase SQL editor after 008_plan_pdf.sql
--
-- hero_virtual_tour_url: Full-width embed below project hero (separate from gallery tour360).
-- show_pricing_table: When false, "Los Precios" table section is hidden on the project page.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS hero_virtual_tour_url text DEFAULT NULL;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS show_pricing_table boolean NOT NULL DEFAULT true;

-- New inserts default to hidden price table; existing rows keep visible pricing until toggled in Admin.
ALTER TABLE projects
  ALTER COLUMN show_pricing_table SET DEFAULT false;

COMMENT ON COLUMN projects.hero_virtual_tour_url IS
  'Provider-agnostic embed URL (Matterport, Wizio, etc.) shown full-width below the hero. '
  'Distinct from gallery tour360 items.';

COMMENT ON COLUMN projects.show_pricing_table IS
  'When true, render the Los Precios table section. Las Viviendas may still use pricing rows for imagery.';
