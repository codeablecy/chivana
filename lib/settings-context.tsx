"use client"

import React, { createContext, useContext, useMemo } from "react"
import type { SiteSettings } from "@/lib/types"

const defaultSettings: SiteSettings = {
  companyName: "Chivana Real Estate",
  phone: "",
  email: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  officeLat: 0,
  officeLng: 0,
  metaTitle: "",
  metaDescription: "",
  officeHours: "",
  socialInstagram: "",
  socialFacebook: "",
}

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings)

interface SiteSettingsProviderProps {
  settings: SiteSettings
  children: React.ReactNode
}

/**
 * Provides site settings from DB to client components (Navbar, Footer, Contact, etc.).
 * Settings are fetched in root layout and revalidated when admin saves.
 */
export function SiteSettingsProvider({ settings, children }: SiteSettingsProviderProps) {
  const value = useMemo(
    () => ({ ...defaultSettings, ...settings }),
    [
      settings.companyName,
      settings.phone,
      settings.email,
      settings.address,
      settings.city,
      settings.province,
      settings.postalCode,
      settings.officeLat,
      settings.officeLng,
      settings.metaTitle,
      settings.metaDescription,
      settings.officeHours,
      settings.socialInstagram,
      settings.socialFacebook,
    ]
  )
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSettings(): SiteSettings {
  return useContext(SiteSettingsContext) ?? defaultSettings
}

/** Format phone for tel: href (strip spaces). */
export function formatPhoneHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`
}

/** Single-line address for display (address, postalCode city, province). */
export function formatAddressLine(settings: SiteSettings): string {
  const parts = [
    settings.address,
    [settings.postalCode, settings.city].filter(Boolean).join(" "),
    settings.province,
  ].filter(Boolean)
  return parts.join(", ")
}
