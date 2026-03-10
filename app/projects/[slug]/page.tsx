import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Contact } from "@/components/contact"
import { getAllProjects, getProject } from "@/lib/store"
import { ProjectHero } from "@/components/project/project-hero"
import { ProjectPhases } from "@/components/project/project-phases"
import { ProjectGallery } from "@/components/project/project-gallery"
import { ProjectAbout } from "@/components/project/project-about"
import { ProjectTypes } from "@/components/project/project-types"
import { ProjectQualities } from "@/components/project/project-qualities"
import { ProjectPricing } from "@/components/project/project-pricing"
import { ProjectLocation } from "@/components/project/project-location"
import { ManagementOverlay } from "@/components/admin/management-overlay"

/** Dynamic rendering ensures phases added in Admin appear immediately on the project page. */
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: "Proyecto no encontrado" }
  return {
    title: `${project.name} | Chivana Real Estate`,
    description: project.tagline,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const isComingSoon = project.status === "coming-soon"

  return (
    <>
      <Navbar />
      <ManagementOverlay project={project} />
      <main>
        <ProjectHero project={project} />
        {project.phases.length > 0 && <ProjectPhases phases={project.phases} />}
        {(project.gallery.photos.length > 0 ||
          (project.gallery.tour360?.length ?? 0) > 0) && (
          <ProjectGallery gallery={project.gallery} />
        )}
        <ProjectAbout project={project} />
        {project.pricing.length > 0 && (
          <ProjectTypes pricing={project.pricing} />
        )}
        {project.qualities.length > 0 && (
          <ProjectQualities qualities={project.qualities} />
        )}
        {project.pricing.length > 0 && (
          <ProjectPricing pricing={project.pricing} />
        )}
        <ProjectLocation project={project} />
        {!isComingSoon && <Contact />}
      </main>
      <Footer />
    </>
  )
}
