"use client";

import { Button } from "@/components/ui/button";
import type { PricingItem } from "@/lib/types";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  FileText,
  Ruler,
  TreePine,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/**
 * Las Viviendas — single source: project.pricing.
 * Displays typologies with images (first image = hero), specs, and CTA.
 * Mobile-first, Awwwards-inspired layout.
 */
export function ProjectTypes({
  pricing,
  showPricingSection = true,
}: {
  pricing: PricingItem[]
  /** When false, hide the CTA to the price table section. */
  showPricingSection?: boolean
}) {
  const [current, setCurrent] = useState(0);
  const item = pricing[current];

  const prev = () => setCurrent((c) => (c === 0 ? pricing.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === pricing.length - 1 ? 0 : c + 1));

  const heroImage = item.images?.[0]?.src ?? "/placeholder.svg";
  const heroAlt = item.images?.[0]?.alt ?? item.type;
  const description = item.description?.trim() || item.details?.trim() || "";
  const rooms = item.rooms ?? null;
  const baths = item.baths ?? null;
  const garden = item.garden ?? null;

  return (
    <section
      id="viviendas"
      className="scroll-mt-20 py-12 px-4 lg:py-20 lg:px-8 bg-background"
      aria-labelledby="viviendas-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 lg:mb-12">
          <p className="text-accent font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            Tipologías
          </p>
          <h2 id="viviendas-heading" className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Las Viviendas
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed text-sm lg:text-base">
            Espacios modernos y funcionales diseñados para tu familia
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-12">
          {/* Hero image + thumbnails — mobile-first: image above on small screens */}
          <div className="lg:flex-1 order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={current === 0}
              />
            </div>
            {/* Thumbnails — horizontal scroll on mobile */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-1 scrollbar-hide">
              {pricing.map((p, i) => {
                const thumbSrc = p.images?.[0]?.src ?? "/placeholder.svg";
                const thumbAlt = p.images?.[0]?.alt ?? p.type;
                return (
                  <button
                    key={p.type}
                    onClick={() => setCurrent(i)}
                    className={`
                      flex-shrink-0 relative w-16 h-12 rounded-lg overflow-hidden border-2
                      transition-colors touch-manipulation
                      sm:w-20 sm:h-14 lg:w-24 lg:h-16
                      ${
                        i === current
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }
                    `}
                    aria-label={`Ver ${p.type}`}
                    aria-current={i === current ? "true" : undefined}
                  >
                    <Image
                      src={thumbSrc}
                      alt={thumbAlt}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details — mobile-first: content below image */}
          <div className="lg:flex-1 order-1 lg:order-2 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-serif text-xl font-bold text-foreground lg:text-2xl flex-1 min-w-0">
                {item.type}
              </h3>
              <div
                className="flex items-center gap-2 shrink-0"
                role="group"
                aria-label="Navegación entre tipologías"
              >
                <button
                  onClick={prev}
                  className="p-2.5 rounded-full border border-border hover:bg-muted hover:border-primary/50 transition-colors touch-manipulation"
                  aria-label="Tipología anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-muted-foreground min-w-[2.5rem] text-center tabular-nums">
                  {current + 1} / {pricing.length}
                </span>
                <button
                  onClick={next}
                  className="p-2.5 rounded-full border border-border hover:bg-muted hover:border-primary/50 transition-colors touch-manipulation"
                  aria-label="Tipología siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {description && (
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm lg:text-base">
                {description}
              </p>
            )}

            {/* Spec cards — 2 cols mobile, 4 cols sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="flex flex-col items-center gap-1.5 bg-muted/80 rounded-xl p-4">
                <Ruler className="h-5 w-5 text-accent shrink-0" />
                <span className="text-foreground font-bold text-sm">
                  {item.area || "—"}
                </span>
                <span className="text-muted-foreground text-xs">
                  Superficie
                </span>
              </div>
              {rooms != null && (
                <div className="flex flex-col items-center gap-1.5 bg-muted/80 rounded-xl p-4">
                  <BedDouble className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-foreground font-bold text-sm">
                    {rooms}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Dormitorios
                  </span>
                </div>
              )}
              {baths != null && (
                <div className="flex flex-col items-center gap-1.5 bg-muted/80 rounded-xl p-4">
                  <Bath className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-foreground font-bold text-sm">
                    {baths}
                  </span>
                  <span className="text-muted-foreground text-xs">Baños</span>
                </div>
              )}
              {garden && (
                <div className="flex flex-col items-center gap-1.5 bg-muted/80 rounded-xl p-4">
                  <TreePine className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-foreground font-bold text-sm">
                    {garden}
                  </span>
                  <span className="text-muted-foreground text-xs">Jardín</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {showPricingSection && (
                <Button className="w-full sm:w-auto" asChild>
                  <Link href="#precios">Ver Precios</Link>
                </Button>
              )}
              {item.planPdf && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2"
                  asChild
                >
                  <a href={item.planPdf} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 shrink-0" />
                    Descargar plano
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
