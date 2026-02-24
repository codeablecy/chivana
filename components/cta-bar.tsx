"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useOverAccentSection } from "@/hooks/use-over-accent-section"
import { cn } from "@/lib/utils"

/**
 * Global floating CTA bar: Pedir Cita + Visitar Oficina De Ventas.
 * Transparent background, minimal elegant buttons, equal width on all screens.
 * Pedir Cita → /citas-visitas | Visitar Oficina → scroll to #mapa (footer).
 * When over accent (orange) sections, buttons invert to white bg for visibility.
 * Mobile-first, user-centric. Awwwards-inspired.
 */
export function CtaBar() {
  const pathname = usePathname()
  const isOverAccent = useOverAccentSection()

  if (pathname?.startsWith("/admin")) return null

  const buttonBase =
    "flex items-center justify-center min-h-[44px] sm:min-h-[42px] px-4 rounded-lg text-sm font-medium active:scale-[0.98] transition-all touch-manipulation border-2"

  const buttonDefault = cn(
    buttonBase,
    "bg-accent text-accent-foreground border-accent/30",
    "hover:bg-accent/90 hover:border-accent/50"
  )

  const buttonOverAccent = cn(
    buttonBase,
    "bg-white text-accent border-accent/40",
    "hover:bg-white hover:border-accent hover:shadow-lg"
  )

  const buttonClass = isOverAccent ? buttonOverAccent : buttonDefault

  return (
    <aside
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 sm:py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-transparent"
        role="complementary"
        aria-label="Acciones principales"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3 sm:gap-4">
          <Link href="/citas-visitas" className={buttonClass}>
            Pedir Cita
          </Link>
          <a href="#mapa" className={buttonClass}>
            <span className="sm:hidden">Ver Oficina</span>
            <span className="hidden sm:inline">Visitar Oficina De Ventas</span>
          </a>
        </div>
    </aside>
  )
}
