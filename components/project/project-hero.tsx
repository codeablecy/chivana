import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Bath, Ruler, TreePine, ArrowLeft } from "lucide-react"
import type { Project } from "@/lib/types"

export function ProjectHero({ project }: { project: Project }) {
  const isComingSoon = project.status === "coming-soon"
  const firstProp = project.propertyTypes[0]

  return (
    <section className="relative min-h-screen flex items-end pb-12 pt-20 lg:items-center lg:pb-0 lg:pt-0">
      <Image
        src={project.heroImage || "/placeholder.svg"}
        alt={project.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/10 lg:bg-gradient-to-r lg:from-foreground/85 lg:via-foreground/50 lg:to-transparent" />

      <div className="absolute top-20 left-4 lg:top-24 lg:left-8 z-10">
        <Button
          variant="outline"
          size="sm"
          className="border-card/30 text-card hover:bg-card/10 bg-transparent"
          asChild
        >
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Todos los proyectos
          </Link>
        </Button>
      </div>

      <div className="relative z-10 w-full px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          {isComingSoon && (
            <Badge className="bg-accent text-accent-foreground mb-3">Proximamente</Badge>
          )}
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3 lg:text-base">
            Chivana Real Estate
          </p>
          <h1 className="font-serif text-3xl font-bold text-card leading-tight mb-4 lg:text-5xl xl:text-6xl text-balance">
            {project.name}
          </h1>
          <p className="text-card/90 text-base leading-relaxed mb-6 lg:text-lg max-w-xl">
            {project.tagline}
          </p>

          {firstProp && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-md">
              <div className="flex flex-col items-center justify-center gap-0.5 bg-card/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[7rem]">
                <Home className="h-5 w-5 text-accent mb-0.5" />
                <span className="text-card font-semibold text-base">{firstProp.rooms}</span>
                <span className="text-card/90 text-xs text-center whitespace-nowrap">Dormitorios</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-0.5 bg-card/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[7rem]">
                <Bath className="h-5 w-5 text-accent mb-0.5" />
                <span className="text-card font-semibold text-base">{firstProp.baths}</span>
                <span className="text-card/90 text-xs text-center whitespace-nowrap">Baños</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-0.5 bg-card/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[7rem]">
                <Ruler className="h-5 w-5 text-accent mb-0.5" />
                <span className="text-card font-semibold text-base">{firstProp.area}</span>
                <span className="text-card/90 text-xs text-center whitespace-nowrap">Superficie</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-0.5 bg-card/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[7rem]">
                <TreePine className="h-5 w-5 text-accent mb-0.5" />
                <span className="text-card font-semibold text-base">{firstProp.garden}</span>
                <span className="text-card/90 text-xs text-center whitespace-nowrap">Jardín</span>
              </div>
            </div>
          )}

          {!isComingSoon && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="text-base px-8"
                asChild
              >
                <Link href="#viviendas">Descubrir Tipologias</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-card/30 text-card hover:bg-card/10 text-base px-8 bg-transparent"
                asChild
              >
                <Link href="#precios">Ver Precios</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {!isComingSoon && (
        <div className="absolute bottom-0 left-0 right-0 hidden lg:block">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center gap-8 min-w-0 overflow-hidden bg-card/10 backdrop-blur-md rounded-t-xl px-8 py-4">
              <div className="flex-1 min-w-0 text-center">
                <p className="text-accent text-sm font-medium">Tipologia</p>
                <p className="text-card text-sm break-words">
                  Viviendas de {firstProp?.rooms || 4} dormitorios
                </p>
              </div>
              <div className="w-px h-8 flex-shrink-0 bg-card/20" />
              <div className="flex-1 min-w-0 text-center">
                <p className="text-accent text-sm font-medium">Disponibles</p>
                <p className="text-card text-sm break-words">
                  {project.availableUnits} de {project.totalUnits} viviendas
                </p>
              </div>
              <div className="w-px h-8 flex-shrink-0 bg-card/20" />
              <div className="flex-1 min-w-0 text-center">
                <p className="text-accent text-sm font-medium">Ubicacion</p>
                <p className="text-card text-sm break-words">
                  {project.location.city}, {project.location.province}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
