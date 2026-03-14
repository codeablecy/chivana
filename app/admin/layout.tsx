import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin",
  description: "Panel de administracion de Chivana Real Estate",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
