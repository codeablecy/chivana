import type { MetadataRoute } from "next"
import { getAllProjects, getPublishedPosts } from "@/lib/store"
import { seo } from "@/lib/seo"

/**
 * Dynamic sitemap for crawlers. Includes home, projects, project detail,
 * blog posts, privacy, and citas-visitas. Change frequency and priority
 * follow SEO best practices for real estate sites.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    getAllProjects(),
    getPublishedPosts(),
  ])

  const base = seo.baseUrl

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/citas-visitas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ]

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }))

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => {
    const date = p.date ? new Date(p.date) : new Date()
    const lastModified = Number.isNaN(date.getTime()) ? new Date() : date
    return {
      url: `${base}/blog/${p.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }
  })

  return [...staticPages, ...projectPages, ...blogPages]
}
