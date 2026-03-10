import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { getPost, getPublishedPosts } from "@/lib/store"
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return { title: "Artículo no encontrado" }
  return {
    title: `${post.title} | Blog Chivana`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params
  const [post, related] = await Promise.all([
    getPost(id),
    getPublishedPosts(),
  ])

  if (!post || !post.published) notFound()

  const others = related.filter((p) => p.id !== post.id).slice(0, 3)

  // Split content into paragraphs for rendering (plain text stored in DB)
  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">

        {/* ── Hero image ── */}
        {post.image && (
          <div className="relative w-full h-[42vh] sm:h-[52vh] lg:h-[60vh] bg-muted overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        )}

        {/* ── Article ── */}
        <article className="max-w-2xl mx-auto px-5 lg:px-0">

          {/* Back link */}
          <div className="pt-8 pb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Volver al inicio
            </Link>
          </div>

          {/* Title block */}
          <header className="pt-6 pb-8 border-b border-border">
            <h1 className="font-serif text-3xl font-bold text-foreground leading-snug sm:text-4xl lg:text-5xl mb-5">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} de lectura
              </span>
            </div>
          </header>

          {/* Body */}
          <div className="py-10 space-y-6 text-[17px] leading-8 text-foreground/90">
            {paragraphs.map((para, i) => {
              // Simple heading detection: lines ending with : or short lines in isolation
              if (para.startsWith("# ")) {
                return (
                  <h2 key={i} className="font-serif text-2xl font-bold text-foreground pt-4 leading-tight">
                    {para.replace(/^# /, "")}
                  </h2>
                )
              }
              if (para.startsWith("## ")) {
                return (
                  <h3 key={i} className="font-serif text-xl font-semibold text-foreground pt-2 leading-tight">
                    {para.replace(/^## /, "")}
                  </h3>
                )
              }
              return (
                <p key={i} className="text-foreground/85 leading-8">
                  {para}
                </p>
              )
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-4 border-t border-border">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Chivana Real Estate
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* CTA */}
          <div className="my-10 rounded-2xl bg-accent/8 border border-accent/20 px-6 py-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
              ¿Te interesa?
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
              Descubre nuestros proyectos
            </h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              Casas exclusivas con los mejores acabados, diseñadas para tu familia.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-accent/90 transition-colors"
            >
              Ver proyectos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </article>

        {/* ── Related posts ── */}
        {others.length > 0 && (
          <section className="max-w-5xl mx-auto px-5 lg:px-0 pb-20">
            <div className="border-t border-border pt-12 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">
                Sigue leyendo
              </p>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Más artículos
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.id}`}
                  className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-lg transition-all hover:border-accent/30"
                >
                  {p.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>{p.date}</span>
                      <span>·</span>
                      <span>{p.readTime}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                      {p.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-accent">
                      Leer más
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </>
  )
}
