import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | Chivana Real Estate",
  description: "Panel de administracion de Chivana Real Estate",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
