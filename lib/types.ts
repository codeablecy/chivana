export interface PropertyType {
  name: string
  area: string
  rooms: number
  baths: number
  garden: string
  description: string
  image: string
}

export interface Phase {
  name: string
  subtitle: string
  status: "vendida" | "disponible"
  label: string
  date?: string
}

export interface PricingItem {
  type: string
  area: string
  price: string
  details: string
  available: number
  sold: number
  /** Images for Las Viviendas section. First image is hero/thumbnail. */
  images?: { src: string; alt: string }[]
  /** Optional spec fields for Las Viviendas cards (Superficie, Dormitorios, etc.) */
  rooms?: number
  baths?: number
  garden?: string
  /** Optional longer description for Las Viviendas. Falls back to details if empty. */
  description?: string
  /** Public URL to the floor-plan PDF. Only shown on the project page when present. */
  planPdf?: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  readTime: string
  published: boolean
}

export interface Amenity {
  name: string
  distance: string
  type: "education" | "health" | "transport" | "shopping" | "leisure"
}

export interface Project {
  slug: string
  name: string
  tagline: string
  description: string
  heroImage: string
  /**
   * YouTube (or Vimeo) embed URL used as the project hero background video.
   * When set, the project hero renders a full-bleed autoplay iframe instead of
   * the static heroImage — exactly like the homepage hero.
   */
  heroVideoUrl?: string
  tags: string[]
  location: {
    address: string
    city: string
    province: string
    postalCode: string
    lat: number
    lng: number
    distances: string[]
    amenities: Amenity[]
  }
  features: {
    title: string
    description: string
    icon: string
  }[]
  phases: Phase[]
  propertyTypes: PropertyType[]
  pricing: PricingItem[]
  gallery: {
    photos: { src: string; alt: string }[]
    construction: { src: string; alt: string }[]
    /**
     * Video items. Media files have `src` set; embed items (YouTube/Vimeo)
     * have `src=""` and `url` set to the iframe src.
     */
    videos?: { src: string; alt: string; url?: string }[]
    /** 360° tour embed URLs (Matterport, Wizio, etc.) */
    tour360?: { url: string; thumb?: string }[]
    /**
     * Parcel/plot items. Image files have `src` set; embed items (3D tours)
     * have `src=""` and `url` set to the iframe src.
     */
    parcela?: { src: string; alt: string; url?: string }[]
  }
  qualities: {
    title: string
    description: string
    icon: string
  }[]
  status: "active" | "coming-soon" | "sold-out"
  totalUnits: number
  availableUnits: number
  customFields: Record<string, string>
  /** Construction start date (e.g. "Enero 2024") */
  constructionStartDate?: string
  /** Construction end date (e.g. "Julio 2026") */
  constructionEndDate?: string
  /** Google Maps embed iframe URL */
  mapEmbedUrl?: string
}

export interface SiteSettings {
  companyName: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  officeLat: number
  officeLng: number
  metaTitle: string
  metaDescription: string
  officeHours: string
  socialInstagram: string
  socialFacebook: string
  socialLinkedIn: string
}
