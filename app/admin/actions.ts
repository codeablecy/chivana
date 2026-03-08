"use server"

import { cookies } from "next/headers"
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
  deleteProject as storeDeleteProject,
  createProject,
  getAllPosts,
  getPublishedPosts,
  createPost,
  updatePost,
  deletePost,
  getSettings,
  updateSettings,
} from "@/lib/store"
import type {
  Project,
  BlogPost,
  SiteSettings,
  Phase,
  PricingItem,
} from "@/lib/types"

const ADMIN_PASSWORD = "chivana2025"
const SESSION_COOKIE = "admin_session"

export async function login(password: string): Promise<{ success: boolean }> {
  if (password === ADMIN_PASSWORD) {
    const jar = await cookies()
    jar.set(SESSION_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4,
      path: "/",
    })
    return { success: true }
  }
  return { success: false }
}

export async function logout(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === "authenticated"
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
  const ok = updatePricingItem(slug, typeName, data)
  return { success: ok }
}

export async function addPricingRow(
  slug: string,
  data: PricingItem,
): Promise<{ success: boolean }> {
  const ok = addPricingItem(slug, data)
  return { success: ok }
}

export async function removePricingRow(
  slug: string,
  typeName: string,
): Promise<{ success: boolean }> {
  const ok = removePricingItem(slug, typeName)
  return { success: ok }
}

export async function updateTags(
  slug: string,
  tags: string[],
): Promise<{ success: boolean }> {
  const ok = updateProjectTags(slug, tags)
  return { success: ok }
}

export async function updateStatus(
  slug: string,
  status: Project["status"],
): Promise<{ success: boolean }> {
  const ok = updateProjectStatus(slug, status)
  return { success: ok }
}

export async function setCustomField(
  slug: string,
  key: string,
  value: string,
): Promise<{ success: boolean }> {
  const ok = updateProjectCustomField(slug, key, value)
  return { success: ok }
}

export async function deleteCustomField(
  slug: string,
  key: string,
): Promise<{ success: boolean }> {
  const ok = removeProjectCustomField(slug, key)
  return { success: ok }
}

export async function updatePhases(
  slug: string,
  phases: Phase[],
): Promise<{ success: boolean }> {
  const ok = updateProjectPhases(slug, phases)
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
  }>,
): Promise<{ success: boolean }> {
  const project = getProject(slug)
  if (!project) return { success: false }
  const merged = {
    ...project,
    ...data,
    location: data.location ? { ...project.location, ...data.location } : project.location,
  }
  updateProject(slug, merged)
  return { success: true }
}

export async function updateGallery(
  slug: string,
  photos: { src: string; alt: string }[],
  construction?: { src: string; alt: string }[],
  videos?: { src: string; alt: string; url?: string }[],
  tour360?: { url: string; thumb?: string }[],
  parcela?: { src: string; alt: string }[],
): Promise<{ success: boolean }> {
  const ok = updateProjectGallery(slug, photos, construction, videos, tour360, parcela)
  return { success: ok }
}

export async function updateHeroImage(
  slug: string,
  heroImage: string,
): Promise<{ success: boolean }> {
  const ok = updateProjectHeroImage(slug, heroImage)
  return { success: ok }
}

export async function deleteProject(slug: string): Promise<{ success: boolean }> {
  const ok = storeDeleteProject(slug)
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
  location?: { address?: string; city?: string; lat?: number; lng?: number }
  galleryPhotos?: { src: string; alt: string }[]
  /** 360° tour embed URLs – Matterport, Wizio, etc. (optional, add more in project editor) */
  galleryTour360?: { url: string; thumb?: string }[]
}): Promise<{ success: boolean; slug?: string }> {
  const existing = getProject(data.slug)
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
      address: data.location?.address ?? "",
      city: data.location?.city ?? "El Viso de San Juan",
      province: "La Sagra, Toledo",
      postalCode: "45215",
      lat: data.location?.lat ?? 40.0716,
      lng: data.location?.lng ?? -3.9397,
      distances: ["35 km a Madrid centro", "33 km a Toledo"],
      amenities: [],
    },
    features: [
      { title: "Luminosas", description: "Amplios ventanales con luz natural.", icon: "Sun" },
      {
        title: "Calidad Premium",
        description: "Materiales de primera calidad.",
        icon: "Shield",
      },
    ],
    phases: [],
    propertyTypes: [],
    pricing,
    gallery: {
      photos: data.galleryPhotos ?? [],
      construction: [],
      videos: [],
      tour360: data.galleryTour360 ?? [],
      parcela: [],
    },
    qualities: [],
    status: "coming-soon",
    totalUnits: totalUnits || 1,
    availableUnits: availableUnits,
    customFields: {},
  }

  createProject(project)
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
  createPost({
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
  const result = updatePost(id, data)
  return { success: !!result }
}

export async function removePost(id: string): Promise<{ success: boolean }> {
  const ok = deletePost(id)
  return { success: ok }
}

// ---------- Settings ----------
export async function fetchSettings(): Promise<SiteSettings> {
  return getSettings()
}

export async function saveSettings(
  data: Partial<SiteSettings>,
): Promise<{ success: boolean }> {
  updateSettings(data)
  return { success: true }
}
