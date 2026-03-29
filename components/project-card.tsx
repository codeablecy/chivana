"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  MapPin,
  Home,
  ArrowRight,
  BedDouble,
  Bath,
  Ruler,
  Rotate3D,
  X,
  Loader2,
} from "lucide-react"
import type { Project, PricingItem } from "@/lib/types"
import { toCityDisplayName } from "@/lib/location-utils"
import { parsePriceEuropean, formatPriceForCard } from "@/lib/format"

// ─── Stat helpers ──────────────────────────────────────────────────────────────

function parseNum(s: string | undefined | null): number | null {
  if (!s) return null
  const clean = String(s).replace(",", ".").match(/[\d.]+/)
  const n = clean ? parseFloat(clean[0]) : NaN
  return isNaN(n) ? null : n
}

function rangeStr(min: number, max: number, unit = ""): string {
  return min === max ? `${min}${unit}` : `${min}–${max}${unit}`
}

interface CardStats {
  rooms: { min: number; max: number } | null
  baths: { min: number; max: number } | null
  areaM2: { min: number; max: number } | null
  /** Resolved minimum price as number (supports European format e.g. 1.450.000). */
  minPriceNum: number | null
  /** Literal label when no numeric price (e.g. "Consultar"). */
  fromPriceLiteral: string | null
}

function buildCardStats(pricing: PricingItem[]): CardStats {
  if (!pricing.length) return { rooms: null, baths: null, areaM2: null, minPriceNum: null, fromPriceLiteral: null }

  const rooms = pricing.map((p) => p.rooms).filter((r): r is number => r != null)
  const baths = pricing.map((p) => p.baths).filter((b): b is number => b != null)
  const areas = pricing.map((p) => parseNum(p.area)).filter((a): a is number => a !== null)
  const prices = pricing
    .map((p) => parsePriceEuropean(p.price))
    .filter((n): n is number => n !== null && n > 0)

  const minPriceNum = prices.length ? Math.min(...prices) : null
  const fromPriceLiteral =
    !minPriceNum && pricing[0]?.price && pricing[0].price !== "—" ? pricing[0].price : null

  return {
    rooms: rooms.length ? { min: Math.min(...rooms), max: Math.max(...rooms) } : null,
    baths: baths.length ? { min: Math.min(...baths), max: Math.max(...baths) } : null,
    areaM2: areas.length ? { min: Math.min(...areas), max: Math.max(...areas) } : null,
    minPriceNum,
    fromPriceLiteral,
  }
}

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_BADGE = {
  active:        "bg-primary text-primary-foreground",
  "coming-soon": "bg-accent text-accent-foreground",
  "sold-out":    "bg-foreground/55 text-card",
} as const

const STATUS_LABEL = {
  active:        "En Venta",
  "coming-soon": "Próximamente",
  "sold-out":    "Agotado",
} as const

/** Card-level overlay/treatment per status */
const STATUS_CARD_CLASS = {
  active:        "",
  "coming-soon": "ring-2 ring-accent/40",
  "sold-out":    "opacity-80",
} as const

// ─── Spec chip ────────────────────────────────────────────────────────────────

function SpecChip({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-1 text-sm text-foreground min-w-0">
      <Icon className="h-3.5 w-3.5 text-accent shrink-0" />
      <span className="font-medium whitespace-nowrap">{value}</span>
      <span className="text-muted-foreground text-xs whitespace-nowrap hidden sm:inline">{label}</span>
    </div>
  )
}

// ─── Tour 360° modal ──────────────────────────────────────────────────────────

function Tour360Dialog({
  open,
  onClose,
  tourUrl,
  projectName,
}: {
  open: boolean
  onClose: () => void
  tourUrl: string
  projectName: string
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setLoaded(false); onClose() } }}>
      <DialogContent
        className="w-[min(94vw,1280px)] max-w-none max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-foreground border border-foreground/20 rounded-2xl shadow-2xl [&>button]:hidden"
        style={
          {
            "--tw-shadow": "0 25px 50px -12px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06)",
          } as React.CSSProperties
        }
      >
        {/* Header — compact, elegant */}
        <DialogHeader className="flex-row items-center justify-between px-5 py-3.5 border-b border-card/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Rotate3D className="h-4 w-4 text-accent shrink-0" />
            <DialogTitle className="text-sm font-semibold text-card truncate">
              Tour 360° · {projectName}
            </DialogTitle>
          </div>
          <button
            onClick={() => { setLoaded(false); onClose() }}
            className="p-2 rounded-xl text-card/60 hover:text-card hover:bg-card/10 transition-colors shrink-0"
            aria-label="Cerrar tour"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Iframe — viewport-aware height, keeps 16/9 where possible */}
        <div
          className="relative w-full flex-1 min-h-0 bg-foreground/95"
          style={{
            aspectRatio: "16/9",
            maxHeight: "calc(90vh - 3.5rem)",
          }}
        >
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-foreground z-10">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-card/60 text-sm">Cargando tour virtual…</p>
            </div>
          )}
          <iframe
            src={tourUrl}
            title={`Tour 360° — ${projectName}`}
            allow="xr-spatial-tracking; gyroscope; accelerometer; autoplay; fullscreen"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            className="w-full h-full border-0 rounded-b-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────────

type CardVariant = "compact" | "full"

interface ProjectCardProps {
  project: Project
  /** `compact` for home/carousel: fewer specs, tighter layout. `full` for /projects grid. */
  variant?: CardVariant
}

export function ProjectCard({ project, variant = "full" }: ProjectCardProps) {
  const [tourOpen, setTourOpen] = useState(false)

  const stats    = buildCardStats(project.pricing)
  const heroVtUrl =
    project.heroVirtualTourUrl?.trim() || project.gallery?.tour360?.[0]?.url
  const has360 = !!heroVtUrl
  const fallback = project.propertyTypes[0]

  const roomsVal = stats.rooms
    ? rangeStr(stats.rooms.min, stats.rooms.max)
    : fallback?.rooms != null ? String(fallback.rooms) : null

  const bathsVal = stats.baths
    ? rangeStr(stats.baths.min, stats.baths.max)
    : fallback?.baths != null ? String(fallback.baths) : null

  const areaVal = stats.areaM2
    ? rangeStr(Math.round(stats.areaM2.min), Math.round(stats.areaM2.max))
    : fallback?.area
      ? String(fallback.area).replace(/\s*m²/gi, "").trim()
      : null

  const showSpecs = variant === "full" && (roomsVal || bathsVal || areaVal)
  const isCompact = variant === "compact"

  return (
    <>
      <article
        className={`group rounded-2xl border border-border overflow-hidden bg-card transition-all duration-300 ease-out
          ${!isCompact ? "hover:shadow-2xl hover:shadow-foreground/8 hover:-translate-y-1" : "hover:shadow-xl"}
          ${STATUS_CARD_CLASS[project.status]} ${isCompact ? "flex flex-col" : ""}`}
      >
        {/* ── Image block ── */}
        <div className={`relative overflow-hidden ${isCompact ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
          <Image
            src={project.heroImage || "/placeholder.svg"}
            alt={project.name}
            fill
            className={`object-cover transition-transform duration-500 ease-out will-change-transform
              ${!isCompact ? "group-hover:scale-110" : "group-hover:scale-105"}
              ${project.status === "sold-out" ? "grayscale-[30%]" : ""}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient — intensifies on hover (full variant) */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent transition-opacity duration-300 ${!isCompact ? "group-hover:from-foreground/70 group-hover:via-foreground/20" : ""}`}
          />

          {/* Sold-out diagonal ribbon */}
          {project.status === "sold-out" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -right-8 top-6 w-36 bg-foreground/80 text-card text-[10px] font-bold tracking-widest uppercase text-center py-1 rotate-45 shadow-lg">
                Agotado
              </div>
            </div>
          )}

          {/* Coming-soon shimmer bar */}
          {project.status === "coming-soon" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />
          )}

          {/* Status + tags — top-LEFT, never touches the right corner */}
          <div className="absolute top-3 left-3 flex flex-wrap items-start gap-1.5 max-w-[65%]">
            <Badge className={STATUS_BADGE[project.status]}>
              {STATUS_LABEL[project.status]}
            </Badge>
            {(project.tags ?? []).slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-foreground/65 text-card backdrop-blur-sm border-0 text-xs font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Tour 360° badge — FIXED top-RIGHT, independent of tags */}
          {has360 && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setTourOpen(true) }}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-foreground/70 backdrop-blur-md border border-card/25 px-2.5 py-1.5 text-[11px] font-semibold text-card hover:bg-foreground/85 hover:scale-105 active:scale-95 transition-all duration-150 shadow-sm"
              aria-label="Ver tour virtual 360°"
            >
              <Rotate3D className="h-3.5 w-3.5 text-accent" />
              Tour 360°
            </button>
          )}

          {/* Title + location — bottom */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className={`font-serif font-bold text-card leading-tight ${isCompact ? "text-lg lg:text-xl" : "text-lg lg:text-xl xl:text-2xl"}`}>
              {project.name}
            </h3>
            {(project.location.city || project.location.province) && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 text-card/75 shrink-0" />
                <span className="text-card/75 text-sm truncate">
                  {[toCityDisplayName(project.location.city), toCityDisplayName(project.location.province)]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className={`px-4 pt-4 pb-5 lg:px-5 flex flex-col gap-3 ${isCompact ? "flex-1 flex justify-between" : ""}`}>

          {/* Tagline — hidden in compact */}
          {!isCompact && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {project.tagline}
            </p>
          )}

          {/* Spec row — hidden in compact */}
          {showSpecs && (
            <div className="flex items-center gap-3 flex-wrap py-2.5 px-3 rounded-xl bg-muted/50 border border-border/60">
              {areaVal  && <SpecChip icon={Ruler}    value={areaVal}  label="m²"    />}
              {roomsVal && <SpecChip icon={BedDouble} value={roomsVal} label="dorm." />}
              {bathsVal && <SpecChip icon={Bath}      value={bathsVal} label="baños" />}
            </div>
          )}

          {/* Compact: inline mini-specs */}
          {isCompact && (roomsVal || areaVal) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {areaVal && <span className="flex items-center gap-1"><Ruler className="h-3 w-3 text-accent" />{areaVal} m²</span>}
              {roomsVal && <span className="flex items-center gap-1"><BedDouble className="h-3 w-3 text-accent" />{roomsVal} dorm.</span>}
              {bathsVal && <span className="flex items-center gap-1"><Bath className="h-3 w-3 text-accent" />{bathsVal} baños</span>}
            </div>
          )}

          {/* Price + availability — Awwwards-style: clear hierarchy, no truncation */}
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="min-w-0 flex flex-col">
              {project.status === "sold-out" ? (
                <p className="text-sm font-semibold text-muted-foreground line-through">
                  {stats.minPriceNum
                    ? formatPriceForCard(stats.minPriceNum).amount
                    : stats.fromPriceLiteral ?? "Vendido"}
                </p>
              ) : stats.minPriceNum ? (
                (() => {
                  const { fromLabel, amount } = formatPriceForCard(stats.minPriceNum)
                  return (
                    <>
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {fromLabel}
                      </span>
                      <span className="text-lg sm:text-xl font-bold tabular-nums tracking-tight text-accent break-words">
                        {amount}
                      </span>
                    </>
                  )
                })()
              ) : (
                <>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Precio
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    {stats.fromPriceLiteral ?? "Consultar"}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm shrink-0">
              <Home className="h-4 w-4 text-accent" />
              <span className="font-medium text-foreground">{project.totalUnits}</span>
              <span className="text-muted-foreground">viv.</span>
              {project.status === "active" && project.availableUnits > 0 && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span className="font-bold text-primary">{project.availableUnits}</span>
                  <span className="text-muted-foreground">disp.</span>
                </>
              )}
            </div>
          </div>

          {/* CTA — min 44px touch target on mobile, hover lift on desktop */}
          <Button
            className={`w-full mt-1 min-h-[44px] sm:min-h-0 transition-transform duration-200
              ${!isCompact ? "hover:scale-[1.02] hover:shadow-md" : ""}
              ${isCompact ? "text-sm" : ""}`}
            asChild
          >
            <Link href={`/projects/${project.slug}`}>
              {project.status === "coming-soon" ? "Más información" : "Ver proyecto"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </article>

      {/* Tour 360° modal — outside article so click doesn't bubble into Link */}
      {has360 && heroVtUrl && (
        <Tour360Dialog
          open={tourOpen}
          onClose={() => setTourOpen(false)}
          tourUrl={heroVtUrl}
          projectName={project.name}
        />
      )}
    </>
  )
}
