import React from "react"
import { MapPin, Clock, Car, GraduationCap, HeartPulse, Bus, ShoppingCart, TreePine } from "lucide-react"
import type { Project, Amenity } from "@/lib/types"

const amenityIcons: Record<Amenity["type"], React.ElementType> = {
  education: GraduationCap,
  health: HeartPulse,
  transport: Bus,
  shopping: ShoppingCart,
  leisure: TreePine,
}

const amenityLabels: Record<Amenity["type"], string> = {
  education: "Educacion",
  health: "Salud",
  transport: "Transporte",
  shopping: "Compras",
  leisure: "Ocio",
}

export function ProjectLocation({ project }: { project: Project }) {
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3060!2d${project.location.lng}!3d${project.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1700000000000`

  const amenitiesByType = project.location.amenities.reduce(
    (acc, amenity) => {
      if (!acc[amenity.type]) acc[amenity.type] = []
      acc[amenity.type].push(amenity)
      return acc
    },
    {} as Record<string, Amenity[]>,
  )

  return (
    <section id="ubicacion" className="py-16 px-4 lg:py-24 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Ubicacion y Entorno
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Donde estamos?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
            La mejor opcion para vivir en {project.location.city}. A un paso de Madrid y Toledo.
          </p>
        </div>

        {/* Map + Address */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 mb-12">
          <div className="lg:flex-1">
            <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3]">
              <iframe
                title={`Mapa de ${project.name}`}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 300 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="lg:flex-1 flex flex-col justify-center">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Direccion</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.location.address}
                    <br />
                    {project.location.city}
                    <br />
                    {project.location.province}
                    <br />
                    {"CP: "}{project.location.postalCode}{", Espana"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 flex-shrink-0">
                  <Car className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Distancias</h3>
                  <div className="flex flex-col gap-1.5">
                    {project.location.distances.map((d) => (
                      <div key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 flex-shrink-0">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Horario de Oficina</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Lunes a Viernes: 10:00h - 14:30h y 15:30h - 19:00h
                    <br />
                    Sabados: 10:00h - 14:00h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        {project.location.amenities.length > 0 && (
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-6 text-center lg:text-2xl">
              Servicios Cercanos
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(amenitiesByType).map(([type, amenities]) => {
                const Icon = amenityIcons[type as Amenity["type"]]
                const label = amenityLabels[type as Amenity["type"]]
                return (
                  <div
                    key={type}
                    className="bg-background rounded-xl border border-border p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-accent/10">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm">{label}</h4>
                    </div>
                    <div className="flex flex-col gap-2">
                      {amenities.map((a) => (
                        <div
                          key={a.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">{a.name}</span>
                          <span className="text-foreground font-medium flex-shrink-0 ml-3">
                            {a.distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
