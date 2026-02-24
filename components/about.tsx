import Image from "next/image"
import { Shield, Sun, Leaf, Home } from "lucide-react"

const features = [
  {
    icon: Sun,
    title: "Luminosas",
    description: "Amplios ventanales que inundan cada estancia de luz natural.",
  },
  {
    icon: Shield,
    title: "Calidad Premium",
    description: "Materiales de primera y acabados de lujo en cada detalle.",
  },
  {
    icon: Leaf,
    title: "Sostenibles",
    description: "Aerotermia y suelo radiante refrescante para maximo confort.",
  },
  {
    icon: Home,
    title: "Jardin Privado",
    description: "Cada vivienda con jardin propio y opcion de piscina.",
  },
]

export function About() {
  return (
    <section className="py-16 px-4 lg:py-24 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="lg:flex-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/exterior.jpg"
                alt="Exterior de una vivienda en El Mirador del Viso"
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
              El Mirador del Viso de San Juan
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vivir tranquilo es vivir mejor, a un paso de Madrid y Toledo. En El Mirador del Viso
              de San Juan, un proyecto de Chivana Real Estate, disenamos viviendas amplias,
              luminosas y funcionales con materiales de primera calidad.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Pensadas para familias que buscan tranquilidad y calidad de vida, nuestras casas
              exclusivas combinan lujo, confort y una ubicacion privilegiada a solo minutos de
              Madrid y Toledo.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10 flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
