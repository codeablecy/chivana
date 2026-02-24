import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Home, ArrowRight } from "lucide-react"
import type { Project } from "@/lib/types"

const statusMap = {
  active: { label: "En Venta", className: "bg-accent text-accent-foreground" },
  "coming-soon": {
    label: "Proximamente",
    className: "bg-accent text-accent-foreground",
  },
  "sold-out": { label: "Vendido", className: "bg-muted text-muted-foreground" },
} as const

export function ProjectCard({ project }: { project: Project }) {
  const status = statusMap[project.status]

  return (
    <article className="group rounded-2xl border border-border overflow-hidden bg-card hover:shadow-xl transition-shadow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.heroImage || "/placeholder.svg"}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-serif text-lg font-bold text-card lg:text-xl leading-tight">
            {project.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="h-3.5 w-3.5 text-card/80" />
            <span className="text-card/80 text-sm">
              {project.location.city}, {project.location.province}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 lg:p-6">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
          {project.tagline}
        </p>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Home className="h-4 w-4 text-accent" />
            <span className="font-medium">{project.totalUnits}</span>
            <span className="text-muted-foreground">viviendas</span>
          </div>
          {project.status === "active" && (
            <div className="text-sm">
              <span className="font-bold text-accent">{project.availableUnits}</span>{" "}
              <span className="text-muted-foreground">disponibles</span>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          asChild
        >
          <Link href={`/projects/${project.slug}`}>
            {project.status === "coming-soon" ? "Mas Informacion" : "Ver Proyecto"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </article>
  )
}
