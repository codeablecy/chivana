/**
 * Central SEO config — base URL, site name, default images.
 * Use for metadataBase, canonical URLs, Open Graph, and JSON-LD.
 */
// TODO: Replace with your production URL when deploying to Vercel
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chivanadecoy.vercel.app"

export const seo = {
  /** Absolute base URL (no trailing slash). Used for canonical, OG URLs, sitemap. */
  baseUrl: SITE_URL.replace(/\/$/, ""),
  siteName: "Chivana Real Estate",
  defaultTitle: "Chivana Real Estate | El Mirador del Viso de San Juan",
  defaultDescription:
    "Casas exclusivas a solo 35 km de Madrid y 33 km de Toledo. 4 dormitorios, 3 baños, amplias, luminosas y sostenibles.",
  locale: "es_ES",
} as const

/** Build absolute URL for a path (leading slash optional). */
export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${seo.baseUrl}${p}`
}
