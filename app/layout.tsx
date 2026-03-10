import React from "react"
import type { Metadata, Viewport } from "next"
import { Barlow, Belleza } from "next/font/google"

import "./globals.css"
import { Toaster } from "sonner"
import { ConditionalLayoutShell } from "@/components/conditional-layout-shell"
import { ScrollToTopOnNavigateClient } from "@/components/scroll-to-top-on-navigate-client"
import { getFooterProjects } from "@/lib/store"

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
  title: 'Chivana Real Estate | El Mirador del Viso de San Juan',
  description:
    'Casas exclusivas a solo 35 km de Madrid y 33 km de Toledo. 4 dormitorios, 3 banos, amplias, luminosas y sostenibles.',
}

export const viewport: Viewport = {
  themeColor: '#234457',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const footerProjects = await getFooterProjects().catch(() => [])

  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${barlow.variable} ${belleza.variable} font-sans antialiased`}
      >
        <ScrollToTopOnNavigateClient />
        <ConditionalLayoutShell projects={footerProjects}>
          {children}
        </ConditionalLayoutShell>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
