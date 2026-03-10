/**
 * Supabase-backed data store — server-side only.
 * All reads and writes use the service-role admin client, which bypasses
 * RLS entirely. This is safe because store.ts is never imported by client
 * components; it is only used in Server Components and Server Actions.
 */
import type { Project, BlogPost, SiteSettings, Phase, PricingItem, Amenity } from "./types"
import { createAdminClient } from "./supabase/admin"

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const PROJECT_SELECT = `
  *,
  project_locations(*),
  project_amenities(id, name, distance, type, sort_order),
  project_features(id, title, description, icon, sort_order),
  project_phases(id, name, subtitle, status, label, date, sort_order),
  project_property_types(id, name, area, rooms, baths, garden, description, image, sort_order),
  project_pricing(id, type, area, price, details, available, sold, images, rooms, baths, garden, description, plan_pdf, sort_order),
  project_gallery_items(id, category, src, alt, url, thumb, is_hero, sort_order),
  project_qualities(id, title, description, icon, sort_order)
` as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: Record<string, any>): Project {
  // PostgREST returns one-to-one relationships (UNIQUE FK) as a plain object,
  // and one-to-many as an array. Handle both to be safe.
  const locRaw = row.project_locations
  const loc: Record<string, unknown> = Array.isArray(locRaw)
    ? (locRaw[0] ?? {})
    : (locRaw ?? {})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortBy = (arr: any[]): any[] =>
    [...(arr ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  const gallery = row.project_gallery_items ?? []
  const byCategory = (cat: string) =>
    sortBy(gallery.filter((g: { category: string }) => g.category === cat))

  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    heroImage: row.hero_image,
    heroVideoUrl: row.hero_video_url ?? undefined,
    tags: row.tags ?? [],
    status: row.status as Project["status"],
    totalUnits: row.total_units,
    availableUnits: row.available_units,
    constructionStartDate: row.construction_start_date ?? undefined,
    constructionEndDate: row.construction_end_date ?? undefined,
    mapEmbedUrl: row.map_embed_url ?? undefined,
    customFields: (row.custom_fields ?? {}) as Record<string, string>,
    location: {
      address: loc.address ?? "",
      city: loc.city ?? "",
      province: loc.province ?? "",
      postalCode: loc.postal_code ?? "",
      lat: loc.lat ?? 0,
      lng: loc.lng ?? 0,
      distances: loc.distances ?? [],
      amenities: sortBy(row.project_amenities ?? []).map(
        (a: { name: string; distance: string; type: string }) => ({
          name: a.name,
          distance: a.distance,
          type: a.type as Amenity["type"],
        }),
      ),
    },
    features: sortBy(row.project_features ?? []).map(
      (f: { title: string; description: string; icon: string }) => ({
        title: f.title,
        description: f.description,
        icon: f.icon,
      }),
    ),
    phases: sortBy(row.project_phases ?? []).map(
      (p: { name: string; subtitle: string; status: string; label: string; date: string | null }) => ({
        name: p.name,
        subtitle: p.subtitle,
        status: p.status as Phase["status"],
        label: p.label,
        date: p.date ?? undefined,
      }),
    ),
    propertyTypes: sortBy(row.project_property_types ?? []).map(
      (pt: { name: string; area: string; rooms: number; baths: number; garden: string; description: string; image: string }) => ({
        name: pt.name,
        area: pt.area,
        rooms: pt.rooms,
        baths: pt.baths,
        garden: pt.garden,
        description: pt.description,
        image: pt.image,
      }),
    ),
    pricing: sortBy(row.project_pricing ?? []).map(
      (pr: {
        type: string; area: string; price: string; details: string
        available: number; sold: number; images: unknown
        rooms: number | null; baths: number | null; garden: string | null; description: string | null
        plan_pdf: string | null
      }) => ({
        type: pr.type,
        area: pr.area,
        price: pr.price,
        details: pr.details,
        available: pr.available,
        sold: pr.sold,
        images: (pr.images ?? []) as { src: string; alt: string }[],
        rooms: pr.rooms ?? undefined,
        baths: pr.baths ?? undefined,
        garden: pr.garden ?? undefined,
        description: pr.description ?? undefined,
        planPdf: pr.plan_pdf ?? undefined,
      }),
    ),
    gallery: {
      photos: byCategory("photos").map((g: { src: string | null; alt: string }) => ({
        src: g.src ?? "",
        alt: g.alt,
      })),
      construction: byCategory("construction").map((g: { src: string | null; alt: string }) => ({
        src: g.src ?? "",
        alt: g.alt,
      })),
      videos: byCategory("videos").map((g: { src: string | null; alt: string; url: string | null }) => ({
        src: g.src ?? "",
        alt: g.alt,
        url: g.url ?? undefined,
      })),
      tour360: byCategory("tour360").map((g: { url: string | null; thumb: string | null }) => ({
        url: g.url ?? "",
        thumb: g.thumb ?? undefined,
      })),
      parcela: byCategory("parcela").map((g: { src: string | null; alt: string; url: string | null }) => ({
        src: g.src ?? "",
        alt: g.alt,
        url: g.url ?? undefined,
      })),
    },
    qualities: sortBy(row.project_qualities ?? []).map(
      (q: { title: string; description: string; icon: string }) => ({
        title: q.title,
        description: q.description,
        icon: q.icon,
      }),
    ),
  }
}

// ---------------------------------------------------------------------------
// Site Settings
// ---------------------------------------------------------------------------

export async function getSettings(): Promise<SiteSettings> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single()

  if (error || !data) {
    console.error("[store] getSettings error:", error)
    return {
      companyName: "Chivana Real Estate",
      phone: "", email: "", address: "", city: "", province: "",
      postalCode: "", officeLat: 0, officeLng: 0,
      metaTitle: "", metaDescription: "", officeHours: "",
      socialInstagram: "", socialFacebook: "",
    }
  }

  return {
    companyName: data.company_name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    city: data.city,
    province: data.province,
    postalCode: data.postal_code,
    officeLat: data.office_lat,
    officeLng: data.office_lng,
    metaTitle: data.meta_title,
    metaDescription: data.meta_description,
    officeHours: data.office_hours,
    socialInstagram: data.social_instagram,
    socialFacebook: data.social_facebook,
  }
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = createAdminClient()
  const payload: Record<string, unknown> = {}
  if (data.companyName !== undefined) payload.company_name = data.companyName
  if (data.phone !== undefined) payload.phone = data.phone
  if (data.email !== undefined) payload.email = data.email
  if (data.address !== undefined) payload.address = data.address
  if (data.city !== undefined) payload.city = data.city
  if (data.province !== undefined) payload.province = data.province
  if (data.postalCode !== undefined) payload.postal_code = data.postalCode
  if (data.officeLat !== undefined) payload.office_lat = data.officeLat
  if (data.officeLng !== undefined) payload.office_lng = data.officeLng
  if (data.metaTitle !== undefined) payload.meta_title = data.metaTitle
  if (data.metaDescription !== undefined) payload.meta_description = data.metaDescription
  if (data.officeHours !== undefined) payload.office_hours = data.officeHours
  if (data.socialInstagram !== undefined) payload.social_instagram = data.socialInstagram
  if (data.socialFacebook !== undefined) payload.social_facebook = data.socialFacebook

  await db.from("site_settings").upsert({ id: 1, ...payload })
  return getSettings()
}

// ---------------------------------------------------------------------------
// Projects — reads
// ---------------------------------------------------------------------------

export async function getAllProjects(): Promise<Project[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("projects")
    .select(PROJECT_SELECT)
    .order("created_at", { ascending: true })

  if (error) { console.error("[store] getAllProjects error:", error); return [] }
  return (data ?? []).map(mapRow)
}

export async function getActiveProjects(): Promise<Project[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("projects")
    .select(PROJECT_SELECT)
    .neq("status", "sold-out")
    .order("created_at", { ascending: true })

  if (error) { console.error("[store] getActiveProjects error:", error); return [] }
  return (data ?? []).map(mapRow)
}

/** Lightweight query for footer / nav — only fetches slug, name, status, tags. */
export async function getFooterProjects(): Promise<
  Pick<Project, "slug" | "name" | "status" | "tags">[]
> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("projects")
    .select("slug, name, status, tags")
    .neq("status", "sold-out")
    .order("created_at", { ascending: true })

  if (error) { console.error("[store] getFooterProjects error:", error); return [] }
  return (data ?? []).map((r) => ({
    slug:   r.slug   ?? "",
    name:   r.name   ?? "",
    status: (r.status ?? "coming-soon") as Project["status"],
    tags:   (r.tags  ?? []) as string[],
  }))
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .single()

  if (error || !data) return undefined
  return mapRow(data)
}

// ---------------------------------------------------------------------------
// Projects — writes (admin / service-role)
// ---------------------------------------------------------------------------

export async function updateProject(
  slug: string,
  data: Partial<Project>,
): Promise<Project | undefined> {
  const db = createAdminClient()

  // Get project id first
  const { data: existing } = await db
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .single()
  if (!existing) return undefined

  const projectPayload: Record<string, unknown> = {}
  if (data.name        !== undefined) projectPayload.name         = data.name
  if (data.tagline     !== undefined) projectPayload.tagline      = data.tagline
  if (data.description !== undefined) projectPayload.description  = data.description
  if (data.heroImage   !== undefined) projectPayload.hero_image   = data.heroImage
  if (data.tags        !== undefined) projectPayload.tags         = data.tags
  if (data.status      !== undefined) projectPayload.status       = data.status
  if (data.totalUnits  !== undefined) projectPayload.total_units  = data.totalUnits
  if (data.constructionStartDate !== undefined) projectPayload.construction_start_date = data.constructionStartDate
  if (data.constructionEndDate   !== undefined) projectPayload.construction_end_date   = data.constructionEndDate
  if (data.mapEmbedUrl           !== undefined) projectPayload.map_embed_url           = data.mapEmbedUrl
  if (data.customFields          !== undefined) projectPayload.custom_fields           = data.customFields

  if (Object.keys(projectPayload).length > 0) {
    const { error: projErr } = await db.from("projects").update(projectPayload).eq("slug", slug)
    if (projErr) console.error("[store] updateProject projects error:", projErr.message)
  }

  if (data.location) {
    const loc = data.location
    const locationPayload = {
      project_id:  existing.id,
      address:     loc.address     ?? "",
      city:        loc.city        ?? "",
      province:    loc.province    ?? "",
      postal_code: loc.postalCode  ?? "",
      lat:         loc.lat         ?? 0,
      lng:         loc.lng         ?? 0,
      distances:   loc.distances   ?? [],
    }

    const { data: existingLoc, error: checkErr } = await db
      .from("project_locations")
      .select("id")
      .eq("project_id", existing.id)
      .maybeSingle()

    if (checkErr) {
      console.error("[store] updateProject location CHECK error:", checkErr.message)
      // Fallback: delete all rows then insert fresh
      await db.from("project_locations").delete().eq("project_id", existing.id)
      const { error: insErr } = await db
        .from("project_locations")
        .insert(locationPayload)
      if (insErr) console.error("[store] updateProject location INSERT (fallback) error:", insErr.message)
    } else if (existingLoc) {
      const { address, city, province, postal_code, lat, lng, distances } = locationPayload
      const { error: locErr } = await db
        .from("project_locations")
        .update({ address, city, province, postal_code, lat, lng, distances })
        .eq("id", existingLoc.id)
      if (locErr) console.error("[store] updateProject location UPDATE error:", locErr.message)
    } else {
      const { error: locErr } = await db
        .from("project_locations")
        .insert(locationPayload)
      if (locErr) console.error("[store] updateProject location INSERT error:", locErr.message)
    }
  }

  return getProject(slug)
}

export async function createProject(project: Project): Promise<Project> {
  const db = createAdminClient()

  const { data: inserted } = await db
    .from("projects")
    .insert({
      slug: project.slug,
      name: project.name,
      tagline: project.tagline,
      description: project.description,
      hero_image: project.heroImage,
      tags: project.tags,
      status: project.status,
      total_units: project.totalUnits,
      available_units: project.availableUnits,
      construction_start_date: project.constructionStartDate ?? null,
      construction_end_date: project.constructionEndDate ?? null,
      map_embed_url: project.mapEmbedUrl ?? null,
      custom_fields: project.customFields,
    })
    .select("id")
    .single()

  if (!inserted) throw new Error("Failed to insert project")
  const projectId = inserted.id

  // Location
  const { error: locErr } = await db.from("project_locations").insert({
    project_id: projectId,
    address: project.location.address,
    city: project.location.city,
    province: project.location.province,
    postal_code: project.location.postalCode,
    lat: project.location.lat,
    lng: project.location.lng,
    distances: project.location.distances,
  })
  if (locErr) console.error("[store] createProject location error:", locErr.message)

  // Features
  if (project.features.length > 0) {
    await db.from("project_features").insert(
      project.features.map((f, i) => ({
        project_id: projectId, ...f, sort_order: i,
      })),
    )
  }

  // Pricing
  if (project.pricing.length > 0) {
    await db.from("project_pricing").insert(
      project.pricing.map((p, i) => ({
        project_id: projectId,
        type: p.type, area: p.area, price: p.price, details: p.details,
        available: p.available, sold: p.sold,
        images: p.images ?? [],
        rooms: p.rooms ?? null, baths: p.baths ?? null,
        garden: p.garden ?? null, description: p.description ?? null,
        sort_order: i,
      })),
    )
  }

  // Qualities
  if (project.qualities.length > 0) {
    const { error: qErr } = await db.from("project_qualities").insert(
      project.qualities.map((q, i) => ({
        project_id: projectId, title: q.title, description: q.description, icon: q.icon, sort_order: i,
      })),
    )
    if (qErr) console.error("[store] createProject qualities error:", qErr.message)
  }

  // Amenities
  const amenities = project.location.amenities ?? []
  if (amenities.length > 0) {
    const { error: aErr } = await db.from("project_amenities").insert(
      amenities.map((a, i) => ({
        project_id: projectId, name: a.name, distance: a.distance, type: a.type, sort_order: i,
      })),
    )
    if (aErr) console.error("[store] createProject amenities error:", aErr.message)
  }

  // Gallery
  const galleryRows: unknown[] = []
  const addGallery = (items: unknown[], category: string) =>
    (items as Record<string, unknown>[]).forEach((item, i) =>
      galleryRows.push({ project_id: projectId, category, sort_order: i, ...item })
    )
  addGallery(project.gallery.photos, "photos")
  addGallery(project.gallery.construction, "construction")
  addGallery(project.gallery.videos ?? [], "videos")
  ;(project.gallery.tour360 ?? []).forEach((t, i) =>
    galleryRows.push({ project_id: projectId, category: "tour360", url: t.url, thumb: t.thumb ?? null, alt: "", sort_order: i })
  )
  addGallery(project.gallery.parcela ?? [], "parcela")
  if (galleryRows.length > 0) await db.from("project_gallery_items").insert(galleryRows)

  return (await getProject(project.slug))!
}

export async function deleteProject(slug: string): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.from("projects").delete().eq("slug", slug)
  return !error
}

// ---------------------------------------------------------------------------
// Pricing — writes
// ---------------------------------------------------------------------------

export async function updatePricingItem(
  slug: string,
  typeName: string,
  data: Partial<PricingItem>,
): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false

  const payload: Record<string, unknown> = {}
  if (data.type !== undefined) payload.type = data.type
  if (data.area !== undefined) payload.area = data.area
  if (data.price !== undefined) payload.price = data.price
  if (data.details !== undefined) payload.details = data.details
  if (data.available !== undefined) payload.available = data.available
  if (data.sold !== undefined) payload.sold = data.sold
  if (data.images !== undefined) payload.images = data.images
  if (data.rooms !== undefined) payload.rooms = data.rooms
  if (data.baths !== undefined) payload.baths = data.baths
  if (data.garden !== undefined) payload.garden = data.garden
  if (data.description !== undefined) payload.description = data.description
  if (data.planPdf !== undefined) payload.plan_pdf = data.planPdf ?? null

  const { error } = await db
    .from("project_pricing")
    .update(payload)
    .eq("project_id", proj.id)
    .eq("type", typeName)

  return !error
}

export async function addPricingItem(slug: string, item: PricingItem): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false

  const { data: existingCount } = await db
    .from("project_pricing")
    .select("id", { count: "exact", head: true })
    .eq("project_id", proj.id)

  const { error } = await db.from("project_pricing").insert({
    project_id: proj.id,
    type: item.type, area: item.area, price: item.price, details: item.details,
    available: item.available, sold: item.sold,
    images: item.images ?? [],
    rooms: item.rooms ?? null, baths: item.baths ?? null,
    garden: item.garden ?? null, description: item.description ?? null,
    plan_pdf: item.planPdf ?? null,
    sort_order: (existingCount as unknown as number) ?? 0,
  })

  return !error
}

export async function removePricingItem(slug: string, typeName: string): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false

  const { error } = await db
    .from("project_pricing")
    .delete()
    .eq("project_id", proj.id)
    .eq("type", typeName)

  return !error
}

// ---------------------------------------------------------------------------
// Project field updates
// ---------------------------------------------------------------------------

export async function updateProjectTags(slug: string, tags: string[]): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.from("projects").update({ tags }).eq("slug", slug)
  return !error
}

export async function updateProjectStatus(
  slug: string,
  status: Project["status"],
): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.from("projects").update({ status }).eq("slug", slug)
  return !error
}

export async function updateProjectCustomField(
  slug: string,
  key: string,
  value: string,
): Promise<boolean> {
  const db = createAdminClient()
  // Use Postgres jsonb concatenation: custom_fields || '{"key":"value"}'
  // Fetch-modify-write for JSONB custom_fields
  const { data: proj } = await db.from("projects").select("custom_fields").eq("slug", slug).single()
  if (!proj) return false
  const updated = { ...((proj.custom_fields as Record<string, string>) ?? {}), [key]: value }
  const { error } = await db.from("projects").update({ custom_fields: updated }).eq("slug", slug)
  return !error
}

export async function removeProjectCustomField(slug: string, key: string): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("custom_fields").eq("slug", slug).single()
  if (!proj) return false
  const updated = { ...((proj.custom_fields as Record<string, string>) ?? {}) }
  delete updated[key]
  const { error } = await db.from("projects").update({ custom_fields: updated }).eq("slug", slug)
  return !error
}

export async function updateProjectPhases(slug: string, phases: Phase[]): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false

  await db.from("project_phases").delete().eq("project_id", proj.id)

  if (phases.length > 0) {
    const { error } = await db.from("project_phases").insert(
      phases.map((p, i) => ({
        project_id: proj.id,
        name: p.name, subtitle: p.subtitle, status: p.status,
        label: p.label, date: p.date ?? null, sort_order: i,
      })),
    )
    return !error
  }
  return true
}

export async function updateProjectGallery(
  slug: string,
  photos: { src: string; alt: string }[],
  construction?: { src: string; alt: string }[],
  videos?: { src: string; alt: string; url?: string }[],
  tour360?: { url: string; thumb?: string }[],
  parcela?: { src: string; alt: string; url?: string }[],
): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false

  const categories: string[] = ["photos"]
  if (construction !== undefined) categories.push("construction")
  if (videos !== undefined) categories.push("videos")
  if (tour360 !== undefined) categories.push("tour360")
  if (parcela !== undefined) categories.push("parcela")

  // Delete affected categories
  await db
    .from("project_gallery_items")
    .delete()
    .eq("project_id", proj.id)
    .in("category", categories)

  const rows: Record<string, unknown>[] = [
    ...photos.map((p, i) => ({ project_id: proj.id, category: "photos", src: p.src, alt: p.alt, sort_order: i })),
    ...(construction ?? []).map((p, i) => ({ project_id: proj.id, category: "construction", src: p.src, alt: p.alt, sort_order: i })),
    ...(videos ?? []).map((p, i) => ({ project_id: proj.id, category: "videos", src: p.src, alt: p.alt, url: p.url ?? null, sort_order: i })),
    ...(tour360 ?? []).map((p, i) => ({ project_id: proj.id, category: "tour360", url: p.url, thumb: p.thumb ?? null, alt: "", sort_order: i })),
    ...(parcela ?? []).map((p, i) => ({ project_id: proj.id, category: "parcela", src: p.src || null, alt: p.alt, url: p.url ?? null, sort_order: i })),
  ]

  if (rows.length === 0) return true
  const { error } = await db.from("project_gallery_items").insert(rows)
  return !error
}

// ---------------------------------------------------------------------------
// Amenities, Features, Qualities, Distances — replace-all writes
// ---------------------------------------------------------------------------

export async function updateProjectAmenities(
  slug: string,
  amenities: import("./types").Amenity[],
): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false
  await db.from("project_amenities").delete().eq("project_id", proj.id)
  if (amenities.length === 0) return true
  const { error } = await db.from("project_amenities").insert(
    amenities.map((a, i) => ({
      project_id: proj.id,
      name: a.name,
      distance: a.distance,
      type: a.type,
      sort_order: i,
    })),
  )
  return !error
}

export async function updateProjectDistances(
  slug: string,
  distances: string[],
): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false
  const { error } = await db
    .from("project_locations")
    .update({ distances })
    .eq("project_id", proj.id)
  return !error
}

export async function updateProjectFeatures(
  slug: string,
  features: { title: string; description: string; icon: string }[],
): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false
  await db.from("project_features").delete().eq("project_id", proj.id)
  if (features.length === 0) return true
  const { error } = await db.from("project_features").insert(
    features.map((f, i) => ({
      project_id: proj.id,
      title: f.title,
      description: f.description,
      icon: f.icon,
      sort_order: i,
    })),
  )
  return !error
}

export async function updateProjectQualities(
  slug: string,
  qualities: { title: string; description: string; icon: string }[],
): Promise<boolean> {
  const db = createAdminClient()
  const { data: proj } = await db.from("projects").select("id").eq("slug", slug).single()
  if (!proj) return false
  await db.from("project_qualities").delete().eq("project_id", proj.id)
  if (qualities.length === 0) return true
  const { error } = await db.from("project_qualities").insert(
    qualities.map((q, i) => ({
      project_id: proj.id,
      title: q.title,
      description: q.description,
      icon: q.icon,
      sort_order: i,
    })),
  )
  return !error
}

export async function updateProjectHeroImage(slug: string, heroImage: string): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.from("projects").update({ hero_image: heroImage }).eq("slug", slug)
  return !error
}

/**
 * Set or clear the hero video URL for a project.
 * Pass an empty string to clear (renders static heroImage instead).
 */
export async function updateProjectHeroVideo(slug: string, heroVideoUrl: string): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db
    .from("projects")
    .update({ hero_video_url: heroVideoUrl || null })
    .eq("slug", slug)
  if (error) console.error("[store] updateProjectHeroVideo error:", error)
  return !error
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export async function getAllPosts(): Promise<BlogPost[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) { console.error("[store] getAllPosts error:", error); return [] }
  return (data ?? []).map(mapPost)
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) { console.error("[store] getPublishedPosts error:", error); return [] }
  return (data ?? []).map(mapPost)
}

export async function getPost(id: string): Promise<BlogPost | undefined> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return undefined
  return mapPost(data)
}

export async function createPost(post: Omit<BlogPost, "id">): Promise<BlogPost> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("blog_posts")
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      date: post.date,
      read_time: post.readTime,
      published: post.published,
    })
    .select("*")
    .single()

  if (error || !data) throw new Error("Failed to create post")
  return mapPost(data)
}

export async function updatePost(
  id: string,
  data: Partial<BlogPost>,
): Promise<BlogPost | undefined> {
  const db = createAdminClient()
  const payload: Record<string, unknown> = {}
  if (data.title !== undefined) payload.title = data.title
  if (data.excerpt !== undefined) payload.excerpt = data.excerpt
  if (data.content !== undefined) payload.content = data.content
  if (data.image !== undefined) payload.image = data.image
  if (data.date !== undefined) payload.date = data.date
  if (data.readTime !== undefined) payload.read_time = data.readTime
  if (data.published !== undefined) payload.published = data.published

  const { data: updated, error } = await db
    .from("blog_posts")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single()

  if (error || !updated) return undefined
  return mapPost(updated)
}

export async function deletePost(id: string): Promise<boolean> {
  const db = createAdminClient()
  const { error } = await db.from("blog_posts").delete().eq("id", id)
  return !error
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(row: Record<string, any>): BlogPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    date: row.date,
    readTime: row.read_time,
    published: row.published,
  }
}
