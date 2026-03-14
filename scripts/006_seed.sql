-- ============================================================
-- 006_seed.sql
-- Seed data mirrored from lib/data.ts
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

-- -------------------------------------------------------
-- Site Settings (singleton)
-- -------------------------------------------------------
INSERT INTO site_settings (
  id, company_name, phone, email,
  address, city, province, postal_code,
  office_lat, office_lng,
  meta_title, meta_description, office_hours,
  social_instagram, social_facebook, social_linkedin
) VALUES (
  1,
  'Chivana Real Estate',
  '+34 655 754 978',
  'info@chivana-realestate.com',
  'Urb. Apr 19, 1P',
  'El Viso de San Juan',
  'Toledo',
  '45215',
  40.14199365784348,
  -3.924643621440974,
  'Chivana Real Estate | Viviendas Exclusivas cerca de Madrid',
  'Casas exclusivas a solo 35 km de Madrid y 33 km de Toledo. 4 dormitorios, 3 banos, amplias, luminosas y sostenibles.',
  'Lunes a Viernes: 10:00h - 14:30h y 15:30h - 19:00h | Sabados: 10:00h - 14:00h',
  'https://instagram.com/chivanarealestate',
  'https://facebook.com/chivanarealestate',
  ''
) ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------
-- Blog Posts
-- -------------------------------------------------------
INSERT INTO blog_posts (id, title, excerpt, content, image, date, read_time, published)
VALUES
(
  gen_random_uuid(),
  'Eficiencia energetica y confort en cada detalle',
  'El Mirador del Viso integra soluciones modernas como aerotermia y suelo radiante refrescante, garantizando maximo confort con un consumo energetico reducido.',
  'El Mirador del Viso integra soluciones modernas como aerotermia y suelo radiante refrescante, garantizando maximo confort con un consumo energetico reducido. Nuestras viviendas cuentan con certificacion energetica de alta eficiencia, lo que se traduce en un menor gasto en climatizacion y un mayor confort en todas las estaciones del ano.',
  '/images/exterior.jpg',
  '17 ago 2025',
  '1 Min.',
  true
),
(
  gen_random_uuid(),
  'Diseno y Confort',
  'Casas luminosas y espaciosas, pensadas para tu familia. Cada vivienda cuenta con 4 dormitorios, 3 banos y una buhardilla amplia y versatil.',
  'Casas luminosas y espaciosas, pensadas para tu familia. Cada vivienda cuenta con 4 dormitorios, 3 banos y una buhardilla amplia y versatil. Los espacios han sido disenados para maximizar la entrada de luz natural y ofrecer la mejor funcionalidad en cada rincon del hogar.',
  '/images/living-room.jpg',
  '17 ago 2025',
  '1 Min.',
  true
),
(
  gen_random_uuid(),
  'Naturaleza y Bienestar',
  'Conecta con la naturaleza y vive sin estres. En El Mirador del Viso encontraras aire puro, cielos abiertos y paisajes naturales.',
  'Conecta con la naturaleza y vive sin estres. En El Mirador del Viso encontraras aire puro, cielos abiertos y paisajes naturales. La ubicacion privilegiada de nuestro proyecto te permite disfrutar de un entorno natural excepcional, a pocos minutos de los principales servicios.',
  '/images/location.jpg',
  '17 ago 2025',
  '1 Min.',
  true
);

-- -------------------------------------------------------
-- Project: viso-1
-- -------------------------------------------------------
WITH proj AS (
  INSERT INTO projects (
    slug, name, tagline, description, hero_image,
    tags, status, total_units, available_units,
    construction_start_date, construction_end_date
  ) VALUES (
    'viso-1',
    'El Mirador del Viso de San Juan',
    'Casas exclusivas a solo 35 km de Madrid y 33 km de Toledo',
    'Vivir tranquilo es vivir mejor, a un paso de Madrid y Toledo. En El Mirador del Viso de San Juan, un proyecto de Chivana Real Estate, disenamos viviendas amplias, luminosas y funcionales con materiales de primera calidad. Pensadas para familias que buscan tranquilidad y calidad de vida.',
    '/images/hero.jpg',
    ARRAY['En Construccion', 'Ultimas Unidades'],
    'active',
    44,
    3,
    NULL,
    'Julio 2026'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),

-- Location
loc AS (
  INSERT INTO project_locations (project_id, address, city, province, postal_code, lat, lng, distances)
  SELECT id,
    'Urb. Apr 19, 1P', 'El Viso de San Juan', 'La Sagra, Toledo', '45215',
    40.14199365784348, -3.924643621440974,
    ARRAY['35 km a Madrid centro','33 km a Toledo','Acceso directo a la autovia A-42']
  FROM proj
  RETURNING project_id
),

-- Amenities
amenities AS (
  INSERT INTO project_amenities (project_id, name, distance, type, sort_order)
  SELECT p.id, a.name, a.distance, a.type::amenity_type, a.ord FROM proj p,
  (VALUES
    ('Colegio Publico El Viso', '500 m',  'education',  0),
    ('Centro de Salud',         '800 m',  'health',     1),
    ('Estacion de Cercanias',   '2 km',   'transport',  2),
    ('Supermercado Mercadona',  '1 km',   'shopping',   3),
    ('Parque Municipal',        '300 m',  'leisure',    4),
    ('IES La Sagra',            '1.5 km', 'education',  5),
    ('Farmacia',                '600 m',  'health',     6),
    ('Acceso A-42',             '3 km',   'transport',  7)
  ) AS a(name, distance, type, ord)
),

-- Features
feats AS (
  INSERT INTO project_features (project_id, title, description, icon, sort_order)
  SELECT p.id, f.title, f.description, f.icon, f.ord FROM proj p,
  (VALUES
    ('Luminosas',       'Amplios ventanales que inundan cada estancia de luz natural.',                        'Sun',    0),
    ('Calidad Premium', 'Materiales de primera y acabados de lujo en cada detalle.',                            'Shield', 1),
    ('Sostenibles',     'Aerotermia y suelo radiante refrescante para maximo confort.',                         'Leaf',   2),
    ('Jardin Privado',  'Cada vivienda con jardin propio y opcion de piscina.',                                'Home',   3)
  ) AS f(title, description, icon, ord)
),

-- Phases
phases AS (
  INSERT INTO project_phases (project_id, name, subtitle, status, label, date, sort_order)
  SELECT p.id, ph.name, ph.subtitle, ph.status::phase_status, ph.label, ph.date, ph.ord FROM proj p,
  (VALUES
    ('Fase 1', 'Viviendas 3 - 8',   'vendida',    '100% vendida',          NULL,         0),
    ('Fase 2', 'Viviendas 18 - 29', 'vendida',    '100% vendida',          NULL,         1),
    ('Fase 3', 'Viviendas 9 - 17',  'vendida',    '100% vendida',          NULL,         2),
    ('Fase 4', 'Viviendas 38 - 44', 'vendida',    '100% vendidas',         NULL,         3),
    ('Fase 5', 'Viviendas 30 - 37', 'disponible', 'Ultimas 3 viviendas',   'Julio 2026', 4)
  ) AS ph(name, subtitle, status, label, date, ord)
),

-- Property Types
ptypes AS (
  INSERT INTO project_property_types (project_id, name, area, rooms, baths, garden, description, image, sort_order)
  SELECT p.id, pt.name, pt.area, pt.rooms, pt.baths, pt.garden, pt.description, pt.image, pt.ord FROM proj p,
  (VALUES
    ('Unifamiliar Tipo A',           '183.80 m²', 4, 3, '56 m²',  'Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad.',     '/images/living-room.jpg', 0),
    ('Unifamiliar Tipo A Simetrico', '183.81 m²', 4, 3, '56 m²',  'Diseno luminoso con estancias amplias, buhardilla versatil, cocinas modernas y suelos ceramicos de primeras marcas.', '/images/kitchen.jpg',     1),
    ('Unifamiliar Tipo B',           '181.82 m²', 4, 3, '56 m²',  'Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad.',     '/images/bedroom.jpg',     2),
    ('Unifamiliar Tipo C',           '175.25 m²', 4, 3, '75 m²',  'Distribucion optimizada, buhardilla funcional, cocinas contemporaneas y acabados de lujo.',                          '/images/bathroom.jpg',    3),
    ('Unifamiliar Tipo C Simetrico', '175.25 m²', 4, 3, '75 m²',  'Diseno versatil con amplios espacios, buhardilla funcional y suelos de primeras marcas.',                           '/images/exterior.jpg',    4)
  ) AS pt(name, area, rooms, baths, garden, description, image, ord)
),

-- Pricing
pricing AS (
  INSERT INTO project_pricing (project_id, type, area, price, details, available, sold, images, rooms, baths, garden, description, sort_order)
  SELECT p.id, pr.type, pr.area, pr.price, pr.details, pr.available, pr.sold,
         pr.images::jsonb, pr.rooms, pr.baths, pr.garden, pr.description, pr.ord
  FROM proj p,
  (VALUES
    ('Unifamiliar Tipo A',           '183.80 m²', '268.000€',  '4 hab. + 3 banos - Jardin 56 m²', 1, 12, '[{"src":"/images/living-room.jpg","alt":"Salon principal"}]',         4, 3, '56 m²',  'Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad.',     0),
    ('Unifamiliar Tipo A Simetrico', '183.81 m²', '268.000€',  '4 hab. + 3 banos - Jardin 56 m²', 1, 10, '[{"src":"/images/kitchen.jpg","alt":"Cocina moderna"}]',              4, 3, '56 m²',  'Diseno luminoso con estancias amplias, buhardilla versatil, cocinas modernas y suelos ceramicos de primeras marcas.', 1),
    ('Unifamiliar Tipo B',           '181.82 m²', 'Consultar', '4 hab. + 3 banos - Jardin 56 m²', 0, 10, '[{"src":"/images/bedroom.jpg","alt":"Dormitorio principal"}]',        4, 3, '56 m²',  'Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad.',     2),
    ('Unifamiliar Tipo C',           '175.25 m²', 'Consultar', '4 hab. + 3 banos - Jardin 75 m²', 1,  3, '[{"src":"/images/bathroom.jpg","alt":"Bano completo"}]',             4, 3, '75 m²',  'Distribucion optimizada, buhardilla funcional, cocinas contemporaneas y acabados de lujo.',                          3),
    ('Unifamiliar Tipo C Simetrico', '175.25 m²', 'Consultar', '4 hab. + 3 banos - Jardin 75 m²', 0,  4, '[{"src":"/images/exterior.jpg","alt":"Exterior de la vivienda"}]',   4, 3, '75 m²',  'Diseno versatil con amplios espacios, buhardilla funcional y suelos de primeras marcas.',                           4)
  ) AS pr(type, area, price, details, available, sold, images, rooms, baths, garden, description, ord)
),

-- Gallery
gallery AS (
  INSERT INTO project_gallery_items (project_id, category, src, alt, url, thumb, is_hero, sort_order)
  SELECT p.id, g.category::gallery_category, g.src, g.alt, g.url, g.thumb, g.is_hero, g.ord FROM proj p,
  (VALUES
    ('photos',       '/images/hero.jpg',         'Vista aerea de la urbanizacion', NULL, NULL, true,  0),
    ('photos',       '/images/exterior.jpg',      'Exterior de la vivienda',        NULL, NULL, false, 1),
    ('photos',       '/images/living-room.jpg',   'Salon principal',                NULL, NULL, false, 2),
    ('photos',       '/images/kitchen.jpg',       'Cocina moderna',                 NULL, NULL, false, 3),
    ('photos',       '/images/bedroom.jpg',       'Dormitorio principal',           NULL, NULL, false, 4),
    ('photos',       '/images/bathroom.jpg',      'Bano completo',                  NULL, NULL, false, 5),
    ('construction', '/images/construction.jpg',  'Avance de obras',                NULL, NULL, false, 0),
    ('construction', '/images/hero.jpg',          'Vista general del proyecto',     NULL, NULL, false, 1),
    ('construction', '/images/exterior.jpg',      'Fachada en construccion',        NULL, NULL, false, 2),
    ('tour360',      NULL,                         '',  'https://my.matterport.com/show/?m=exJgkPPjZJc&ss=2&sr=,-.66', NULL, false, 0)
  ) AS g(category, src, alt, url, thumb, is_hero, ord)
),

-- Qualities
qualities AS (
  INSERT INTO project_qualities (project_id, title, description, icon, sort_order)
  SELECT p.id, q.title, q.description, q.icon, q.ord FROM proj p,
  (VALUES
    ('Cubiertas',              'Aislamiento y proteccion termica de alta eficiencia para maxima comodidad.',                            'Layers',     0),
    ('Fachadas',               'Acabado exterior con aislamiento termico avanzado y materiales de primera calidad.',                    'ShieldCheck', 1),
    ('Sanitarios y Griferias', 'Equipamiento de bano de primeras marcas con diseno moderno.',                                           'Droplets',   2),
    ('Instalaciones',          'Sistemas de aerotermia, suelo radiante refrescante y las mejores prestaciones energeticas.',            'Zap',        3)
  ) AS q(title, description, icon, ord)
)

SELECT 1; -- terminate CTE chain

-- -------------------------------------------------------
-- Project: viso-2
-- -------------------------------------------------------
WITH proj AS (
  INSERT INTO projects (
    slug, name, tagline, description, hero_image,
    tags, status, total_units, available_units
  ) VALUES (
    'viso-2',
    'El Mirador del Viso - Fase II',
    'Nuevas viviendas exclusivas con piscina comunitaria en El Viso de San Juan',
    'La segunda fase de nuestro exitoso proyecto en El Viso de San Juan. 30 nuevas viviendas unifamiliares con piscina comunitaria, zonas verdes y los mismos estandares de calidad premium que nos caracterizan. Diseno contemporaneo con certificacion energetica A.',
    '/images/exterior.jpg',
    ARRAY['Proximamente', 'Pre-Venta'],
    'coming-soon',
    30,
    30
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),

loc AS (
  INSERT INTO project_locations (project_id, address, city, province, postal_code, lat, lng, distances)
  SELECT id,
    'Urb. Apr 19, 1P', 'El Viso de San Juan', 'La Sagra, Toledo', '45215',
    40.14199365784348, -3.924643621440974,
    ARRAY['35 km a Madrid centro','33 km a Toledo','Acceso directo a la autovia A-42']
  FROM proj
),

amenities AS (
  INSERT INTO project_amenities (project_id, name, distance, type, sort_order)
  SELECT p.id, a.name, a.distance, a.type::amenity_type, a.ord FROM proj p,
  (VALUES
    ('Colegio Publico El Viso', '600 m',  'education', 0),
    ('Centro de Salud',         '900 m',  'health',    1),
    ('Estacion de Cercanias',   '2.2 km', 'transport', 2),
    ('Supermercado Mercadona',  '1.1 km', 'shopping',  3),
    ('Parque Municipal',        '400 m',  'leisure',   4),
    ('Polideportivo Municipal', '800 m',  'leisure',   5)
  ) AS a(name, distance, type, ord)
),

feats AS (
  INSERT INTO project_features (project_id, title, description, icon, sort_order)
  SELECT p.id, f.title, f.description, f.icon, f.ord FROM proj p,
  (VALUES
    ('Diseno Moderno',      'Arquitectura contemporanea con lineas limpias y funcionales.',                  'Sun',    0),
    ('Alta Eficiencia',     'Certificacion energetica A con las mejores prestaciones.',                      'Shield', 1),
    ('Piscina Comunitaria', 'Zona de piscina y areas verdes comunitarias para toda la familia.',             'Leaf',   2),
    ('Parcelas Generosas',  'Parcelas de hasta 100 m² con amplias zonas ajardinadas.',                      'Home',   3)
  ) AS f(title, description, icon, ord)
),

phases AS (
  INSERT INTO project_phases (project_id, name, subtitle, status, label, date, sort_order)
  SELECT p.id, 'Pre-Venta', 'Viviendas 1 - 30', 'disponible'::phase_status,
         'Apertura de ventas Q1 2027', 'Marzo 2027', 0
  FROM proj p
),

ptypes AS (
  INSERT INTO project_property_types (project_id, name, area, rooms, baths, garden, description, image, sort_order)
  SELECT p.id, pt.name, pt.area, pt.rooms, pt.baths, pt.garden, pt.description, pt.image, pt.ord FROM proj p,
  (VALUES
    ('Unifamiliar Tipo D', '195.50 m²', 4, 3, '80 m²',  'Vivienda de nueva generacion con distribucion abierta, cocina isla, suite principal con vestidor y buhardilla multifuncional.', '/images/living-room.jpg', 0),
    ('Unifamiliar Tipo E', '210.00 m²', 5, 3, '100 m²', 'La vivienda mas amplia de la promocion, con 5 dormitorios, doble salon y parcela de 100 m². Ideal para familias grandes.',       '/images/kitchen.jpg',     1)
  ) AS pt(name, area, rooms, baths, garden, description, image, ord)
),

pricing AS (
  INSERT INTO project_pricing (project_id, type, area, price, details, available, sold, sort_order)
  SELECT p.id, pr.type, pr.area, pr.price, pr.details, pr.available, pr.sold, pr.ord FROM proj p,
  (VALUES
    ('Unifamiliar Tipo D', '195.50 m²', '295.000€', '4 hab. + 3 banos - Jardin 80 m²',  18, 0, 0),
    ('Unifamiliar Tipo E', '210.00 m²', '335.000€', '5 hab. + 3 banos - Jardin 100 m²', 12, 0, 1)
  ) AS pr(type, area, price, details, available, sold, ord)
),

gallery AS (
  INSERT INTO project_gallery_items (project_id, category, src, alt, is_hero, sort_order)
  SELECT p.id, 'photos'::gallery_category, g.src, g.alt, g.is_hero, g.ord FROM proj p,
  (VALUES
    ('/images/exterior.jpg',    'Render del proyecto Viso 2',    true,  0),
    ('/images/living-room.jpg', 'Interior conceptual salon',     false, 1),
    ('/images/kitchen.jpg',     'Cocina concepto',               false, 2),
    ('/images/bedroom.jpg',     'Dormitorio principal',          false, 3)
  ) AS g(src, alt, is_hero, ord)
),

qualities AS (
  INSERT INTO project_qualities (project_id, title, description, icon, sort_order)
  SELECT p.id, q.title, q.description, q.icon, q.ord FROM proj p,
  (VALUES
    ('Fachada Ventilada',   'Sistema de fachada ventilada con acabado ceramico de alta durabilidad.',           'Layers',     0),
    ('Domotica Integrada',  'Control inteligente de iluminacion, climatizacion y seguridad.',                   'Zap',        1),
    ('Carpinteria Premium', 'Ventanas de aluminio RPT con rotura de puente termico y vidrio bajo emisivo.',     'ShieldCheck', 2),
    ('Griferias Roca',      'Equipamiento sanitario Roca de ultima generacion en todos los banos.',             'Droplets',   3)
  ) AS q(title, description, icon, ord)
)

SELECT 1; -- terminate CTE chain
