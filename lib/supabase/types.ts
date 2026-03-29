/**
 * Supabase database type definitions.
 * Mirrors the schema created in scripts/002_tables.sql.
 *
 * Run `pnpm supabase gen types typescript` after migrations to auto-generate
 * this file from the live schema. Until then these manual types suffice.
 */

export type ProjectStatus = "active" | "coming-soon" | "sold-out"
export type PhaseStatus = "vendida" | "disponible"
export type AmenityType = "education" | "health" | "transport" | "shopping" | "leisure"
export type GalleryCategory = "photos" | "construction" | "videos" | "tour360" | "parcela"

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          slug: string
          name: string
          tagline: string
          description: string
          hero_image: string
          tags: string[]
          status: ProjectStatus
          total_units: number
          available_units: number
          construction_start_date: string | null
          construction_end_date: string | null
          map_embed_url: string | null
          custom_fields: Record<string, string>
          hero_video_url?: string | null
          hero_virtual_tour_url?: string | null
          show_pricing_table?: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>
      }

      project_locations: {
        Row: {
          id: string
          project_id: string
          address: string
          city: string
          province: string
          postal_code: string
          lat: number
          lng: number
          distances: string[]
        }
        Insert: Omit<Database["public"]["Tables"]["project_locations"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["project_locations"]["Insert"]>
      }

      project_amenities: {
        Row: {
          id: string
          project_id: string
          name: string
          distance: string
          type: AmenityType
          sort_order: number
        }
        Insert: Omit<Database["public"]["Tables"]["project_amenities"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["project_amenities"]["Insert"]>
      }

      project_features: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string
          icon: string
          sort_order: number
        }
        Insert: Omit<Database["public"]["Tables"]["project_features"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["project_features"]["Insert"]>
      }

      project_phases: {
        Row: {
          id: string
          project_id: string
          name: string
          subtitle: string
          status: PhaseStatus
          label: string
          date: string | null
          sort_order: number
        }
        Insert: Omit<Database["public"]["Tables"]["project_phases"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["project_phases"]["Insert"]>
      }

      project_property_types: {
        Row: {
          id: string
          project_id: string
          name: string
          area: string
          rooms: number
          baths: number
          garden: string
          description: string
          image: string
          sort_order: number
        }
        Insert: Omit<Database["public"]["Tables"]["project_property_types"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["project_property_types"]["Insert"]>
      }

      project_pricing: {
        Row: {
          id: string
          project_id: string
          type: string
          area: string
          price: string
          details: string
          available: number
          sold: number
          images: { src: string; alt: string }[]
          rooms: number | null
          baths: number | null
          garden: string | null
          description: string | null
          sort_order: number
        }
        Insert: Omit<Database["public"]["Tables"]["project_pricing"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["project_pricing"]["Insert"]>
      }

      project_gallery_items: {
        Row: {
          id: string
          project_id: string
          category: GalleryCategory
          src: string | null
          alt: string
          url: string | null
          thumb: string | null
          is_hero: boolean
          sort_order: number
        }
        Insert: Omit<Database["public"]["Tables"]["project_gallery_items"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["project_gallery_items"]["Insert"]>
      }

      project_qualities: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string
          icon: string
          sort_order: number
        }
        Insert: Omit<Database["public"]["Tables"]["project_qualities"]["Row"], "id"> & { id?: string }
        Update: Partial<Database["public"]["Tables"]["project_qualities"]["Insert"]>
      }

      blog_posts: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          image: string
          date: string
          read_time: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>
      }

      site_settings: {
        Row: {
          id: number
          company_name: string
          phone: string
          email: string
          address: string
          city: string
          province: string
          postal_code: string
          office_lat: number
          office_lng: number
          meta_title: string
          meta_description: string
          office_hours: string
          social_instagram: string
          social_facebook: string
          social_linkedin: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["site_settings"]["Row"], "id" | "updated_at"> & {
          id?: number
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>
      }
    }

    Functions: {
      get_project_full: {
        Args: { p_slug: string }
        Returns: unknown
      }
    }
  }
}
