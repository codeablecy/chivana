"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface ContactScrollLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

/**
 * Link to #contacto that always scrolls when on the same page.
 * Fixes the case where the URL is already /#contacto and a second click would do nothing.
 */
export function ContactScrollLink({ href, children, className }: ContactScrollLinkProps) {
  const pathname = usePathname()
  const isContactHash = href === "/#contacto" || href === "#contacto"

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isContactHash || pathname !== "/") return
    e.preventDefault()
    const el = document.getElementById("contacto")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      window.history.replaceState(null, "", "/#contacto")
    }
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
