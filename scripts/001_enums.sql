-- ============================================================
-- 001_enums.sql
-- Create all custom ENUM types used across the schema.
-- Run this FIRST before any table creation.
-- ============================================================

-- Project publication status
CREATE TYPE project_status AS ENUM (
  'active',
  'coming-soon',
  'sold-out'
);

-- Sales phase status
CREATE TYPE phase_status AS ENUM (
  'vendida',
  'disponible'
);

-- Amenity category
CREATE TYPE amenity_type AS ENUM (
  'education',
  'health',
  'transport',
  'shopping',
  'leisure'
);

-- Gallery media category
CREATE TYPE gallery_category AS ENUM (
  'photos',
  'construction',
  'videos',
  'tour360',
  'parcela'
);
