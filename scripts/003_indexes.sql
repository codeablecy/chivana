-- ============================================================
-- 003_indexes.sql
-- Performance indexes for common query patterns.
-- ============================================================

-- projects: slug lookup (most common public route)
CREATE INDEX idx_projects_slug        ON projects(slug);
CREATE INDEX idx_projects_status      ON projects(status);
CREATE INDEX idx_projects_updated_at  ON projects(updated_at DESC);

-- project sub-tables: FK + sort_order (used in ORDER BY)
CREATE INDEX idx_project_locations_project_id    ON project_locations(project_id);
CREATE INDEX idx_project_amenities_project_id    ON project_amenities(project_id, sort_order);
CREATE INDEX idx_project_features_project_id     ON project_features(project_id, sort_order);
CREATE INDEX idx_project_phases_project_id       ON project_phases(project_id, sort_order);
CREATE INDEX idx_project_property_types_project  ON project_property_types(project_id, sort_order);
CREATE INDEX idx_project_pricing_project_id      ON project_pricing(project_id, sort_order);
CREATE INDEX idx_project_gallery_project_cat     ON project_gallery_items(project_id, category, sort_order);
CREATE INDEX idx_project_gallery_hero            ON project_gallery_items(project_id, is_hero) WHERE is_hero = true;
CREATE INDEX idx_project_qualities_project_id    ON project_qualities(project_id, sort_order);

-- blog_posts: published listing + admin listing
CREATE INDEX idx_blog_posts_published    ON blog_posts(published, created_at DESC);
CREATE INDEX idx_blog_posts_created_at   ON blog_posts(created_at DESC);
