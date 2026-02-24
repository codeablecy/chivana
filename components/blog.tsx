import Image from "next/image"
import { ArrowRight } from "lucide-react"

const posts = [
  {
    title: "Eficiencia energetica y confort en cada detalle",
    excerpt:
      "El Mirador del Viso integra soluciones modernas como aerotermia y suelo radiante refrescante, garantizando maximo confort con un consumo energetico reducido.",
    image: "/images/exterior.jpg",
    date: "17 ago 2025",
    readTime: "1 Min.",
  },
  {
    title: "Diseno y Confort",
    excerpt:
      "Casas luminosas y espaciosas, pensadas para tu familia. Cada vivienda cuenta con 4 dormitorios, 3 banos y una buhardilla amplia y versatil.",
    image: "/images/living-room.jpg",
    date: "17 ago 2025",
    readTime: "1 Min.",
  },
  {
    title: "Naturaleza y Bienestar",
    excerpt:
      "Conecta con la naturaleza y vive sin estres. En El Mirador del Viso encontraras aire puro, cielos abiertos y paisajes naturales.",
    image: "/images/location.jpg",
    date: "17 ago 2025",
    readTime: "1 Min.",
  },
]

export function Blog() {
  return (
    <section className="py-16 px-4 lg:py-24 lg:px-8 bg-background">
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
            <article
              key={post.title}
              className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-lg transition-shadow"
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
                  Leer mas
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
