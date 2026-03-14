import React from "react"
import type { Metadata, Viewport } from "next"
import { Barlow, Belleza } from "next/font/google"

import "./globals.css"
import { Toaster } from "sonner"
import { ConditionalLayoutShell } from "@/components/conditional-layout-shell"
import { JsonLd } from "@/components/seo-json-ld"
import { RotatingFavicon } from "@/components/rotating-favicon"
import { ScrollToTopOnNavigateClient } from "@/components/scroll-to-top-on-navigate-client"
import { getFooterProjects } from "@/lib/store"
import { seo } from "@/lib/seo"

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
})

const belleza = Belleza({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-belleza',
})

export const metadata: Metadata = {
  metadataBase: new URL(seo.baseUrl),
  title: {
    default: seo.defaultTitle,
    template: `%s | ${seo.siteName}`,
  },
  description: seo.defaultDescription,
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
  authors: [{ name: seo.siteName, url: seo.baseUrl }],
  creator: seo.siteName,
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: seo.baseUrl,
    siteName: seo.siteName,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: seo.baseUrl },
}

export const viewport: Viewport = {
  themeColor: "#e69500",
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${seo.baseUrl}/#organization`,
  name: seo.siteName,
  url: seo.baseUrl,
  description: seo.defaultDescription,
  areaServed: { "@type": "Place", name: "Viso de San Juan, La Sagra, Madrid, Toledo" },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: seo.siteName,
  url: seo.baseUrl,
  description: seo.defaultDescription,
  publisher: { "@id": `${seo.baseUrl}/#organization` },
  inLanguage: "es",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const footerProjects = await getFooterProjects().catch(() => [])

  return (
    <html lang="es" className="scroll-smooth" translate="no">
      <body
        className={`${barlow.variable} ${belleza.variable} font-sans antialiased`}
      >
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <RotatingFavicon />
        <ScrollToTopOnNavigateClient />
        <ConditionalLayoutShell projects={footerProjects}>
          {children}
        </ConditionalLayoutShell>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
