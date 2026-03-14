import type { MetadataRoute } from "next"
import { seo } from "@/lib/seo"

/**
 * robots.txt — allow all crawlers, point to sitemap.
 * Block /admin and /auth from indexing for security and relevance.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/auth", "/auth/"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin", "/admin/", "/auth", "/auth/"] },
    ],
    sitemap: `${seo.baseUrl}/sitemap.xml`,
  }
}
