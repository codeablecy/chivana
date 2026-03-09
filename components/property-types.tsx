"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Ruler, BedDouble, Bath, TreePine } from "lucide-react"

const properties = [
  {
    name: "Unifamiliar Tipo A",
    area: "183.80 m\u00B2",
    rooms: 4,
    baths: 3,
    garden: "56 m\u00B2",
    description:
      "Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad. Perfecto para un estilo de vida moderno.",
    image: "/images/living-room.jpg",
  },
  {
    name: "Unifamiliar Tipo A Simetrico",
    area: "183.81 m\u00B2",
    rooms: 4,
    baths: 3,
    garden: "56 m\u00B2",
    description:
      "Diseno luminoso con estancias amplias, buhardilla versatil, cocinas modernas, banos completos y suelos ceramicos de primeras marcas.",
    image: "/images/kitchen.jpg",
  },
  {
    name: "Unifamiliar Tipo B",
    area: "181.82 m\u00B2",
    rooms: 4,
    baths: 3,
    garden: "56 m\u00B2",
    description:
      "Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad. Perfecto para un estilo de vida moderno.",
    image: "/images/bedroom.jpg",
  },
  {
    name: "Unifamiliar Tipo C",
    area: "175.25 m\u00B2",
    rooms: 4,
    baths: 3,
    garden: "75 m\u00B2",
    description:
      "Distribucion optimizada, buhardilla funcional, cocinas contemporaneas y acabados de lujo. Disenado para el maximo confort.",
    image: "/images/bathroom.jpg",
  },
  {
    name: "Unifamiliar Tipo C Simetrico",
    area: "175.25 m\u00B2",
    rooms: 4,
    baths: 3,
    garden: "75 m\u00B2",
    description:
      "Diseno versatil con amplios espacios, buhardilla funcional, banos modernos y suelos de primeras marcas. Ideal para familias dinamicas.",
    image: "/images/exterior.jpg",
  },
]

export function PropertyTypes() {
  const [current, setCurrent] = useState(0)
  const property = properties[current]

  const prev = () => setCurrent((c) => (c === 0 ? properties.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === properties.length - 1 ? 0 : c + 1))

  return (
    <section id="viviendas" className="py-16 px-4 lg:py-24 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Tipologias
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Las Viviendas
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
            Espacios modernos y funcionales disenados para tu familia
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="lg:flex-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={property.image || "/placeholder.svg"}
                alt={property.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
                {property.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                  {current + 1} / {properties.length}
                </span>
                <button
                  onClick={next}
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {property.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-1.5 bg-muted rounded-xl p-4">
                <Ruler className="h-5 w-5 text-accent" />
                <span className="text-foreground font-bold text-sm">{property.area}</span>
                <span className="text-muted-foreground text-xs">Superficie</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-muted rounded-xl p-4">
                <BedDouble className="h-5 w-5 text-accent" />
                <span className="text-foreground font-bold text-sm">{property.rooms}</span>
                <span className="text-muted-foreground text-xs">Dormitorios</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-muted rounded-xl p-4">
                <Bath className="h-5 w-5 text-accent" />
                <span className="text-foreground font-bold text-sm">{property.baths}</span>
                <span className="text-muted-foreground text-xs">Banos</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-muted rounded-xl p-4">
                <TreePine className="h-5 w-5 text-accent" />
                <span className="text-foreground font-bold text-sm">{property.garden}</span>
                <span className="text-muted-foreground text-xs">Jardin</span>
              </div>
            </div>

            <Button asChild>
              <Link href="#precios">Ver Precios</Link>
            </Button>
          </div>
        </div>

        {/* Property thumbnails */}
        <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
          {properties.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors lg:w-28 lg:h-20 ${
                i === current ? "border-primary" : "border-transparent opacity-60"
              }`}
            >
              <Image
                src={p.image || "/placeholder.svg"}
                alt={p.name}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
