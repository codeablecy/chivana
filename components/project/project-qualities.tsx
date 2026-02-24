import { ShieldCheck, Droplets, Zap, Layers } from "lucide-react"

const iconMap: Record<string, typeof ShieldCheck> = {
  Layers,
  ShieldCheck,
  Droplets,
  Zap,
}

export function ProjectQualities({
  qualities,
}: {
  qualities: { title: string; description: string; icon: string }[]
}) {
  return (
    <section data-accent-section className="py-16 px-4 lg:py-24 lg:px-8 bg-accent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-white/90 font-semibold text-sm tracking-widest uppercase mb-2">
            Acabados
          </p>
          <h2 className="font-serif text-2xl font-bold text-accent-foreground lg:text-4xl text-balance">
            Memoria de Calidades
          </h2>
          <p className="text-accent-foreground/90 mt-3 max-w-xl mx-auto leading-relaxed">
            Cada detalle cuenta. Materiales de primera y acabados de lujo en cada rincon.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {qualities.map((q) => {
            const Icon = iconMap[q.icon] || Layers
            return (
              <div
                key={q.title}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white/20 mb-4">
                  <Icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-serif text-lg font-bold text-accent-foreground mb-2">
                  {q.title}
                </h3>
                <p className="text-accent-foreground/80 text-sm leading-relaxed">
                  {q.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
