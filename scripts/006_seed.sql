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
-- Project: madrid-justicia
-- -------------------------------------------------------
WITH proj AS (
  INSERT INTO projects (
    slug, name, tagline, description, hero_image,
    tags, status, total_units, available_units
  ) VALUES (
    'madrid-justicia',
    'Residencial Justicia Prime',
    'Viviendas exclusivas en el corazon de Madrid',
    'Promocion boutique de viviendas de alta gama en el barrio de Justicia, una de las zonas mas demandadas de Madrid. Diseno contemporaneo, eficiencia energetica y todo el encanto de vivir en el centro de la ciudad.',
    '/images/madrid-justicia-hero.jpg',
    ARRAY['Madrid Centro', 'Premium'],
    'active',
    12,
    4
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),

loc AS (
  INSERT INTO project_locations (project_id, address, city, province, postal_code, lat, lng, distances)
  SELECT id,
    'Calle Fernando VI, 10', 'Madrid', 'Madrid', '28004',
    40.425152, -3.696917,
    ARRAY[
      '5 min a pie de la estacion de metro Alonso Martinez',
      '12 min a pie de la Plaza de Colon',
      '20 min al Aeropuerto Adolfo Suarez Madrid-Barajas en coche'
    ]
  FROM proj
),

amenities AS (
  INSERT INTO project_amenities (project_id, name, distance, type, sort_order)
  SELECT p.id, a.name, a.distance, a.type::amenity_type, a.ord FROM proj p,
  (VALUES
    ('Metro Alonso Martinez',    '350 m',  'transport', 0),
    ('Mercado de San Anton',     '600 m',  'shopping',  1),
    ('Colegio Publico Isabel la Catolica', '900 m', 'education', 2),
    ('Centro de Salud Justicia', '700 m',  'health',    3),
    ('Parque del Retiro (entrada Alcala)', '1.4 km', 'leisure', 4)
  ) AS a(name, distance, type, ord)
),

feats AS (
  INSERT INTO project_features (project_id, title, description, icon, sort_order)
  SELECT p.id, f.title, f.description, f.icon, f.ord FROM proj p,
  (VALUES
    ('Ubicacion Inmejorable', 'En pleno centro de Madrid, rodeado de oferta cultural, gastronomica y comercial.', 'MapPin', 0),
    ('Eficiencia Energetica', 'Viviendas con aislamiento termico y acustico de ultima generacion.', 'Leaf', 1),
    ('Diseno Contemporaneo', 'Interiores firmados por estudio de arquitectura de prestigio.', 'Sparkles', 2)
  ) AS f(title, description, icon, ord)
),

phases AS (
  INSERT INTO project_phases (project_id, name, subtitle, status, label, date, sort_order)
  SELECT p.id,
         'Unica Fase',
         'Viviendas 1 - 12',
         'disponible'::phase_status,
         'Entrega prevista Q4 2026',
         'Diciembre 2026',
         0
  FROM proj p
),

ptypes AS (
  INSERT INTO project_property_types (project_id, name, area, rooms, baths, garden, description, image, sort_order)
  SELECT p.id, pt.name, pt.area, pt.rooms, pt.baths, pt.garden, pt.description, pt.image, pt.ord FROM proj p,
  (VALUES
    ('Piso 2 Dormitorios', '95.00 m²', 2, 2, 'Sin jardin', 'Viviendas luminosas con salon-comedor abierto, cocina integrada y dormitorios en suite.', '/images/madrid-justicia-living.jpg', 0),
    ('Piso 3 Dormitorios', '125.00 m²', 3, 3, 'Sin jardin', 'Distribucion funcional con amplio salon y dormitorio principal con vestidor.', '/images/madrid-justicia-bedroom.jpg', 1),
    ('Atico con Terraza',  '140.00 m²', 3, 3, 'Terraza 25 m²', 'Aticos con grandes terrazas privadas y vistas privilegiadas sobre el barrio de Justicia.', '/images/madrid-justicia-terrace.jpg', 2)
  ) AS pt(name, area, rooms, baths, garden, description, image, ord)
),

pricing AS (
  INSERT INTO project_pricing (project_id, type, area, price, details, available, sold, sort_order)
  SELECT p.id, pr.type, pr.area, pr.price, pr.details, pr.available, pr.sold, pr.ord FROM proj p,
  (VALUES
    ('Piso 2 Dormitorios', '95.00 m²', '695.000€',  '2 hab. + 2 banos', 2, 4, 0),
    ('Piso 3 Dormitorios', '125.00 m²', '895.000€', '3 hab. + 3 banos', 1, 3, 1),
    ('Atico con Terraza',  '140.00 m²', '1.150.000€', '3 hab. + 3 banos + terraza 25 m²', 1, 1, 2)
  ) AS pr(type, area, price, details, available, sold, ord)
),

gallery AS (
  INSERT INTO project_gallery_items (project_id, category, src, alt, is_hero, sort_order)
  SELECT p.id, 'photos'::gallery_category, g.src, g.alt, g.is_hero, g.ord FROM proj p,
  (VALUES
    ('/images/madrid-justicia-hero.jpg',    'Fachada principal de Justicia Prime', true,  0),
    ('/images/madrid-justicia-living.jpg',  'Salon-comedor con grandes ventanales', false, 1),
    ('/images/madrid-justicia-bedroom.jpg', 'Dormitorio principal con vestidor',    false, 2),
    ('/images/madrid-justicia-terrace.jpg', 'Terraza privada con vistas a Madrid',  false, 3)
  ) AS g(src, alt, is_hero, ord)
),

qualities AS (
  INSERT INTO project_qualities (project_id, title, description, icon, sort_order)
  SELECT p.id, q.title, q.description, q.icon, q.ord FROM proj p,
  (VALUES
    ('Acabados Premium', 'Materiales nobles, carpinteria de alta gama y diseno cuidado en cada detalle.', 'ShieldCheck', 0),
    ('Confort Acustico', 'Maximo aislamiento frente al ruido exterior gracias a cerramientos de ultima generacion.', 'VolumeX', 1),
    ('Zonas Comunes', 'Portal representativo, zona de bicicletas y acceso domotico.', 'Building2', 2)
  ) AS q(title, description, icon, ord)
)

SELECT 1; -- terminate CTE chain

-- -------------------------------------------------------
-- Project: madrid-chamberi
-- -------------------------------------------------------
WITH proj AS (
  INSERT INTO projects (
    slug, name, tagline, description, hero_image,
    tags, status, total_units, available_units
  ) VALUES (
    'madrid-chamberi',
    'Lofts Chamberi Norte',
    'Lofts diseno industrial en Chamberi',
    'Promocion de lofts de diseno industrial en un edificio rehabilitado en Chamberi. Techos altos, grandes ventanales y espacios diafanos para vivir y trabajar en un mismo lugar.',
    '/images/madrid-chamberi-hero.jpg',
    ARRAY['Lofts', 'Madrid Centro'],
    'active',
    20,
    7
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),

loc AS (
  INSERT INTO project_locations (project_id, address, city, province, postal_code, lat, lng, distances)
  SELECT id,
    'Calle Raimundo Fernandez Villaverde, 45', 'Madrid', 'Madrid', '28003',
    40.446220, -3.703890,
    ARRAY[
      '4 min a pie de Nuevos Ministerios',
      '8 min a pie de la Castellana',
      '15 min al Aeropuerto Adolfo Suarez Madrid-Barajas en coche'
    ]
  FROM proj
),

amenities AS (
  INSERT INTO project_amenities (project_id, name, distance, type, sort_order)
  SELECT p.id, a.name, a.distance, a.type::amenity_type, a.ord FROM proj p,
  (VALUES
    ('Estacion Nuevos Ministerios', '300 m', 'transport', 0),
    ('Centro Comercial Moda Shopping', '500 m', 'shopping', 1),
    ('Gimnasio Boutique', '200 m', 'leisure', 2),
    ('Hospital Universitario La Paz', '2.5 km', 'health', 3)
  ) AS a(name, distance, type, ord)
),

feats AS (
  INSERT INTO project_features (project_id, title, description, icon, sort_order)
  SELECT p.id, f.title, f.description, f.icon, f.ord FROM proj p,
  (VALUES
    ('Lofts Diafanos', 'Espacios abiertos con doble altura y grandes ventanales.', 'Columns2', 0),
    ('Espiritu Creativo', 'Ideal para profesionales creativos que buscan un espacio flexible.', 'Palette', 1),
    ('Terraza Comunitaria', 'Azotea comunitaria con vistas al skyline de Madrid.', 'Sun', 2)
  ) AS f(title, description, icon, ord)
),

phases AS (
  INSERT INTO project_phases (project_id, name, subtitle, status, label, date, sort_order)
  SELECT p.id,
         'Unica Fase',
         'Lofts 1 - 20',
         'disponible'::phase_status,
         'Entrega inmediata',
         'Listo para entrar a vivir',
         0
  FROM proj p
),

ptypes AS (
  INSERT INTO project_property_types (project_id, name, area, rooms, baths, garden, description, image, sort_order)
  SELECT p.id, pt.name, pt.area, pt.rooms, pt.baths, pt.garden, pt.description, pt.image, pt.ord FROM proj p,
  (VALUES
    ('Loft Estudio', '65.00 m²', 1, 1, 'Sin jardin', 'Lofts tipo estudio con cocina integrada y zona de trabajo.', '/images/madrid-chamberi-loft.jpg', 0),
    ('Loft Duplex',  '85.00 m²', 1, 1, 'Sin jardin', 'Lofts con altillo para dormitorio y zona de estar inferior.', '/images/madrid-chamberi-duplex.jpg', 1)
  ) AS pt(name, area, rooms, baths, garden, description, image, ord)
),

pricing AS (
  INSERT INTO project_pricing (project_id, type, area, price, details, available, sold, sort_order)
  SELECT p.id, pr.type, pr.area, pr.price, pr.details, pr.available, pr.sold, pr.ord FROM proj p,
  (VALUES
    ('Loft Estudio', '65.00 m²', '435.000€', 'Espacio diafano 1 bano', 4, 6, 0),
    ('Loft Duplex',  '85.00 m²', '525.000€', 'Espacio duplex 1 bano', 3, 7, 1)
  ) AS pr(type, area, price, details, available, sold, ord)
),

gallery AS (
  INSERT INTO project_gallery_items (project_id, category, src, alt, is_hero, sort_order)
  SELECT p.id, 'photos'::gallery_category, g.src, g.alt, g.is_hero, g.ord FROM proj p,
  (VALUES
    ('/images/madrid-chamberi-hero.jpg',   'Fachada rehabilitada en Chamberi', true,  0),
    ('/images/madrid-chamberi-loft.jpg',   'Interior loft tipo estudio',       false, 1),
    ('/images/madrid-chamberi-duplex.jpg', 'Interior loft duplex',             false, 2)
  ) AS g(src, alt, is_hero, ord)
),

qualities AS (
  INSERT INTO project_qualities (project_id, title, description, icon, sort_order)
  SELECT p.id, q.title, q.description, q.icon, q.ord FROM proj p,
  (VALUES
    ('Rehabilitacion Integral', 'Edificio rehabilitado con estructura reforzada y nuevas instalaciones.', 'Hammer', 0),
    ('Iluminacion Natural', 'Ventanas de gran formato para maximizar la entrada de luz.', 'SunMedium', 1),
    ('Conectividad', 'Conexion directa con Cercanias, Metro y buses interurbanos.', 'TrainFront', 2)
  ) AS q(title, description, icon, ord)
)

SELECT 1; -- terminate CTE chain

-- -------------------------------------------------------
-- Project: madrid-salamanca
-- -------------------------------------------------------
WITH proj AS (
  INSERT INTO projects (
    slug, name, tagline, description, hero_image,
    tags, status, total_units, available_units
  ) VALUES (
    'madrid-salamanca',
    'Salamanca Signature Homes',
    'Viviendas de lujo en el barrio de Salamanca',
    'Coleccion limitada de viviendas de lujo en el prestigioso barrio de Salamanca, con balcones a la calle y patios interiores ajardinados.',
    '/images/madrid-salamanca-hero.jpg',
    ARRAY['Lujo', 'Madrid Centro'],
    'active',
    10,
    2
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),

loc AS (
  INSERT INTO project_locations (project_id, address, city, province, postal_code, lat, lng, distances)
  SELECT id,
    'Calle Serrano, 120', 'Madrid', 'Madrid', '28006',
    40.439892, -3.683606,
    ARRAY[
      '3 min a pie de la estacion de metro Republica Argentina',
      '10 min a pie del Estadio Santiago Bernabeu',
      '18 min al Aeropuerto Adolfo Suarez Madrid-Barajas en coche'
    ]
  FROM proj
),

amenities AS (
  INSERT INTO project_amenities (project_id, name, distance, type, sort_order)
  SELECT p.id, a.name, a.distance, a.type::amenity_type, a.ord FROM proj p,
  (VALUES
    ('Metro Republica Argentina', '250 m', 'transport', 0),
    ('Zona Comercial Serrano',    '0 m',   'shopping',  1),
    ('Colegio Nuestra Senora del Pilar', '900 m', 'education', 2),
    ('Clinica Ruber Internacional', '1.5 km', 'health', 3)
  ) AS a(name, distance, type, ord)
),

feats AS (
  INSERT INTO project_features (project_id, title, description, icon, sort_order)
  SELECT p.id, f.title, f.description, f.icon, f.ord FROM proj p,
  (VALUES
    ('Portal Representativo', 'Entrada con doble altura y servicio de conserjeria.', 'DoorOpen', 0),
    ('Garaje Robotizado', 'Plazas de aparcamiento con plataforma mecanizada.', 'Car', 1),
    ('Wellness Privado', 'Zona de spa y gimnasio para residentes.', 'Dumbbell', 2)
  ) AS f(title, description, icon, ord)
),

phases AS (
  INSERT INTO project_phases (project_id, name, subtitle, status, label, date, sort_order)
  SELECT p.id,
         'Unica Fase',
         'Viviendas 1 - 10',
         'disponible'::phase_status,
         'Entrega Q2 2027',
         'Junio 2027',
         0
  FROM proj p
),

ptypes AS (
  INSERT INTO project_property_types (project_id, name, area, rooms, baths, garden, description, image, sort_order)
  SELECT p.id, pt.name, pt.area, pt.rooms, pt.baths, pt.garden, pt.description, pt.image, pt.ord FROM proj p,
  (VALUES
    ('Piso 3 Dormitorios', '155.00 m²', 3, 3, 'Balcon', 'Viviendas con salon en esquina y balcon corrido a la calle Serrano.', '/images/madrid-salamanca-living.jpg', 0),
    ('Piso 4 Dormitorios', '190.00 m²', 4, 4, 'Balcon', 'Grandes viviendas familiares con zona de servicio independiente.', '/images/madrid-salamanca-kitchen.jpg', 1),
    ('Atico Doble Altura', '210.00 m²', 3, 3, 'Terraza 30 m²', 'Atico con doble altura y terraza panoramica.', '/images/madrid-salamanca-terrace.jpg', 2)
  ) AS pt(name, area, rooms, baths, garden, description, image, ord)
),

pricing AS (
  INSERT INTO project_pricing (project_id, type, area, price, details, available, sold, sort_order)
  SELECT p.id, pr.type, pr.area, pr.price, pr.details, pr.available, pr.sold, pr.ord FROM proj p,
  (VALUES
    ('Piso 3 Dormitorios', '155.00 m²', '1.450.000€', '3 hab. + 3 banos', 1, 4, 0),
    ('Piso 4 Dormitorios', '190.00 m²', '1.850.000€', '4 hab. + 4 banos', 1, 3, 1),
    ('Atico Doble Altura', '210.00 m²', '2.350.000€', '3 hab. + 3 banos + terraza', 0, 1, 2)
  ) AS pr(type, area, price, details, available, sold, ord)
),

gallery AS (
  INSERT INTO project_gallery_items (project_id, category, src, alt, is_hero, sort_order)
  SELECT p.id, 'photos'::gallery_category, g.src, g.alt, g.is_hero, g.ord FROM proj p,
  (VALUES
    ('/images/madrid-salamanca-hero.jpg',    'Fachada principal en Serrano', true,  0),
    ('/images/madrid-salamanca-living.jpg',  'Salon con balcon a Serrano',   false, 1),
    ('/images/madrid-salamanca-kitchen.jpg', 'Cocina de diseno',             false, 2),
    ('/images/madrid-salamanca-terrace.jpg', 'Terraza de atico',             false, 3)
  ) AS g(src, alt, is_hero, ord)
),

qualities AS (
  INSERT INTO project_qualities (project_id, title, description, icon, sort_order)
  SELECT p.id, q.title, q.description, q.icon, q.ord FROM proj p,
  (VALUES
    ('Seguridad 24/7', 'Control de accesos y videovigilancia permanente.', 'Shield', 0),
    ('Climatizacion Zonal', 'Sistema de climatizacion por zonas con control independiente.', 'Thermometer', 1),
    ('Acabados de Autor', 'Proyecto de interiorismo firmado por estudio reconocido.', 'Pen', 2)
  ) AS q(title, description, icon, ord)
)

SELECT 1; -- terminate CTE chain

-- -------------------------------------------------------
-- Project: madrid-retiro
-- -------------------------------------------------------
WITH proj AS (
  INSERT INTO projects (
    slug, name, tagline, description, hero_image,
    tags, status, total_units, available_units
  ) VALUES (
    'madrid-retiro',
    'Parque del Retiro Residencial',
    'Vivir a un paso del Retiro',
    'Promocion de viviendas familiares junto al Parque del Retiro, con vistas a arbolado y un entorno privilegiado para disfrutar de la naturaleza en el centro de Madrid.',
    '/images/madrid-retiro-hero.jpg',
    ARRAY['Familias', 'Zona Verde'],
    'coming-soon',
    24,
    24
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),

loc AS (
  INSERT INTO project_locations (project_id, address, city, province, postal_code, lat, lng, distances)
  SELECT id,
    'Calle Menendez Pelayo, 80', 'Madrid', 'Madrid', '28007',
    40.409984, -3.674985,
    ARRAY[
      '1 min a pie del Parque del Retiro',
      '7 min a pie de la estacion de metro Sainz de Baranda',
      '10 min al centro en coche'
    ]
  FROM proj
),

amenities AS (
  INSERT INTO project_amenities (project_id, name, distance, type, sort_order)
  SELECT p.id, a.name, a.distance, a.type::amenity_type, a.ord FROM proj p,
  (VALUES
    ('Parque del Retiro', '50 m', 'leisure', 0),
    ('Metro Sainz de Baranda', '600 m', 'transport', 1),
    ('Colegio Publico Ciudad de Roma', '450 m', 'education', 2),
    ('Centro de Salud Paseo Imperial', '1.8 km', 'health', 3)
  ) AS a(name, distance, type, ord)
),

feats AS (
  INSERT INTO project_features (project_id, title, description, icon, sort_order)
  SELECT p.id, f.title, f.description, f.icon, f.ord FROM proj p,
  (VALUES
    ('Vistas al Parque', 'Muchas viviendas con vistas directas al arbolado del Retiro.', 'Trees', 0),
    ('Terrazas Amplias', 'Todas las viviendas cuentan con terraza donde disfrutar del exterior.', 'Sun', 1),
    ('Zona Infantil', 'Area de juegos privada para los mas pequenos.', 'Child', 2)
  ) AS f(title, description, icon, ord)
),

phases AS (
  INSERT INTO project_phases (project_id, name, subtitle, status, label, date, sort_order)
  SELECT p.id,
         'Pre-comercializacion',
         'Viviendas 1 - 24',
         'disponible'::phase_status,
         'Lanzamiento Q3 2026',
         'Septiembre 2026',
         0
  FROM proj p
),

ptypes AS (
  INSERT INTO project_property_types (project_id, name, area, rooms, baths, garden, description, image, sort_order)
  SELECT p.id, pt.name, pt.area, pt.rooms, pt.baths, pt.garden, pt.description, pt.image, pt.ord FROM proj p,
  (VALUES
    ('Piso 2 Dormitorios', '105.00 m²', 2, 2, 'Terraza 10 m²', 'Viviendas funcionales con vistas laterales al Retiro.', '/images/madrid-retiro-living.jpg', 0),
    ('Piso 3 Dormitorios', '130.00 m²', 3, 2, 'Terraza 12 m²', 'Perfectas para familias que buscan proximidad a zonas verdes.', '/images/madrid-retiro-bedroom.jpg', 1)
  ) AS pt(name, area, rooms, baths, garden, description, image, ord)
),

pricing AS (
  INSERT INTO project_pricing (project_id, type, area, price, details, available, sold, sort_order)
  SELECT p.id, pr.type, pr.area, pr.price, pr.details, pr.available, pr.sold, pr.ord FROM proj p,
  (VALUES
    ('Piso 2 Dormitorios', '105.00 m²', '725.000€', '2 hab. + 2 banos + terraza', 14, 0, 0),
    ('Piso 3 Dormitorios', '130.00 m²', '845.000€', '3 hab. + 2 banos + terraza', 10, 0, 1)
  ) AS pr(type, area, price, details, available, sold, ord)
),

gallery AS (
  INSERT INTO project_gallery_items (project_id, category, src, alt, is_hero, sort_order)
  SELECT p.id, 'photos'::gallery_category, g.src, g.alt, g.is_hero, g.ord FROM proj p,
  (VALUES
    ('/images/madrid-retiro-hero.jpg',    'Fachada frente al Retiro', true,  0),
    ('/images/madrid-retiro-living.jpg',  'Salon con vistas al parque', false, 1),
    ('/images/madrid-retiro-bedroom.jpg', 'Dormitorio principal',       false, 2)
  ) AS g(src, alt, is_hero, ord)
),

qualities AS (
  INSERT INTO project_qualities (project_id, title, description, icon, sort_order)
  SELECT p.id, q.title, q.description, q.icon, q.ord FROM proj p,
  (VALUES
    ('Confort Termico', 'Sistemas de climatizacion eficientes adaptados al clima de Madrid.', 'ThermometerSun', 0),
    ('Aislamiento Acustico', 'Diseno orientado a minimizar el ruido del trafico y la ciudad.', 'VolumeX', 1),
    ('Sostenibilidad', 'Proyecto concebido con criterios de eficiencia energetica y respeto al entorno.', 'Leaf', 2)
  ) AS q(title, description, icon, ord)
)

SELECT 1; -- terminate CTE chain

-- -------------------------------------------------------
-- Project: madrid-tetuan
-- -------------------------------------------------------
WITH proj AS (
  INSERT INTO projects (
    slug, name, tagline, description, hero_image,
    tags, status, total_units, available_units
  ) VALUES (
    'madrid-tetuan',
    'Skyline Tetuan',
    'Viviendas con vistas al skyline de Madrid',
    'Promocion de viviendas modernas en el distrito de Tetuan, con vistas despejadas y excelentes comunicaciones con el centro y la periferia.',
    '/images/madrid-tetuan-hero.jpg',
    ARRAY['Vistas', 'Buena Conexion'],
    'active',
    32,
    9
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),

loc AS (
  INSERT INTO project_locations (project_id, address, city, province, postal_code, lat, lng, distances)
  SELECT id,
    'Calle Bravo Murillo, 310', 'Madrid', 'Madrid', '28020',
    40.463892, -3.703421,
    ARRAY[
      '4 min a pie del metro Valdeacederas',
      '10 min a la Plaza de Castilla',
      '20 min al Aeropuerto Adolfo Suarez Madrid-Barajas en coche'
    ]
  FROM proj
),

amenities AS (
  INSERT INTO project_amenities (project_id, name, distance, type, sort_order)
  SELECT p.id, a.name, a.distance, a.type::amenity_type, a.ord FROM proj p,
  (VALUES
    ('Metro Valdeacederas', '300 m', 'transport', 0),
    ('Nodo Plaza de Castilla', '900 m', 'transport', 1),
    ('Supermercado de barrio', '100 m', 'shopping', 2),
    ('Centro Deportivo Municipal', '450 m', 'leisure', 3)
  ) AS a(name, distance, type, ord)
),

feats AS (
  INSERT INTO project_features (project_id, title, description, icon, sort_order)
  SELECT p.id, f.title, f.description, f.icon, f.ord FROM proj p,
  (VALUES
    ('Skyline', 'Vistas abiertas hacia las Cuatro Torres y el norte de Madrid.', 'Building', 0),
    ('Piscina en Cubierta', 'Piscina comunitaria en la azotea.', 'Waves', 1),
    ('Garaje y Trastero', 'Todas las viviendas incluyen plaza de garaje y trastero.', 'Warehouse', 2)
  ) AS f(title, description, icon, ord)
),

phases AS (
  INSERT INTO project_phases (project_id, name, subtitle, status, label, date, sort_order)
  SELECT p.id,
         'Fase Unica',
         'Viviendas 1 - 32',
         'disponible'::phase_status,
         'Entrega Q1 2027',
         'Marzo 2027',
         0
  FROM proj p
),

ptypes AS (
  INSERT INTO project_property_types (project_id, name, area, rooms, baths, garden, description, image, sort_order)
  SELECT p.id, pt.name, pt.area, pt.rooms, pt.baths, pt.garden, pt.description, pt.image, pt.ord FROM proj p,
  (VALUES
    ('Piso 1 Dormitorio', '70.00 m²', 1, 1, 'Balcon', 'Ideal para singles o parejas.', '/images/madrid-tetuan-1bed.jpg', 0),
    ('Piso 2 Dormitorios', '90.00 m²', 2, 2, 'Balcon', 'Distribucion optimizada para familias pequenas.', '/images/madrid-tetuan-2bed.jpg', 1),
    ('Piso 3 Dormitorios', '115.00 m²', 3, 2, 'Balcon', 'Viviendas de esquina con doble orientacion.', '/images/madrid-tetuan-3bed.jpg', 2)
  ) AS pt(name, area, rooms, baths, garden, description, image, ord)
),

pricing AS (
  INSERT INTO project_pricing (project_id, type, area, price, details, available, sold, sort_order)
  SELECT p.id, pr.type, pr.area, pr.price, pr.details, pr.available, pr.sold, pr.ord FROM proj p,
  (VALUES
    ('Piso 1 Dormitorio', '70.00 m²', '395.000€', '1 hab. + 1 bano', 3, 7, 0),
    ('Piso 2 Dormitorios', '90.00 m²', '495.000€', '2 hab. + 2 banos', 4, 10, 1),
    ('Piso 3 Dormitorios', '115.00 m²', '595.000€', '3 hab. + 2 banos', 2, 6, 2)
  ) AS pr(type, area, price, details, available, sold, ord)
),

gallery AS (
  INSERT INTO project_gallery_items (project_id, category, src, alt, is_hero, sort_order)
  SELECT p.id, 'photos'::gallery_category, g.src, g.alt, g.is_hero, g.ord FROM proj p,
  (VALUES
    ('/images/madrid-tetuan-hero.jpg',   'Vistas al skyline desde la piscina', true,  0),
    ('/images/madrid-tetuan-2bed.jpg',   'Salon de vivienda de 2 dormitorios', false, 1),
    ('/images/madrid-tetuan-3bed.jpg',   'Dormitorio principal',               false, 2)
  ) AS g(src, alt, is_hero, ord)
),

qualities AS (
  INSERT INTO project_qualities (project_id, title, description, icon, sort_order)
  SELECT p.id, q.title, q.description, q.icon, q.ord FROM proj p,
  (VALUES
    ('Calefaccion Central', 'Sistema de calefaccion central con contador individual.', 'Flame', 0),
    ('Paneles Solares', 'Apoyo solar para produccion de ACS.', 'SunMedium', 1),
    ('Iluminacion LED', 'Zonas comunes con iluminacion de bajo consumo.', 'Lightbulb', 2)
  ) AS q(title, description, icon, ord)
)

SELECT 1; -- terminate CTE chain

-- -------------------------------------------------------
-- Project: madrid-arganzuela
-- -------------------------------------------------------
WITH proj AS (
  INSERT INTO projects (
    slug, name, tagline, description, hero_image,
    tags, status, total_units, available_units
  ) VALUES (
    'madrid-arganzuela',
    'Madrid Rio Gardens',
    'Viviendas junto a Madrid Rio',
    'Promocion de viviendas cerca de Madrid Rio y Matadero, en un entorno dinamico y familiar con grandes zonas peatonales y oferta cultural.',
    '/images/madrid-arganzuela-hero.jpg',
    ARRAY['Madrid Rio', 'Familias'],
    'coming-soon',
    28,
    28
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),

loc AS (
  INSERT INTO project_locations (project_id, address, city, province, postal_code, lat, lng, distances)
  SELECT id,
    'Paseo de la Chopera, 60', 'Madrid', 'Madrid', '28045',
    40.395572, -3.698989,
    ARRAY[
      '3 min a pie de Madrid Rio',
      '5 min a pie de Matadero Madrid',
      '12 min al centro en transporte publico'
    ]
  FROM proj
),

amenities AS (
  INSERT INTO project_amenities (project_id, name, distance, type, sort_order)
  SELECT p.id, a.name, a.distance, a.type::amenity_type, a.ord FROM proj p,
  (VALUES
    ('Madrid Rio', '200 m', 'leisure', 0),
    ('Matadero Madrid', '350 m', 'leisure', 1),
    ('Metro Legazpi', '650 m', 'transport', 2),
    ('Colegio Tirso de Molina', '500 m', 'education', 3)
  ) AS a(name, distance, type, ord)
),

feats AS (
  INSERT INTO project_features (project_id, title, description, icon, sort_order)
  SELECT p.id, f.title, f.description, f.icon, f.ord FROM proj p,
  (VALUES
    ('Patio Comunitario', 'Gran patio interior ajardinado con zona de estar y juegos.', 'Trees', 0),
    ('Zona Coworking', 'Espacio de trabajo compartido para residentes.', 'Laptop2', 1),
    ('Aparcamiento Bicicletas', 'Zona cubierta para bicicletas y patinetes.', 'Bike', 2)
  ) AS f(title, description, icon, ord)
),

phases AS (
  INSERT INTO project_phases (project_id, name, subtitle, status, label, date, sort_order)
  SELECT p.id,
         'Fase Unica',
         'Viviendas 1 - 28',
         'disponible'::phase_status,
         'Inicio de obras Q4 2026',
         'Noviembre 2026',
         0
  FROM proj p
),

ptypes AS (
  INSERT INTO project_property_types (project_id, name, area, rooms, baths, garden, description, image, sort_order)
  SELECT p.id, pt.name, pt.area, pt.rooms, pt.baths, pt.garden, pt.description, pt.image, pt.ord FROM proj p,
  (VALUES
    ('Piso 2 Dormitorios', '95.00 m²', 2, 2, 'Terraza 8 m²', 'Viviendas funcionales orientadas a patio interior.', '/images/madrid-arganzuela-2bed.jpg', 0),
    ('Piso 3 Dormitorios', '115.00 m²', 3, 2, 'Terraza 10 m²', 'Viviendas familiares con doble orientacion.', '/images/madrid-arganzuela-3bed.jpg', 1)
  ) AS pt(name, area, rooms, baths, garden, description, image, ord)
),

pricing AS (
  INSERT INTO project_pricing (project_id, type, area, price, details, available, sold, sort_order)
  SELECT p.id, pr.type, pr.area, pr.price, pr.details, pr.available, pr.sold, pr.ord FROM proj p,
  (VALUES
    ('Piso 2 Dormitorios', '95.00 m²', '495.000€', '2 hab. + 2 banos + terraza', 18, 0, 0),
    ('Piso 3 Dormitorios', '115.00 m²', '575.000€', '3 hab. + 2 banos + terraza', 10, 0, 1)
  ) AS pr(type, area, price, details, available, sold, ord)
),

gallery AS (
  INSERT INTO project_gallery_items (project_id, category, src, alt, is_hero, sort_order)
  SELECT p.id, 'photos'::gallery_category, g.src, g.alt, g.is_hero, g.ord FROM proj p,
  (VALUES
    ('/images/madrid-arganzuela-hero.jpg',   'Fachada interior a patio ajardinado', true,  0),
    ('/images/madrid-arganzuela-2bed.jpg',   'Salon con salida a terraza',          false, 1),
    ('/images/madrid-arganzuela-3bed.jpg',   'Dormitorio de vivienda de 3 dorms',   false, 2)
  ) AS g(src, alt, is_hero, ord)
),

qualities AS (
  INSERT INTO project_qualities (project_id, title, description, icon, sort_order)
  SELECT p.id, q.title, q.description, q.icon, q.ord FROM proj p,
  (VALUES
    ('Ventilacion Cruzada', 'Diseno que favorece la ventilacion natural.', 'Wind', 0),
    ('Eficiencia Hidrico', 'Griferia y sanitarios pensados para reducir el consumo de agua.', 'Droplets', 1),
    ('Iluminacion Natural', 'Grandes huecos orientados a zonas abiertas.', 'Sun', 2)
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
