import type { Metadata, Viewport } from "next";
import { Barlow, Belleza } from "next/font/google";
import React from "react";

import { ConditionalLayoutShell } from "@/components/conditional-layout-shell";
import { RotatingFavicon } from "@/components/rotating-favicon";
import { ScrollToTopOnNavigateClient } from "@/components/scroll-to-top-on-navigate-client";
import { JsonLd } from "@/components/seo-json-ld";
import { SiteSettingsProvider } from "@/lib/settings-context";
import { seo } from "@/lib/seo";
import { getCachedSettings, getFooterProjects } from "@/lib/store";
import { Toaster } from "sonner";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
});

const belleza = Belleza({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-belleza",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings().catch(() => null)
  const siteName = settings?.companyName ?? seo.siteName
  const defaultTitle = settings?.metaTitle || seo.defaultTitle
  const defaultDescription = settings?.metaDescription || seo.defaultDescription

  return {
    metadataBase: new URL(seo.baseUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description: defaultDescription,
    keywords: [
      "real estate",
      "viviendas",
      "El Mirador",
      "Viso de San Juan",
      "Madrid",
      "Toledo",
      "La Sagra",
      "casas exclusivas",
      "aerotermia",
      "suelo radiante",
      "refrescante",
      "sostenible",
      "ecológica",
      "calidad de vida",
      "seguridad",
    ],
    authors: [{ name: siteName, url: seo.baseUrl }],
    creator: siteName,
    openGraph: {
      type: "website",
      locale: seo.locale,
      url: seo.baseUrl,
      siteName,
      title: defaultTitle,
      description: defaultDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: { canonical: seo.baseUrl },
  }
}

export const viewport: Viewport = {
  themeColor: "#e69500",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, footerProjects] = await Promise.all([
    getCachedSettings().catch(() => ({
      companyName: seo.siteName,
      metaTitle: seo.defaultTitle,
      metaDescription: seo.defaultDescription,
      phone: "",
      email: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      officeLat: 0,
      officeLng: 0,
      officeHours: "",
      socialInstagram: "",
      socialFacebook: "",
    })),
    getFooterProjects().catch(() => []),
  ])

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${seo.baseUrl}/#organization`,
    name: settings.companyName,
    url: seo.baseUrl,
    description: settings.metaDescription || seo.defaultDescription,
    areaServed: {
      "@type": "Place",
      name: [settings.city, settings.province].filter(Boolean).join(", ") || "Viso de San Juan, La Sagra, Madrid, Toledo",
    },
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.companyName,
    url: seo.baseUrl,
    description: settings.metaDescription || seo.defaultDescription,
    publisher: { "@id": `${seo.baseUrl}/#organization` },
    inLanguage: "es",
  }

  return (
    <html lang="es" className="scroll-smooth" translate="yes">
      <body
        className={`${barlow.variable} ${belleza.variable} font-sans antialiased`}
      >
        <SiteSettingsProvider settings={settings}>
          <JsonLd data={organizationJsonLd} />
          <JsonLd data={websiteJsonLd} />
          <RotatingFavicon />
          <ScrollToTopOnNavigateClient />
          <ConditionalLayoutShell projects={footerProjects}>
            {children}
          </ConditionalLayoutShell>
          <Toaster richColors position="top-center" />
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
