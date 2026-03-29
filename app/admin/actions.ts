"use server"

import { redirect } from "next/navigation"
import { revalidatePath, revalidateTag as _revalidateTag } from "next/cache"

/**
 * Next.js 16 changed the `revalidateTag` signature to require a second
 * `profile` argument. Until the stable API settles, cast to the
 * single-argument shape that works at runtime.
 */
const revalidateTag = _revalidateTag as (tag: string) => void
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  getAllProjects,
  getProject,
  updateProject,
  updatePricingItem,
  addPricingItem,
  removePricingItem,
  updateProjectTags,
  updateProjectStatus,
  updateProjectCustomField,
  removeProjectCustomField,
  updateProjectPhases,
  updateProjectGallery,
  updateProjectHeroImage,
  updateProjectHeroVideo,
  updateProjectAmenities,
  updateProjectDistances,
  updateProjectFeatures,
  updateProjectQualities,
  deleteProject as storeDeleteProject,
  createProject,
  getAllPosts,
  getPublishedPosts,
  createPost,
  updatePost,
  deletePost,
  getSettings,
  updateSettings,
  SITE_SETTINGS_TAG,
} from "@/lib/store"
import type {
  Project,
  BlogPost,
  SiteSettings,
  Phase,
  PricingItem,
  Amenity,
} from "@/lib/types"

/**
 * Simple password-only sign-in used by the admin overlay login form.
 * The email is read from ADMIN_EMAIL env; only the password is exposed to the UI.
 */
export async function login(password: string): Promise<{ success: boolean }> {
  const supabase = await createSupabaseServerClient()
  const email = process.env.ADMIN_EMAIL ?? ""
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success: false }
  revalidatePath("/", "layout")
  return { success: true }
}

export async function logout(): Promise<never> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/auth/sign-in")
}

export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getClaims()
  return !!data?.claims
}

// ---------- Projects ----------
export async function fetchProjects(): Promise<Project[]> {
  return getAllProjects()
}

export async function fetchProject(slug: string): Promise<Project | undefined> {
  return getProject(slug)
}

export async function updatePricing(
  slug: string,
  typeName: string,
  data: Partial<PricingItem>,
): Promise<{ success: boolean }> {
  const ok = await updatePricingItem(slug, typeName, data)
  return { success: ok }
}

export async function addPricingRow(
  slug: string,
  data: PricingItem,
): Promise<{ success: boolean }> {
  const ok = await addPricingItem(slug, data)
  return { success: ok }
}

export async function removePricingRow(
  slug: string,
  typeName: string,
): Promise<{ success: boolean }> {
  const ok = await removePricingItem(slug, typeName)
  return { success: ok }
}

export async function updateTags(
  slug: string,
  tags: string[],
): Promise<{ success: boolean }> {
  const ok = await updateProjectTags(slug, tags)
  return { success: ok }
}

export async function updateStatus(
  slug: string,
  status: Project["status"],
): Promise<{ success: boolean }> {
  const ok = await updateProjectStatus(slug, status)
  return { success: ok }
}

export async function setCustomField(
  slug: string,
  key: string,
  value: string,
): Promise<{ success: boolean }> {
  const ok = await updateProjectCustomField(slug, key, value)
  return { success: ok }
}

export async function deleteCustomField(
  slug: string,
  key: string,
): Promise<{ success: boolean }> {
  const ok = await removeProjectCustomField(slug, key)
  return { success: ok }
}

export async function updatePhases(
  slug: string,
  phases: Phase[],
): Promise<{ success: boolean }> {
  const ok = await updateProjectPhases(slug, phases)
  return { success: ok }
}

export async function updateProjectFull(
  slug: string,
  data: Partial<{
    name: string
    tagline: string
    description: string
    status: Project["status"]
    totalUnits: number
    constructionStartDate: string
    constructionEndDate: string
    mapEmbedUrl: string
    location: Partial<Project["location"]>
    tags: string[]
    heroVirtualTourUrl: string
    showPricingTable: boolean
  }>,
): Promise<{ success: boolean }> {
  const project = await getProject(slug)
  if (!project) return { success: false }

  const merged: Partial<Project> = {
    name:                  data.name                  ?? project.name,
    tagline:               data.tagline               ?? project.tagline,
    description:           data.description           ?? project.description,
    status:                data.status                ?? project.status,
    totalUnits:            data.totalUnits            ?? project.totalUnits,
    constructionStartDate: data.constructionStartDate ?? project.constructionStartDate,
    constructionEndDate:   data.constructionEndDate   ?? project.constructionEndDate,
    mapEmbedUrl:           data.mapEmbedUrl           ?? project.mapEmbedUrl,
    tags:                  data.tags                  ?? project.tags,
    location: data.location
      ? {
          ...project.location,
          ...data.location,
          lat: typeof data.location.lat === "number" ? data.location.lat : project.location.lat,
          lng: typeof data.location.lng === "number" ? data.location.lng : project.location.lng,
        }
      : project.location,
    heroVirtualTourUrl:
      data.heroVirtualTourUrl !== undefined
        ? data.heroVirtualTourUrl
        : project.heroVirtualTourUrl,
    showPricingTable:
      data.showPricingTable !== undefined
        ? data.showPricingTable
        : project.showPricingTable,
  }

  const result = await updateProject(slug, merged)
  if (!result) return { success: false }
  return { success: true }
}

export async function updateGallery(
  slug: string,
  photos: { src: string; alt: string }[],
  construction?: { src: string; alt: string }[],
  videos?: { src: string; alt: string; url?: string }[],
  tour360?: { url: string; thumb?: string }[],
  parcela?: { src: string; alt: string; url?: string }[],
): Promise<{ success: boolean }> {
  const ok = await updateProjectGallery(slug, photos, construction, videos, tour360, parcela)
  return { success: ok }
}

export async function updateHeroImage(
  slug: string,
  heroImage: string,
): Promise<{ success: boolean }> {
  const ok = await updateProjectHeroImage(slug, heroImage)
  return { success: ok }
}

export async function updateHeroVideo(
  slug: string,
  heroVideoUrl: string,
): Promise<{ success: boolean }> {
  const ok = await updateProjectHeroVideo(slug, heroVideoUrl)
  return { success: ok }
}

export async function deleteProject(slug: string): Promise<{ success: boolean }> {
  const ok = await storeDeleteProject(slug)
  if (ok) {
    revalidatePath("/projects")
    revalidatePath("/")
  }
  return { success: ok }
}

export async function saveProjectAmenities(
  slug: string,
  amenities: Amenity[],
): Promise<{ success: boolean }> {
  const ok = await updateProjectAmenities(slug, amenities)
  return { success: ok }
}

export async function saveProjectDistances(
  slug: string,
  distances: string[],
): Promise<{ success: boolean }> {
  const ok = await updateProjectDistances(slug, distances)
  return { success: ok }
}

export async function saveProjectFeatures(
  slug: string,
  features: { title: string; description: string; icon: string }[],
): Promise<{ success: boolean }> {
  const ok = await updateProjectFeatures(slug, features)
  return { success: ok }
}

export async function saveProjectQualities(
  slug: string,
  qualities: { title: string; description: string; icon: string }[],
): Promise<{ success: boolean }> {
  const ok = await updateProjectQualities(slug, qualities)
  return { success: ok }
}

export async function addProject(data: {
  slug: string
  name: string
  tagline: string
  description: string
  heroImage: string
  totalUnits: number
  pricing?: PricingItem[]
  location?: { address?: string; city?: string; province?: string; postalCode?: string; lat?: number; lng?: number }
  galleryPhotos?: { src: string; alt: string }[]
  galleryTour360?: { url: string; thumb?: string }[]
  galleryVideos?: { src: string; alt: string; url?: string }[]
  amenities?: Amenity[]
  distances?: string[]
  features?: { title: string; description: string; icon: string }[]
  qualities?: { title: string; description: string; icon: string }[]
  heroVirtualTourUrl?: string
  showPricingTable?: boolean
}): Promise<{ success: boolean; slug?: string }> {
  const existing = await getProject(data.slug)
  if (existing) return { success: false }

  const pricing = data.pricing ?? []
  const totalUnits =
    data.totalUnits > 0
      ? data.totalUnits
      : pricing.reduce((s, p) => s + p.available + p.sold, 0)
  const availableUnits = pricing.reduce((s, p) => s + p.available, 0)

  const project: Project = {
    slug: data.slug,
    name: data.name,
    tagline: data.tagline,
    description: data.description,
    heroImage: data.heroImage || "/images/exterior.jpg",
    tags: ["Proximamente"],
    location: {
      address:    data.location?.address    ?? "",
      city:       data.location?.city       ?? "",
      province:   data.location?.province   ?? "",
      postalCode: data.location?.postalCode ?? "",
      lat:        data.location?.lat        ?? 40.14199365784348,
      lng:        data.location?.lng        ?? -3.924643621440974,
      distances:  data.distances ?? [],
      amenities:  data.amenities ?? [],
    },
    features: data.features ?? [
      { title: "Luminosas", description: "Amplios ventanales con luz natural.", icon: "Sun" },
      { title: "Calidad Premium", description: "Materiales de primera calidad.", icon: "Shield" },
    ],
    phases: [],
    propertyTypes: [],
    pricing,
    gallery: {
      photos: data.galleryPhotos ?? [],
      construction: [],
      videos: data.galleryVideos ?? [],
      tour360: data.galleryTour360 ?? [],
      parcela: [],
    },
    qualities: data.qualities ?? [],
    status: "coming-soon",
    totalUnits: totalUnits || 1,
    availableUnits,
    customFields: {},
    heroVirtualTourUrl: data.heroVirtualTourUrl?.trim() || undefined,
    showPricingTable: data.showPricingTable ?? false,
  }

  await createProject(project)
  return { success: true, slug: data.slug }
}

// ---------- Blog ----------
export async function fetchPosts(): Promise<BlogPost[]> {
  return getAllPosts()
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  return getPublishedPosts()
}

export async function addPost(data: {
  title: string
  excerpt: string
  content: string
  image: string
}): Promise<{ success: boolean }> {
  await createPost({
    ...data,
    date: new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    readTime: "1 Min.",
    published: true,
  })
  return { success: true }
}

export async function editPost(
  id: string,
  data: Partial<BlogPost>,
): Promise<{ success: boolean }> {
  const result = await updatePost(id, data)
  return { success: !!result }
}

export async function removePost(id: string): Promise<{ success: boolean }> {
  const ok = await deletePost(id)
  return { success: ok }
}

// ---------- Settings ----------
export async function fetchSettings(): Promise<SiteSettings> {
  return getSettings()
}

export async function saveSettings(
  data: Partial<SiteSettings>,
): Promise<{ success: boolean }> {
  await updateSettings(data)
  revalidateTag(SITE_SETTINGS_TAG)
  revalidatePath("/", "layout")
  return { success: true }
}
