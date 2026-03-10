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
 * Hides footer and CTA bar on auth pages for a full-screen auth experience.
 */
export function ConditionalLayoutShell({
  projects,
  children,
}: ConditionalLayoutShellProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")

  return (
    <>
      {children}
      {!isAuthPage && (
        <>
          <Footer projects={projects} />
          <CtaBar />
        </>
      )}
    </>
  )
}
