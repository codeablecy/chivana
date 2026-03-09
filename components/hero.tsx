import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Bath, Ruler, TreePine } from "lucide-react"

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-end pb-12 pt-20 lg:items-center lg:pb-0 lg:pt-0">
      <Image
        src="/images/hero.jpg"
        alt="El Mirador del Viso de San Juan - Vista aerea de la urbanizacion"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/10 lg:bg-gradient-to-r lg:from-foreground/85 lg:via-foreground/50 lg:to-transparent" />

      <div className="relative z-10 w-full px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3 lg:text-base">
            Chivana Real Estate
          </p>
          <h1 className="font-serif text-3xl font-bold text-card leading-tight mb-4 lg:text-5xl xl:text-6xl text-balance">
            El Mirador del Viso de San Juan
          </h1>
          <p className="text-card/90 text-base leading-relaxed mb-6 lg:text-lg max-w-xl">
            Casas exclusivas a solo 35 km de Madrid y 33 km de Toledo. 4 dormitorios, 3 banos,
            amplias, luminosas y sostenibles con aerotermia y suelo radiante refrescante.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-md">
            <div className="flex flex-col items-center justify-center gap-0.5 bg-card/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[7rem]">
              <Home className="h-5 w-5 text-accent mb-0.5" />
              <span className="text-card font-semibold text-base">4</span>
              <span className="text-card/90 text-xs text-center whitespace-nowrap">Dormitorios</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 bg-card/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[7rem]">
              <Bath className="h-5 w-5 text-accent mb-0.5" />
              <span className="text-card font-semibold text-base">3</span>
              <span className="text-card/90 text-xs text-center whitespace-nowrap">Baños</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 bg-card/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[7rem]">
              <Ruler className="h-5 w-5 text-accent mb-0.5" />
              <span className="text-card font-semibold text-base">{'175-184 m²'}</span>
              <span className="text-card/90 text-xs text-center whitespace-nowrap">Superficie</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 bg-card/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[7rem]">
              <TreePine className="h-5 w-5 text-accent mb-0.5" />
              <span className="text-card font-semibold text-base">—</span>
              <span className="text-card/90 text-xs text-center whitespace-nowrap">Jardín privado</span>
            </div>
          </div>

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
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 hidden lg:block">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-8 min-w-0 overflow-hidden bg-card/10 backdrop-blur-md rounded-t-xl px-8 py-4">
            <div className="flex-1 min-w-0 text-center">
              <p className="text-accent text-sm font-medium">Tipologia</p>
              <p className="text-card text-sm break-words">Viviendas de 4 dormitorios</p>
            </div>
            <div className="w-px h-8 flex-shrink-0 bg-card/20" />
            <div className="flex-1 min-w-0 text-center">
              <p className="text-accent text-sm font-medium">Estado</p>
              <p className="text-card text-sm break-words">Obras iniciadas</p>
            </div>
            <div className="w-px h-8 flex-shrink-0 bg-card/20" />
            <div className="flex-1 min-w-0 text-center">
              <p className="text-accent text-sm font-medium">Ubicacion</p>
              <p className="text-card text-sm break-words">El Viso de San Juan, Toledo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
