import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import type { PricingItem } from "@/lib/types"

export function ProjectPricing({ pricing }: { pricing: PricingItem[] }) {
  return (
    <section id="precios" className="scroll-mt-20 py-16 px-4 lg:py-24 lg:px-8 bg-card" aria-labelledby="precios-heading">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-accent font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            Precios
          </p>
          <h2 id="precios-heading" className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Los Precios
          </h2>
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col gap-4 lg:hidden">
          {pricing.map((item) => (
            <div
              key={item.type}
              className={`rounded-xl border p-5 ${
                item.available > 0
                  ? "border-accent/20 bg-accent/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-serif text-base font-bold text-foreground">{item.type}</h3>
                <Badge
                  variant={item.available > 0 ? "default" : "secondary"}
                  className={
                    item.available > 0
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {item.available > 0 ? `${item.available} disponible` : "Vendida"}
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <p>
                  <span className="text-foreground font-medium">Superficie:</span> {item.area}
                </p>
                <p>
                  <span className="text-foreground font-medium">Precio:</span>{" "}
                  <span className="text-accent font-bold">{item.price}</span>
                </p>
                <p>
                  <span className="text-foreground font-medium">Detalles:</span> {item.details}
                </p>
                <p>
                  <span className="text-foreground font-medium">Vendidas:</span> {item.sold}
                </p>
              </div>
              {item.planPdf && (
                <a
                  href={item.planPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-accent hover:text-primary transition-colors"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  Descargar plano PDF
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Desktop table — stronger visual hierarchy */}
        <div className="hidden lg:block rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/60 border-b-2 border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-foreground tracking-wider uppercase">
                  Tipología
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-foreground tracking-wider uppercase">
                  Superficie
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-foreground tracking-wider uppercase">
                  Precio
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-foreground tracking-wider uppercase">
                  Detalles
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-foreground tracking-wider uppercase">
                  Disponibles
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-foreground tracking-wider uppercase">
                  Vendidas
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-foreground tracking-wider uppercase">
                  Plano
                </th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((item, i) => (
                <tr
                  key={item.type}
                  className={`border-t border-border/60 transition-colors hover:bg-muted/20 ${
                    item.available > 0 ? "bg-accent/5" : i % 2 !== 0 ? "bg-muted/20" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground text-sm">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.area}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-accent text-base">{item.price}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.details}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      variant={item.available > 0 ? "default" : "secondary"}
                      className={
                        item.available > 0
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {item.available}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                    {item.sold}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.planPdf ? (
                      <a
                        href={item.planPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Descargar plano PDF"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-primary transition-colors"
                      >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="hidden lg:inline">Plano</span>
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
