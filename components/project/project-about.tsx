import Image from "next/image"
import { Sun, Shield, Leaf, Home } from "lucide-react"
import type { Project } from "@/lib/types"

const iconMap: Record<string, typeof Sun> = { Sun, Shield, Leaf, Home }

export function ProjectAbout({ project }: { project: Project }) {
  return (
    <section className="py-16 px-4 lg:py-24 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="lg:flex-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={project.gallery.photos[1]?.src || project.heroImage}
                alt={`Exterior de ${project.name}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:flex-1">
            <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
              Sobre el proyecto
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl mb-4 text-balance">
              {project.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{project.description}</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.features.map((feature) => {
                const Icon = iconMap[feature.icon] || Sun
                return (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10 flex-shrink-0">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
