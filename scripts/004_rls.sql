-- ============================================================
-- 004_rls.sql
-- Row Level Security policies.
--
-- Strategy:
--   • anon role   → can SELECT all public data (projects, blog, settings)
--   • service_role → bypasses RLS entirely (used by server-side admin actions)
--   • No public INSERT/UPDATE/DELETE — all writes go through Next.js server
--     actions using the SUPABASE_SERVICE_ROLE_KEY.
-- ============================================================

-- Enable RLS on every table
ALTER TABLE projects                ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_locations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_amenities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_features        ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases          ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_property_types  ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_pricing         ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_qualities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings           ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- PUBLIC SELECT policies (anon can read all content)
-- -------------------------------------------------------
CREATE POLICY "public_read_projects"
  ON projects FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_project_locations"
  ON project_locations FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_project_amenities"
  ON project_amenities FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_project_features"
  ON project_features FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_project_phases"
  ON project_phases FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_project_property_types"
  ON project_property_types FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_project_pricing"
  ON project_pricing FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_project_gallery_items"
  ON project_gallery_items FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_project_qualities"
  ON project_qualities FOR SELECT TO anon, authenticated USING (true);

-- Blog: only published posts are visible to anon
CREATE POLICY "public_read_published_blog_posts"
  ON blog_posts FOR SELECT TO anon USING (published = true);

-- Authenticated (service_role) can read all blog posts including drafts
CREATE POLICY "authenticated_read_all_blog_posts"
  ON blog_posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "public_read_site_settings"
  ON site_settings FOR SELECT TO anon, authenticated USING (true);

-- -------------------------------------------------------
-- NOTE: All writes (INSERT / UPDATE / DELETE) are performed
-- exclusively via server-side Next.js Server Actions using
-- SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS entirely.
-- No additional write policies are needed.
-- -------------------------------------------------------
