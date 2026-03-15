"use client"

import Link from "next/link"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, ChevronRight } from "lucide-react"
import type { Project } from "@/lib/types"

/**
 * Mobile-first project display: horizontal scroll on mobile, grid on desktop.
 * Awwwards-inspired: swipe to explore, snap scroll, progressive disclosure.
 * Smart layout: 1–2 items are centered with constrained width for visual balance.
 */
export function FeaturedProjectsDisplay({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  const count = projects.length
  const gridLayoutClasses = cn(
    "project-grid-stagger hidden sm:grid gap-6 md:gap-8",
    count === 1 && "grid-cols-1 max-w-lg mx-auto",
    count === 2 && "grid-cols-2 max-w-4xl mx-auto",
    count >= 3 && "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
  )

  return (
    <section className="py-12 px-0 sm:py-16 sm:px-4 lg:py-24 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header — button right-aligned on all breakpoints for consistent, thumb-friendly UX */}
        <div className="flex flex-row items-end justify-between gap-3 px-4 sm:px-0 mb-8 sm:mb-12 sm:gap-4">
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
              Proyectos
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl text-balance">
              Nuestros Proyectos
            </h2>
            <p className="text-muted-foreground mt-2 sm:mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
              Descubre nuestras promociones de viviendas unifamiliares exclusivas.
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 touch-manipulation bg-transparent w-fit"
            asChild
          >
            <Link href="/projects">
              Ver todos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Mobile: horizontal scroll with snap — pl/pr so first and last cards have inset from screen edge */}
        <div className="sm:hidden">
          <div
            className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 pl-6 pr-6 -mx-4 scroll-smooth snap-x snap-mandatory scrollbar-hide overscroll-x-contain touch-pan-x"
            role="list"
            aria-label="Proyectos destacados"
          >
            {projects.map((project) => (
              <div
                key={project.slug}
                className="flex-shrink-0 w-[85vw] max-w-[340px] snap-center"
                role="listitem"
              >
                <ProjectCard project={project} variant="compact" />
              </div>
            ))}
          </div>
          {/* Scroll hint — visible when multiple projects */}
          {projects.length > 1 && (
            <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
              <ChevronRight className="h-4 w-4 animate-pulse" aria-hidden />
              Desliza para explorar
            </p>
          )}
        </div>

        {/* Desktop: count-aware grid — centered when 1–2 items, full grid when 3+ */}
        <div className={gridLayoutClasses}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="full" />
          ))}
        </div>
      </div>
    </section>
  )
}
