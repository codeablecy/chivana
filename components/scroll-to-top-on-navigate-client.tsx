"use client"

import dynamic from "next/dynamic"

const ScrollToTopOnNavigate = dynamic(
  () =>
    import("@/components/scroll-to-top-on-navigate").then((m) => ({
      default: m.ScrollToTopOnNavigate,
    })),
  { ssr: false }
)

/** Client-only wrapper so root layout (Server Component) can render scroll-to-top. */
export function ScrollToTopOnNavigateClient() {
  return <ScrollToTopOnNavigate />
}
