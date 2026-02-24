import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Proyectos | Chivana Real Estate",
  description:
    "Descubre nuestros proyectos de viviendas exclusivas cerca de Madrid y Toledo.",
}

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 px-4 lg:py-24 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
                Proyectos
              </p>
              <h1 className="font-serif text-3xl font-bold text-foreground lg:text-5xl text-balance">
                Nuestros Proyectos
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed text-base lg:text-lg">
                Descubre nuestras promociones residenciales de viviendas unifamiliares exclusivas
                en la comarca de La Sagra, a un paso de Madrid y Toledo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
