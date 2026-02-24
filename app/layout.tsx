import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

import './globals.css'
import { Toaster } from "sonner"
import { CtaBar } from "@/components/cta-bar"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Chivana Real Estate | El Mirador del Viso de San Juan',
  description:
    'Casas exclusivas a solo 35 km de Madrid y 33 km de Toledo. 4 dormitorios, 3 banos, amplias, luminosas y sostenibles.',
}

export const viewport: Viewport = {
  themeColor: '#1e2d3d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
        <CtaBar />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
