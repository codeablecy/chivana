-- ============================================================
-- 002_tables.sql
-- Create all application tables.
-- Requires 001_enums.sql to be applied first.
-- ============================================================

-- ------------------------------------------------------------
-- PROJECTS (core entity)
-- ------------------------------------------------------------
CREATE TABLE projects (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                   text NOT NULL UNIQUE,
  name                   text NOT NULL,
  tagline                text NOT NULL DEFAULT '',
  description            text NOT NULL DEFAULT '',
  hero_image             text NOT NULL DEFAULT '',
  tags                   text[] NOT NULL DEFAULT '{}',
  status                 project_status NOT NULL DEFAULT 'coming-soon',
  total_units            int NOT NULL DEFAULT 0 CHECK (total_units >= 0),
  available_units        int NOT NULL DEFAULT 0 CHECK (available_units >= 0),
  construction_start_date text,
  construction_end_date  text,
  map_embed_url          text,
  custom_fields          jsonb NOT NULL DEFAULT '{}',
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- PROJECT LOCATIONS (1-to-1 with projects)
-- ------------------------------------------------------------
CREATE TABLE project_locations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  address      text NOT NULL DEFAULT '',
  city         text NOT NULL DEFAULT '',
  province     text NOT NULL DEFAULT '',
  postal_code  text NOT NULL DEFAULT '',
  lat          float8 NOT NULL DEFAULT 0,
  lng          float8 NOT NULL DEFAULT 0,
  distances    text[] NOT NULL DEFAULT '{}'
);

-- ------------------------------------------------------------
-- PROJECT AMENITIES (nearby services/POIs)
-- ------------------------------------------------------------
CREATE TABLE project_amenities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        text NOT NULL,
  distance    text NOT NULL DEFAULT '',
  type        amenity_type NOT NULL,
  sort_order  int NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- PROJECT FEATURES (USP / highlight bullets)
-- ------------------------------------------------------------
CREATE TABLE project_features (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon        text NOT NULL DEFAULT '',
  sort_order  int NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- PROJECT PHASES (sales phases)
-- ------------------------------------------------------------
CREATE TABLE project_phases (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        text NOT NULL,
  subtitle    text NOT NULL DEFAULT '',
  status      phase_status NOT NULL DEFAULT 'disponible',
  label       text NOT NULL DEFAULT '',
  date        text,
  sort_order  int NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- PROJECT PROPERTY TYPES (typologies shown in Las Viviendas)
-- ------------------------------------------------------------
CREATE TABLE project_property_types (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        text NOT NULL,
  area        text NOT NULL DEFAULT '',
  rooms       int NOT NULL DEFAULT 0,
  baths       int NOT NULL DEFAULT 0,
  garden      text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image       text NOT NULL DEFAULT '',
  sort_order  int NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- PROJECT PRICING (inventory/pricing table)
-- images stored as JSONB array: [{ "src": "...", "alt": "..." }]
-- ------------------------------------------------------------
CREATE TABLE project_pricing (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type        text NOT NULL,   -- typology name used as identifier
  area        text NOT NULL DEFAULT '',
  price       text NOT NULL DEFAULT 'Consultar',
  details     text NOT NULL DEFAULT '',
  available   int NOT NULL DEFAULT 0 CHECK (available >= 0),
  sold        int NOT NULL DEFAULT 0 CHECK (sold >= 0),
  images      jsonb NOT NULL DEFAULT '[]',
  rooms       int,
  baths       int,
  garden      text,
  description text,
  sort_order  int NOT NULL DEFAULT 0,
  UNIQUE (project_id, type)
);

-- ------------------------------------------------------------
-- PROJECT GALLERY ITEMS
-- Unified table for all 5 media categories.
-- photos/construction/parcela: use src + alt
-- videos:                       use src (thumb) + alt + url (embed)
-- tour360:                      use url (embed) + thumb (optional)
-- ------------------------------------------------------------
CREATE TABLE project_gallery_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category    gallery_category NOT NULL,
  src         text,          -- thumbnail / image path
  alt         text NOT NULL DEFAULT '',
  url         text,          -- embed URL (videos, tour360)
  thumb       text,          -- thumbnail override for tour360
  is_hero     bool NOT NULL DEFAULT false,
  sort_order  int NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- PROJECT QUALITIES (materials / quality specs)
-- ------------------------------------------------------------
CREATE TABLE project_qualities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon        text NOT NULL DEFAULT '',
  sort_order  int NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- BLOG POSTS
-- ------------------------------------------------------------
CREATE TABLE blog_posts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  excerpt    text NOT NULL DEFAULT '',
  content    text NOT NULL DEFAULT '',
  image      text NOT NULL DEFAULT '',
  date       text NOT NULL DEFAULT '',    -- display string, e.g. "17 ago 2025"
  read_time  text NOT NULL DEFAULT '1 Min.',
  published  bool NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- SITE SETTINGS (singleton row, id always = 1)
-- ------------------------------------------------------------
CREATE TABLE site_settings (
  id                int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name      text NOT NULL DEFAULT 'Chivana Real Estate',
  phone             text NOT NULL DEFAULT '',
  email             text NOT NULL DEFAULT '',
  address           text NOT NULL DEFAULT '',
  city              text NOT NULL DEFAULT '',
  province          text NOT NULL DEFAULT '',
  postal_code       text NOT NULL DEFAULT '',
  office_lat        float8 NOT NULL DEFAULT 0,
  office_lng        float8 NOT NULL DEFAULT 0,
  meta_title        text NOT NULL DEFAULT '',
  meta_description  text NOT NULL DEFAULT '',
  office_hours      text NOT NULL DEFAULT '',
  social_instagram  text NOT NULL DEFAULT '',
  social_facebook   text NOT NULL DEFAULT '',
  updated_at        timestamptz NOT NULL DEFAULT now()
);
