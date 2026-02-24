import type { Project, BlogPost, SiteSettings, Phase } from "./types"
import {
  projects as initialProjects,
  blogPosts as initialPosts,
  siteSettings as initialSettings,
} from "./data"

// In-memory store that persists during the session.
let projectsStore: Project[] = structuredClone(initialProjects)
let postsStore: BlogPost[] = structuredClone(initialPosts)
let settingsStore: SiteSettings = structuredClone(initialSettings)

// ---------- Site Settings ----------
export function getSettings(): SiteSettings {
  return settingsStore
}

export function updateSettings(data: Partial<SiteSettings>): SiteSettings {
  settingsStore = { ...settingsStore, ...data }
  return settingsStore
}

// ---------- Projects ----------
export function getAllProjects(): Project[] {
  return projectsStore
}

/**
 * Returns projects that are active or coming-soon (excludes sold-out).
 * Used for homepage project highlights.
 */
export function getActiveProjects(): Project[] {
  return projectsStore.filter((p) => p.status !== "sold-out")
}

export function getProject(slug: string): Project | undefined {
  return projectsStore.find((p) => p.slug === slug)
}

export function updateProject(slug: string, data: Partial<Project>): Project | undefined {
  const idx = projectsStore.findIndex((p) => p.slug === slug)
  if (idx === -1) return undefined
  projectsStore[idx] = { ...projectsStore[idx], ...data }
  return projectsStore[idx]
}

export function createProject(project: Project): Project {
  projectsStore.push(project)
  return project
}

type PricingUpdate = Partial<{
  type: string
  area: string
  price: string
  details: string
  available: number
  sold: number
  images: { src: string; alt: string }[]
  rooms: number
  baths: number
  garden: string
  description: string
}>

export function updatePricingItem(
  slug: string,
  typeName: string,
  data: PricingUpdate,
): boolean {
  const project = getProject(slug)
  if (!project) return false
  const item = project.pricing.find((p) => p.type === typeName)
  if (!item) return false
  if (data.type !== undefined) item.type = data.type
  if (data.area !== undefined) item.area = data.area
  if (data.price !== undefined) item.price = data.price
  if (data.details !== undefined) item.details = data.details
  if (data.available !== undefined) item.available = data.available
  if (data.sold !== undefined) item.sold = data.sold
  if (data.images !== undefined) item.images = data.images
  if (data.rooms !== undefined) item.rooms = data.rooms
  if (data.baths !== undefined) item.baths = data.baths
  if (data.garden !== undefined) item.garden = data.garden
  if (data.description !== undefined) item.description = data.description
  project.availableUnits = project.pricing.reduce((sum, p) => sum + p.available, 0)
  return true
}

export function addPricingItem(
  slug: string,
  item: import("./types").PricingItem,
): boolean {
  const project = getProject(slug)
  if (!project) return false
  const exists = project.pricing.some((p) => p.type === item.type)
  if (exists) return false
  project.pricing.push({ ...item })
  project.totalUnits = project.pricing.reduce((s, p) => s + p.available + p.sold, 0)
  project.availableUnits = project.pricing.reduce((sum, p) => sum + p.available, 0)
  return true
}

export function removePricingItem(slug: string, typeName: string): boolean {
  const project = getProject(slug)
  if (!project) return false
  const idx = project.pricing.findIndex((p) => p.type === typeName)
  if (idx === -1) return false
  project.pricing.splice(idx, 1)
  project.totalUnits = project.pricing.reduce((s, p) => s + p.available + p.sold, 0)
  project.availableUnits = project.pricing.reduce((sum, p) => sum + p.available, 0)
  return true
}

export function updateProjectTags(slug: string, tags: string[]): boolean {
  const project = getProject(slug)
  if (!project) return false
  project.tags = tags
  return true
}

export function updateProjectStatus(
  slug: string,
  status: Project["status"],
): boolean {
  const project = getProject(slug)
  if (!project) return false
  project.status = status
  return true
}

export function updateProjectCustomField(
  slug: string,
  key: string,
  value: string,
): boolean {
  const project = getProject(slug)
  if (!project) return false
  project.customFields[key] = value
  return true
}

export function removeProjectCustomField(slug: string, key: string): boolean {
  const project = getProject(slug)
  if (!project) return false
  delete project.customFields[key]
  return true
}

/** Update phases for a project. Replaces the entire phases array. */
export function updateProjectPhases(slug: string, phases: Phase[]): boolean {
  const project = getProject(slug)
  if (!project) return false
  project.phases = [...phases]
  return true
}

/** Update full gallery (photos, construction, videos, tour360, parcela). */
export function updateProjectGallery(
  slug: string,
  photos: { src: string; alt: string }[],
  construction?: { src: string; alt: string }[],
  videos?: { src: string; alt: string; url?: string }[],
  tour360?: { url: string; thumb?: string }[],
  parcela?: { src: string; alt: string }[],
): boolean {
  const project = getProject(slug)
  if (!project) return false
  project.gallery.photos = [...photos]
  if (construction !== undefined) project.gallery.construction = [...construction]
  if (videos !== undefined) project.gallery.videos = [...videos]
  if (tour360 !== undefined) project.gallery.tour360 = [...tour360]
  if (parcela !== undefined) project.gallery.parcela = [...parcela]
  return true
}

/** Set hero image for a project. */
export function updateProjectHeroImage(slug: string, heroImage: string): boolean {
  const project = getProject(slug)
  if (!project) return false
  project.heroImage = heroImage
  return true
}

/** Delete a project by slug. */
export function deleteProject(slug: string): boolean {
  const idx = projectsStore.findIndex((p) => p.slug === slug)
  if (idx === -1) return false
  projectsStore.splice(idx, 1)
  return true
}

// ---------- Blog ----------
export function getAllPosts(): BlogPost[] {
  return postsStore
}

export function getPublishedPosts(): BlogPost[] {
  return postsStore.filter((p) => p.published)
}

export function getPost(id: string): BlogPost | undefined {
  return postsStore.find((p) => p.id === id)
}

export function createPost(post: Omit<BlogPost, "id">): BlogPost {
  const newPost: BlogPost = { ...post, id: String(Date.now()) }
  postsStore.push(newPost)
  return newPost
}

export function updatePost(id: string, data: Partial<BlogPost>): BlogPost | undefined {
  const idx = postsStore.findIndex((p) => p.id === id)
  if (idx === -1) return undefined
  postsStore[idx] = { ...postsStore[idx], ...data }
  return postsStore[idx]
}

export function deletePost(id: string): boolean {
  const idx = postsStore.findIndex((p) => p.id === id)
  if (idx === -1) return false
  postsStore.splice(idx, 1)
  return true
}
