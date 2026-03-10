-- Migration 008: Add plan_pdf column to project_pricing
-- Stores the public URL of the typology's floor-plan PDF.
-- Optional — NULL when no PDF has been uploaded.

ALTER TABLE project_pricing
  ADD COLUMN IF NOT EXISTS plan_pdf TEXT DEFAULT NULL;

COMMENT ON COLUMN project_pricing.plan_pdf IS
  'Public Supabase Storage URL for the typology floor-plan PDF. NULL = no plan attached.';

-- Verify
SELECT column_name, data_type, is_nullable
FROM   information_schema.columns
WHERE  table_name = 'project_pricing'
  AND  column_name = 'plan_pdf';
