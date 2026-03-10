import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Acceso | Chivana Real Estate",
  description: "Inicia sesión en Chivana Real Estate",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  )
}
