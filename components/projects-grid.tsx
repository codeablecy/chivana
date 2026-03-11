"use client"

import { useState, useMemo } from "react"
import { ProjectCard } from "@/components/project-card"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MapPin, Home, Clock, CheckCircle2, LayoutGrid } from "lucide-react"

// ─── Filter definitions ────────────────────────────────────────────────────────

type StatusFilter = "all" | "active" | "coming-soon" | "sold-out"

interface FilterTab {
  id: string
  label: string
  icon?: React.ElementType
  count: number
  type: "status" | "city"
  value: StatusFilter | string
}

// ─── Pill component ────────────────────────────────────────────────────────────

function FilterPill({
  tab,
  active,
  onClick,
}: {
  tab: FilterTab
  active: boolean
  onClick: () => void
}) {
  const Icon = tab.icon

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 rounded-full px-4 py-2.5 sm:py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap snap-start shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "active:scale-95",
        active
          ? "bg-foreground text-card shadow-md"
          : "bg-card text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground hover:bg-muted/50",
      )}
      aria-pressed={active}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            active ? "text-accent" : "text-muted-foreground",
          )}
        />
      )}
      <span>{tab.label}</span>
      <span
        className={cn(
          "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums",
          active
            ? "bg-card/20 text-card"
            : "bg-muted text-muted-foreground",
        )}
      >
        {tab.count}
      </span>
    </button>
  )
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Home className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <div>
        <p className="font-serif text-lg font-semibold text-foreground">Sin resultados</p>
        <p className="text-sm text-muted-foreground mt-1">No hay proyectos que coincidan con ese filtro.</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        Ver todos
      </button>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all")
  const [activeCity,   setActiveCity]   = useState<string>("all")

  // ── Derive unique cities from project data ───────────────────────────────────
  const cities = useMemo(() => {
    const seen = new Map<string, number>()
    for (const p of projects) {
      const city = p.location.city?.trim()
      if (!city) continue
      seen.set(city, (seen.get(city) ?? 0) + 1)
    }
    // Sort descending by project count
    return Array.from(seen.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => ({ city, count }))
  }, [projects])

  // ── Counts per status (respecting city filter) ────────────────────────────────
  const cityFiltered = useMemo(
    () => activeCity === "all" ? projects : projects.filter((p) => p.location.city === activeCity),
    [projects, activeCity],
  )

  const statusCounts = useMemo(() => ({
    all:          cityFiltered.length,
    active:       cityFiltered.filter((p) => p.status === "active").length,
    "coming-soon":cityFiltered.filter((p) => p.status === "coming-soon").length,
    "sold-out":   cityFiltered.filter((p) => p.status === "sold-out").length,
  }), [cityFiltered])

  // ── Final filtered set ────────────────────────────────────────────────────────
  const filtered = useMemo(
    () => activeStatus === "all" ? cityFiltered : cityFiltered.filter((p) => p.status === activeStatus),
    [cityFiltered, activeStatus],
  )

  // ── Status tabs ───────────────────────────────────────────────────────────────
  const statusTabs: FilterTab[] = [
    { id: "all",          label: "Todos",        icon: LayoutGrid,   count: statusCounts.all,           type: "status", value: "all"          },
    { id: "active",       label: "En Venta",     icon: CheckCircle2, count: statusCounts.active,        type: "status", value: "active"       },
    { id: "coming-soon",  label: "Próximamente", icon: Clock,        count: statusCounts["coming-soon"],type: "status", value: "coming-soon"  },
    { id: "sold-out",     label: "Agotados",     icon: Home,         count: statusCounts["sold-out"],   type: "status", value: "sold-out"     },
  ].filter((t) => t.value === "all" || t.count > 0) // hide status with zero projects

  // ── City tabs (only shown when > 1 city) ─────────────────────────────────────
  const cityTabs: FilterTab[] = cities.length > 1 ? [
    {
      id: "city-all",
      label: "Todas las zonas",
      icon: MapPin,
      count: projects.length,
      type: "city",
      value: "all",
    },
    ...cities.map(({ city, count }) => ({
      id:    `city-${city}`,
      label: city,
      icon:  MapPin,
      count,
      type:  "city" as const,
      value: city,
    })),
  ] : []

  function resetFilters() {
    setActiveStatus("all")
    setActiveCity("all")
  }

  return (
    <div className="w-full">

      {/* ── Filter bar — mobile: full-width scroll, desktop: inline ── */}
      <div className="mb-8 sm:mb-10 space-y-3">

        {/* City tabs — only rendered when projects span multiple cities */}
        {cityTabs.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:-mx-1 sm:px-1 snap-x snap-mandatory sm:snap-none">
            {cityTabs.map((tab) => (
              <FilterPill
                key={tab.id}
                tab={tab}
                active={activeCity === tab.value}
                onClick={() => {
                  setActiveCity(tab.value as string)
                  setActiveStatus("all")
                }}
              />
            ))}
          </div>
        )}

        {/* Divider between city and status rows */}
        {cityTabs.length > 0 && (
          <div className="h-px bg-border" />
        )}

        {/* Status tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:-mx-1 sm:px-1 snap-x snap-mandatory sm:snap-none">
          {statusTabs.map((tab) => (
            <FilterPill
              key={tab.id}
              tab={tab}
              active={activeStatus === (tab.value as StatusFilter)}
              onClick={() => setActiveStatus(tab.value as StatusFilter)}
            />
          ))}

          {/* Active filter summary — right-aligned */}
          {(activeStatus !== "all" || activeCity !== "all") && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline shrink-0 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="text-xs text-muted-foreground mb-6">
        {filtered.length === 0
          ? "Sin resultados"
          : `${filtered.length} proyecto${filtered.length !== 1 ? "s" : ""}${activeCity !== "all" ? ` en ${activeCity}` : ""}`}
      </p>

      {/* ── Grid: mobile-first, count-aware on desktop ── */}
      <div
        className={cn(
          "project-grid-stagger grid grid-cols-1 gap-6 sm:gap-8",
          filtered.length === 1 && "sm:max-w-lg sm:mx-auto",
          filtered.length === 2 && "sm:grid-cols-2 sm:max-w-4xl sm:mx-auto",
          filtered.length >= 3 && "sm:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {filtered.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))
        )}
      </div>
    </div>
  )
}
