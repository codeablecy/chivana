import { CheckCircle2, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const phases = [
  {
    name: "Fase 1",
    subtitle: "Viviendas 3 - 8",
    status: "vendida" as const,
    label: "100% vendida",
  },
  {
    name: "Fase 2",
    subtitle: "Viviendas 18 - 29",
    status: "vendida" as const,
    label: "100% vendida",
  },
  {
    name: "Fase 3",
    subtitle: "Viviendas 9 - 17",
    status: "vendida" as const,
    label: "100% vendida",
  },
  {
    name: "Fase 4",
    subtitle: "Viviendas 38 - 44",
    status: "vendida" as const,
    label: "100% vendidas",
  },
  {
    name: "Fase 5",
    subtitle: "Viviendas 30 - 37",
    status: "disponible" as const,
    label: "Ultimas 3 viviendas",
    date: "Julio 2026",
  },
]

export function Phases() {
  return (
    <section id="fases" className="py-16 px-4 lg:py-24 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Avance de proyecto
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Avance de Ventas
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
            No te quedes sin la tuya. Descubre las fases de nuestro proyecto y las viviendas disponibles.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {phases.map((phase) => (
            <div
              key={phase.name}
              className={`flex-1 rounded-xl border p-5 transition-all lg:p-6 ${
                phase.status === "disponible"
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">{phase.name}</h3>
                  <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
                </div>
                {phase.status === "vendida" ? (
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                )}
              </div>

              {phase.date && (
                <p className="text-xs text-accent font-medium mb-2">{phase.date}</p>
              )}

              <Badge
                variant={phase.status === "disponible" ? "default" : "secondary"}
                className={
                  phase.status === "disponible"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }
              >
                {phase.label}
              </Badge>

              {phase.status === "disponible" && (
                <a
                  href="#precios"
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  Ver parcelas
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
