import { ManagementOverlay } from "@/components/admin/management-overlay";
import { Contact } from "@/components/contact";
import { Navbar } from "@/components/navbar";
import { ProjectAbout } from "@/components/project/project-about";
import { ProjectGallery } from "@/components/project/project-gallery";
import { ProjectHeroVirtualTour } from "@/components/project/project-hero-virtual-tour";
import { ProjectHero } from "@/components/project/project-hero";
import { ProjectLocation } from "@/components/project/project-location";
import { ProjectPhases } from "@/components/project/project-phases";
import { ProjectPricing } from "@/components/project/project-pricing";
import { ProjectQualities } from "@/components/project/project-qualities";
import { ProjectTypes } from "@/components/project/project-types";
import { JsonLd } from "@/components/seo-json-ld";
import { absoluteUrl, seo } from "@/lib/seo";
import { galleryHasAnyTabContent } from "@/lib/project-gallery-utils";
import { getAllProjects, getProject } from "@/lib/store";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";

/** Dynamic rendering ensures phases added in Admin appear immediately on the project page. */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Proyecto no encontrado" };

  const url = `/projects/${project.slug}`;
  const img = project.heroImage?.startsWith("http")
    ? project.heroImage
    : absoluteUrl(project.heroImage);

  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: seo.locale,
      url,
      siteName: seo.siteName,
      title: project.name,
      description: project.tagline,
      images: project.heroImage
        ? [{ url: img, width: 1200, height: 630, alt: project.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.tagline,
      images: project.heroImage ? [img] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const isComingSoon = project.status === "coming-soon";
  const pageUrl = absoluteUrl(`/projects/${project.slug}`);

  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.description || project.tagline,
    url: pageUrl,
    image: project.heroImage ? [project.heroImage] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: project.location.address,
      addressLocality: project.location.city,
      addressRegion: project.location.province,
      postalCode: project.location.postalCode,
      addressCountry: "ES",
    },
  };

  const revealSections: Array<{ key: string; node: ReactNode }> = [];
  if (galleryHasAnyTabContent(project.gallery)) {
    revealSections.push({
      key: "gallery",
      node: <ProjectGallery gallery={project.gallery} />,
    });
  }

  if (project.phases.length > 0) {
    revealSections.push({
      key: "phases",
      node: <ProjectPhases phases={project.phases} />,
    });
  }

  // Narrative flow (real-estate best practices):
  // Gallery -> Phases -> Types -> Pricing -> Qualities -> About -> Location -> Contact
  if (project.pricing.length > 0) {
    revealSections.push({
      key: "types",
      node: (
        <ProjectTypes
          pricing={project.pricing}
          showPricingSection={project.showPricingTable}
        />
      ),
    });
  }

  if (project.showPricingTable && project.pricing.length > 0) {
    revealSections.push({
      key: "pricing",
      node: <ProjectPricing pricing={project.pricing} />,
    });
  }

  if (project.qualities.length > 0) {
    revealSections.push({
      key: "qualities",
      node: <ProjectQualities qualities={project.qualities} />,
    });
  }

  revealSections.push({
    key: "about",
    node: <ProjectAbout project={project} />,
  });

  revealSections.push({
    key: "location",
    node: <ProjectLocation project={project} />,
  });

  if (!isComingSoon) {
    revealSections.push({
      key: "contact",
      node: <Contact />,
    });
  }

  return (
    <>
      <JsonLd data={listingJsonLd} />
      <Navbar />
      <ManagementOverlay project={project} />
      <main>
        <ProjectHero
          project={project}
          showPricingCta={
            project.showPricingTable && project.pricing.length > 0
          }
        />
        {project.heroVirtualTourUrl?.trim() ? (
          <ProjectHeroVirtualTour
            embedUrl={project.heroVirtualTourUrl.trim()}
            projectName={project.name}
          />
        ) : null}
        {revealSections.map((s) => (
          <Fragment key={s.key}>{s.node}</Fragment>
        ))}
      </main>
    </>
  );
}
