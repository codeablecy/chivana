-- ============================================================
-- 005_functions.sql
-- Database functions and triggers.
-- ============================================================

-- -------------------------------------------------------
-- updated_at auto-timestamp trigger
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -------------------------------------------------------
-- Recalculate project unit counts after pricing changes
-- Keeps projects.available_units and projects.total_units
-- in sync automatically.
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION recalculate_project_units()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE projects SET
    available_units = (
      SELECT COALESCE(SUM(available), 0)
      FROM project_pricing
      WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
    ),
    total_units = (
      SELECT COALESCE(SUM(available + sold), 0)
      FROM project_pricing
      WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
    )
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_pricing_recalculate_units
  AFTER INSERT OR UPDATE OR DELETE ON project_pricing
  FOR EACH ROW EXECUTE FUNCTION recalculate_project_units();

-- -------------------------------------------------------
-- Enforce single hero image per project per gallery category
-- When a new hero is set, clear the previous one.
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION enforce_single_hero()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_hero = true THEN
    UPDATE project_gallery_items
    SET is_hero = false
    WHERE project_id = NEW.project_id
      AND category = NEW.category
      AND id != NEW.id
      AND is_hero = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_gallery_single_hero
  AFTER INSERT OR UPDATE OF is_hero ON project_gallery_items
  FOR EACH ROW
  WHEN (NEW.is_hero = true)
  EXECUTE FUNCTION enforce_single_hero();

-- -------------------------------------------------------
-- Helper: get full project as JSON (used for server-side
-- fetching in a single round-trip)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION get_project_full(p_slug text)
RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object(
    'id',          p.id,
    'slug',        p.slug,
    'name',        p.name,
    'tagline',     p.tagline,
    'description', p.description,
    'heroImage',   p.hero_image,
    'tags',        p.tags,
    'status',      p.status,
    'totalUnits',       p.total_units,
    'availableUnits',   p.available_units,
    'constructionStartDate', p.construction_start_date,
    'constructionEndDate',   p.construction_end_date,
    'mapEmbedUrl',      p.map_embed_url,
    'customFields',     p.custom_fields,
    'location', (
      SELECT jsonb_build_object(
        'address',    l.address,
        'city',       l.city,
        'province',   l.province,
        'postalCode', l.postal_code,
        'lat',        l.lat,
        'lng',        l.lng,
        'distances',  l.distances,
        'amenities', (
          SELECT jsonb_agg(jsonb_build_object(
            'name',     a.name,
            'distance', a.distance,
            'type',     a.type
          ) ORDER BY a.sort_order)
          FROM project_amenities a WHERE a.project_id = p.id
        )
      )
      FROM project_locations l WHERE l.project_id = p.id
    ),
    'features', (
      SELECT jsonb_agg(jsonb_build_object(
        'title',       f.title,
        'description', f.description,
        'icon',        f.icon
      ) ORDER BY f.sort_order)
      FROM project_features f WHERE f.project_id = p.id
    ),
    'phases', (
      SELECT jsonb_agg(jsonb_build_object(
        'name',      ph.name,
        'subtitle',  ph.subtitle,
        'status',    ph.status,
        'label',     ph.label,
        'date',      ph.date
      ) ORDER BY ph.sort_order)
      FROM project_phases ph WHERE ph.project_id = p.id
    ),
    'propertyTypes', (
      SELECT jsonb_agg(jsonb_build_object(
        'name',        pt.name,
        'area',        pt.area,
        'rooms',       pt.rooms,
        'baths',       pt.baths,
        'garden',      pt.garden,
        'description', pt.description,
        'image',       pt.image
      ) ORDER BY pt.sort_order)
      FROM project_property_types pt WHERE pt.project_id = p.id
    ),
    'pricing', (
      SELECT jsonb_agg(jsonb_build_object(
        'type',        pr.type,
        'area',        pr.area,
        'price',       pr.price,
        'details',     pr.details,
        'available',   pr.available,
        'sold',        pr.sold,
        'images',      pr.images,
        'rooms',       pr.rooms,
        'baths',       pr.baths,
        'garden',      pr.garden,
        'description', pr.description
      ) ORDER BY pr.sort_order)
      FROM project_pricing pr WHERE pr.project_id = p.id
    ),
    'gallery', (
      SELECT jsonb_build_object(
        'photos', (
          SELECT jsonb_agg(jsonb_build_object('src', g.src, 'alt', g.alt) ORDER BY g.sort_order)
          FROM project_gallery_items g WHERE g.project_id = p.id AND g.category = 'photos'
        ),
        'construction', (
          SELECT jsonb_agg(jsonb_build_object('src', g.src, 'alt', g.alt) ORDER BY g.sort_order)
          FROM project_gallery_items g WHERE g.project_id = p.id AND g.category = 'construction'
        ),
        'videos', (
          SELECT jsonb_agg(jsonb_build_object('src', g.src, 'alt', g.alt, 'url', g.url) ORDER BY g.sort_order)
          FROM project_gallery_items g WHERE g.project_id = p.id AND g.category = 'videos'
        ),
        'tour360', (
          SELECT jsonb_agg(jsonb_build_object('url', g.url, 'thumb', g.thumb) ORDER BY g.sort_order)
          FROM project_gallery_items g WHERE g.project_id = p.id AND g.category = 'tour360'
        ),
        'parcela', (
          SELECT jsonb_agg(jsonb_build_object('src', g.src, 'alt', g.alt) ORDER BY g.sort_order)
          FROM project_gallery_items g WHERE g.project_id = p.id AND g.category = 'parcela'
        )
      )
    ),
    'qualities', (
      SELECT jsonb_agg(jsonb_build_object(
        'title',       q.title,
        'description', q.description,
        'icon',        q.icon
      ) ORDER BY q.sort_order)
      FROM project_qualities q WHERE q.project_id = p.id
    )
  )
  FROM projects p
  WHERE p.slug = p_slug;
$$;
