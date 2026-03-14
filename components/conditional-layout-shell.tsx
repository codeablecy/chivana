"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"
import { CtaBar } from "./cta-bar"
import type { FooterProject } from "./footer"

interface ConditionalLayoutShellProps {
  projects: FooterProject[]
  children: React.ReactNode
}

/**
 * Hides footer and CTA bar on auth and admin pages for a clean, full-screen experience.
 */
export function ConditionalLayoutShell({
  projects,
  children,
}: ConditionalLayoutShellProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <>
      {children}
      {!isAuthPage && !isAdminPage && (
        <>
          <Footer projects={projects} />
          <CtaBar />
        </>
      )}
    </>
  )
}
