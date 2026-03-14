import { Navbar } from "@/components/navbar"
import { ProjectsGrid } from "@/components/projects-grid"
import { getAllProjects } from "@/lib/store"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Descubre nuestros proyectos de viviendas exclusivas cerca de Madrid y Toledo.",
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

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

            <ProjectsGrid projects={projects} />
          </div>
        </section>
      </main>
    </>
  )
}
