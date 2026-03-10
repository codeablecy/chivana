-- Migration 010: Add UNIQUE constraint on project_locations.project_id
-- Without this, upsert({ onConflict: "project_id" }) has no conflict target
-- to match and silently falls back to INSERT — meaning city/province/address
-- updates were never written to the database.
--
-- Step 1: remove any duplicate rows (keep the latest by ctid)
DELETE FROM project_locations pl1
WHERE EXISTS (
  SELECT 1
  FROM   project_locations pl2
  WHERE  pl2.project_id = pl1.project_id
    AND  pl2.ctid > pl1.ctid
);

-- Step 2: add the constraint (idempotent via IF NOT EXISTS)
ALTER TABLE project_locations
  ADD CONSTRAINT project_locations_project_id_key UNIQUE (project_id);

-- Verify
SELECT conname, contype
FROM   pg_constraint
WHERE  conrelid = 'project_locations'::regclass
  AND  conname  = 'project_locations_project_id_key';
