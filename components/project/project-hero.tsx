import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Bath, Ruler, TreePine, ArrowLeft, MapPin, Building2 } from "lucide-react"
import type { Project, PricingItem } from "@/lib/types"

// ─── Stat helpers ──────────────────────────────────────────────────────────────

/** "183.80 m²" | "183,80 m²" → 183.8 */
function parseNum(s: string | undefined | null): number | null {
  if (!s) return null
  const clean = String(s).replace(",", ".").match(/[\d.]+/)
  const n = clean ? parseFloat(clean[0]) : NaN
  return isNaN(n) ? null : n
}

/** "3" if equal, "3–5" if range. Optional unit appended. */
function rangeStr(min: number, max: number, unit = ""): string {
  return min === max ? `${min}${unit}` : `${min}–${max}${unit}`
}

interface Stats {
  count: number
  rooms:    { min: number; max: number } | null
  baths:    { min: number; max: number } | null
  areaM2:   { min: number; max: number } | null
  gardenM2: { min: number; max: number } | null
}

function buildStats(pricing: PricingItem[]): Stats | null {
  if (!pricing.length) return null
  const rooms  = pricing.map((p) => p.rooms).filter((r): r is number => r != null)
  const baths  = pricing.map((p) => p.baths).filter((b): b is number => b != null)
  const areas  = pricing.map((p) => parseNum(p.area)).filter((a): a is number => a !== null)
  const garden = pricing.map((p) => parseNum(p.garden)).filter((g): g is number => g !== null)
  return {
    count:    pricing.length,
    rooms:    rooms.length  ? { min: Math.min(...rooms),  max: Math.max(...rooms)  } : null,
    baths:    baths.length  ? { min: Math.min(...baths),  max: Math.max(...baths)  } : null,
    areaM2:   areas.length  ? { min: Math.min(...areas),  max: Math.max(...areas)  } : null,
    gardenM2: garden.length ? { min: Math.min(...garden), max: Math.max(...garden) } : null,
  }
}

/** Bottom-bar Tipología label: "3 tipologías: 3–5 dorm." */
function tipologiaBarLabel(stats: Stats | null): string {
  if (!stats) return "Viviendas"
  const prefix = stats.count === 1 ? "1 tipología" : `${stats.count} tipologías`
  if (stats.rooms) return `${prefix}: ${rangeStr(stats.rooms.min, stats.rooms.max)} dorm.`
  return prefix
}

// ─── Hero video helper ─────────────────────────────────────────────────────────

/**
 * Converts any YouTube URL (watch, youtu.be, embed) to a full-bleed autoplay
 * embed URL — same behaviour as the homepage hero.
 * Non-YouTube URLs are returned as-is so Vimeo / other embeds still work.
 */
function buildHeroVideoSrc(src: string): string {
  const match = src.match(
    /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([^?&/]+)/,
  )
  if (match?.[1]) {
    const id = match[1]
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&showinfo=0&modestbranding=1`
  }
  return src
}

// ─── Status map ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<Project["status"], string> = {
  active:        "bg-primary text-primary-foreground",
  "coming-soon": "bg-accent text-accent-foreground",
  "sold-out":    "bg-foreground/60 text-card",
}
const STATUS_LABEL: Record<Project["status"], string> = {
  active:        "En Venta",
  "coming-soon": "Próximamente",
  "sold-out":    "Agotado",
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SpecPill({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: React.ReactNode
  label: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 bg-card/15 backdrop-blur-sm rounded-xl px-2 py-3 sm:px-4 min-w-0 border border-card/10">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-accent mb-0.5 shrink-0" />
      <span className="text-card font-semibold text-xs sm:text-sm leading-tight text-center whitespace-nowrap">
        {value}
      </span>
      <span className="text-card/70 text-[10px] sm:text-[11px] text-center whitespace-nowrap leading-tight">
        {label}
      </span>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ProjectHero({ project }: { project: Project }) {
  const isComingSoon = project.status === "coming-soon"
  const stats        = buildStats(project.pricing)

  // Spec pill values — ranges across all pricing rows
  const roomsVal  = stats?.rooms    ? rangeStr(stats.rooms.min,              stats.rooms.max)                          : (project.propertyTypes[0]?.rooms  ?? "—")
  const bathsVal  = stats?.baths    ? rangeStr(stats.baths.min,              stats.baths.max)                          : (project.propertyTypes[0]?.baths  ?? "—")
  const areaVal   = stats?.areaM2   ? rangeStr(Math.round(stats.areaM2.min), Math.round(stats.areaM2.max),   " m²")   : (project.propertyTypes[0]?.area   ?? "—")
  const gardenVal = stats?.gardenM2 ? rangeStr(Math.round(stats.gardenM2.min), Math.round(stats.gardenM2.max), " m²") : (project.propertyTypes[0]?.garden ?? "—")
  const hasSpecs  = stats !== null || project.propertyTypes.length > 0

  const barTipologia   = tipologiaBarLabel(stats)
  const barDisponibles = `${project.availableUnits} de ${project.totalUnits} viviendas`
  const barUbicacion   = [project.location.address, project.location.city, project.location.province].filter(Boolean).join(", ") || "—"

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ── Background: video iframe or static image ── */}
      {project.heroVideoUrl ? (
        <iframe
          src={buildHeroVideoSrc(project.heroVideoUrl)}
          title={project.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-[177.78vh] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      ) : (
        <Image
          src={project.heroImage || "/placeholder.svg"}
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
      )}

      {/* ── Gradient overlay — stronger on mobile for readability ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/65 to-foreground/95 lg:bg-gradient-to-r lg:from-foreground/90 lg:via-foreground/55 lg:to-foreground/10" />

      {/* ── Full-height content column (mobile: top→bottom flow; desktop: centered) ── */}
      <div className="relative z-10 flex flex-col min-h-screen pt-[4.5rem] lg:pt-0 lg:justify-center lg:pb-24">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col flex-1 lg:flex-none lg:justify-center">

          {/* ── Back button — flows in layout on mobile, keeps proper spacing ── */}
          <div className="py-4 lg:py-0 lg:absolute lg:top-24 lg:left-8">
            <Button
              variant="outline"
              size="sm"
              className="border-card/30 text-card hover:bg-card/15 bg-card/10 backdrop-blur-sm text-sm"
              asChild
            >
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 mr-1.5 shrink-0" />
                Todos los proyectos
              </Link>
            </Button>
          </div>

          {/* ── Main content ── */}
          <div className="max-w-2xl flex-1 flex flex-col justify-center pb-6 lg:pb-0 lg:py-8">

            {/* Status + tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3 mt-2 lg:mt-0">
              <Badge className={STATUS_STYLE[project.status]}>
                {STATUS_LABEL[project.status]}
              </Badge>
              {(project.tags ?? []).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-card/20 text-card backdrop-blur-sm border border-card/30 font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Brand */}
            <p className="text-accent font-semibold text-[11px] tracking-[0.2em] uppercase mb-2 lg:text-sm">
              Chivana Real Estate
            </p>

            {/* Title */}
            <h1 className="font-serif text-3xl font-bold text-card leading-[1.1] mb-3 sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
              {project.name}
            </h1>

            {/* Tagline */}
            <p className="text-card/85 text-sm leading-relaxed mb-5 max-w-xl lg:text-lg">
              {project.tagline}
            </p>

            {/* Spec pills */}
            {hasSpecs && (
              <div className="grid grid-cols-4 gap-2 mb-6 max-w-xs sm:max-w-sm lg:max-w-md">
                <SpecPill icon={Home}     value={roomsVal}  label="Dormitorios" />
                <SpecPill icon={Bath}     value={bathsVal}  label="Baños"       />
                <SpecPill icon={Ruler}    value={areaVal}   label="Superficie"  />
                <SpecPill icon={TreePine} value={gardenVal} label="Jardín"      />
              </div>
            )}

            {/* CTAs — mobile-first: stacked full-width, then side-by-side; always visible */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg shadow-accent/20"
                asChild
              >
                <Link href="#viviendas">Descubrir Tipologías</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-2 border-card/50 text-card hover:bg-card/15 hover:border-card/70 text-sm sm:text-base px-6 sm:px-8 h-12 bg-transparent backdrop-blur-sm font-medium"
                asChild
              >
                <Link href="#precios">Ver Precios</Link>
              </Button>
            </div>

            {/* ── Mobile summary card (below CTAs, above fold) ── */}
            {!isComingSoon && (
              <div className="mt-6 rounded-xl bg-card/15 backdrop-blur-md border border-card/15 overflow-hidden lg:hidden">
                <div className="grid grid-cols-3 divide-x divide-card/15">
                  {/* Tipologías */}
                  <div className="flex flex-col items-center justify-center gap-1 px-2 py-3 text-center">
                    <Building2 className="h-4 w-4 text-accent shrink-0" />
                    <p className="text-accent text-[9px] font-semibold uppercase tracking-wider leading-none">Tipologías</p>
                    <p className="text-card text-[11px] font-semibold leading-tight">{barTipologia}</p>
                    {stats && stats.count > 1 && stats.areaM2 && (
                      <p className="text-card/55 text-[9px] leading-none">
                        {rangeStr(Math.round(stats.areaM2.min), Math.round(stats.areaM2.max), " m²")}
                      </p>
                    )}
                  </div>
                  {/* Disponibles */}
                  <div className="flex flex-col items-center justify-center gap-1 px-2 py-3 text-center">
                    <Home className="h-4 w-4 text-accent shrink-0" />
                    <p className="text-accent text-[9px] font-semibold uppercase tracking-wider leading-none">Disponibles</p>
                    <p className="text-card text-[11px] font-semibold leading-tight">{barDisponibles}</p>
                  </div>
                  {/* Ubicación */}
                  <div className="flex flex-col items-center justify-center gap-1 px-2 py-3 text-center">
                    <MapPin className="h-4 w-4 text-accent shrink-0" />
                    <p className="text-accent text-[9px] font-semibold uppercase tracking-wider leading-none">Ubicación</p>
                    <p className="text-card text-[11px] font-semibold leading-tight line-clamp-2">{barUbicacion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop floating bottom bar ── */}
      {!isComingSoon && (
        <div className="absolute bottom-0 left-0 right-0 hidden lg:block z-10">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-stretch min-w-0 bg-card/15 backdrop-blur-md rounded-t-xl overflow-hidden divide-x divide-card/15 border border-b-0 border-card/15">
              {/* Tipologías — count + range */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-w-0 hover:bg-card/10 transition-colors">
                <p className="text-accent text-[11px] font-semibold uppercase tracking-wider mb-1">Tipologías</p>
                <p className="text-card text-sm font-medium text-center leading-snug">{barTipologia}</p>
                {stats && stats.count > 1 && stats.areaM2 && (
                  <p className="text-card/55 text-[11px] text-center mt-0.5">
                    {rangeStr(Math.round(stats.areaM2.min), Math.round(stats.areaM2.max), " m²")}
                  </p>
                )}
              </div>
              {/* Disponibles */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-w-0 hover:bg-card/10 transition-colors">
                <p className="text-accent text-[11px] font-semibold uppercase tracking-wider mb-1">Disponibles</p>
                <p className="text-card text-sm font-medium text-center">{barDisponibles}</p>
              </div>
              {/* Ubicación */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-w-0 hover:bg-card/10 transition-colors">
                <p className="text-accent text-[11px] font-semibold uppercase tracking-wider mb-1">Ubicación</p>
                <p className="text-card text-sm font-medium text-center leading-snug">{barUbicacion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
