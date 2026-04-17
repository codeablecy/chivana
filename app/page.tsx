import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { FeaturedProjectsDisplay } from "@/components/featured-projects-display"
import { Navbar } from "@/components/navbar"
import { Contact } from "@/components/contact"
import { ContactScrollLink } from "@/components/contact-scroll-link"
import { getActiveProjects, getPublishedPosts } from "@/lib/store"
import { ArrowRight, Shield, Sun, Leaf, Home } from "lucide-react"
import { seo } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: { absolute: `Inicio | ${seo.siteName}` },
  description: seo.defaultDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: "/",
    siteName: seo.siteName,
    title: `Inicio | ${seo.siteName}`,
    description: seo.defaultDescription,
  },
}

// hero video id from youtube
// const HERO_VIDEO_ID = "kjqXD-HJZKU"
const HERO_VIDEO_ID = process.env.NEXT_PUBLIC_HERO_VIDEO_ID || ""
const HERO_VIDEO_SRC = `https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_ID}&controls=0&rel=0&showinfo=0&modestbranding=1`

function HeroBrand() {
  return (
    <section className="relative min-h-[85vh] flex items-end pb-12 pt-20 lg:items-center lg:pb-0 lg:pt-0 overflow-hidden">
      {/* YouTube autoplay background — contained so 100vw/min-w don't cause horizontal overflow on mobile */}
      <div className="absolute inset-0 min-w-full min-h-full overflow-hidden">
        <iframe
          src={HERO_VIDEO_SRC}
          title="Chivana Real Estate - Proyecto residencial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-1/2 left-1/2 w-full h-full min-w-[177.78vh] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/10 lg:bg-gradient-to-r lg:from-foreground/85 lg:via-foreground/50 lg:to-transparent" />
      <div className="relative z-10 w-full px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3 lg:text-base">
            Chivana Real Estate
          </p>
          <h1 className="font-serif text-3xl font-bold text-card leading-tight mb-4 lg:text-5xl xl:text-6xl text-balance">
            Viviendas Exclusivas Cerca de Madrid
          </h1>
          <p className="text-card/90 text-base leading-relaxed mb-8 lg:text-lg max-w-xl">
            Disenamos hogares para familias que buscan tranquilidad, calidad de vida y una
            ubicacion privilegiada. Descubre nuestros proyectos residenciales.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="text-base px-8"
              asChild
            >
              <Link href="/projects">
                Ver Proyectos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-card/30 text-card hover:bg-card/10 text-base px-8 bg-transparent"
              asChild
            >
              <ContactScrollLink href="#contacto">Contactar</ContactScrollLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// function WhyChivana() {
//   const values = [
//     {
//       icon: Sun,
//       title: "Luminosas",
//       description:
//         "Amplios ventanales que inundan cada estancia de luz natural durante todo el dia.",
//     },
//     {
//       icon: Shield,
//       title: "Calidad Premium",
//       description:
//         "Materiales de primera y acabados de lujo en cada detalle de nuestras viviendas.",
//     },
//     {
//       icon: Leaf,
//       title: "Sostenibles",
//       description:
//         "Aerotermia, suelo radiante y alta eficiencia energetica para el maximo confort.",
//     },
//     {
//       icon: Home,
//       title: "Jardin Privado",
//       description:
//         "Cada vivienda con jardin propio, espacio al aire libre y opcion de piscina.",
//     },
//   ]

//   return (
//     <section className="py-16 px-4 lg:py-24 lg:px-8 bg-card">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
//             Por que Chivana
//           </p>
//           <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
//             Hogares Pensados Para Ti
//           </h2>
//           <p className="text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
//             En Chivana Real Estate creamos viviendas que combinan diseno moderno, materiales de
//             primera calidad y una ubicacion inmejorable.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {values.map((v) => (
//             <div
//               key={v.title}
//               className="flex flex-col items-center text-center bg-background rounded-xl p-6 border border-border"
//             >
//               <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-accent/10 mb-4">
//                 <v.icon className="h-7 w-7 text-accent" />
//               </div>
//               <h3 className="font-serif text-lg font-bold text-foreground mb-2">{v.title}</h3>
//               <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

async function FeaturedProjects() {
  const projects = (await getActiveProjects()).slice(0, 3)
  return <FeaturedProjectsDisplay projects={projects} />
}

async function BlogPreview() {
  const posts = (await getPublishedPosts()).slice(0, 3)

  return (
    <section className="py-16 px-4 lg:py-24 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Blog
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Ultimas Noticias
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group rounded-xl border border-border overflow-hidden bg-background hover:shadow-lg hover:border-accent/30 transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span>{post.date}</span>
                  <span>{"·"}</span>
                  <span>{post.readTime} de lectura</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent">
                  Leer más
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <HeroBrand />
        {/* <WhyChivana /> */}
        <FeaturedProjects />
        <BlogPreview />
        <Contact />
      </main>
    </>
  )
}
