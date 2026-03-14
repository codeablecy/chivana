import React from "react"
import { MapPin, Car, GraduationCap, HeartPulse, Bus, ShoppingCart, TreePine } from "lucide-react"
import type { Project, Amenity } from "@/lib/types"
import { toCityDisplayName } from "@/lib/location-utils"

/** True only when the string has at least one non-whitespace character. */
function hasValue(s: string | undefined | null): boolean {
  return typeof s === "string" && s.trim() !== ""
}

/** True when at least one address field (address, city, province, postalCode) has a value. */
function hasAddressContent(loc: Project["location"]): boolean {
  return (
    hasValue(loc.address) ||
    hasValue(loc.city) ||
    hasValue(loc.province) ||
    hasValue(loc.postalCode)
  )
}

/** True when distances array exists and has at least one non-empty item. */
function hasDistances(distances: string[] | undefined | null): boolean {
  return (
    Array.isArray(distances) &&
    distances.some((d) => hasValue(d))
  )
}

/** Returns only non-empty distance strings, for safe rendering. */
function nonEmptyDistances(distances: string[] | undefined | null): string[] {
  if (!Array.isArray(distances)) return []
  return distances.filter((d) => hasValue(d))
}

/** Address lines to display (only lines that have value). City/province use title case. */
function addressLines(loc: Project["location"]): string[] {
  const lines: string[] = []
  const { address, city, province, postalCode } = loc
  if (hasValue(address)) lines.push(address.trim())
  if (hasValue(city)) lines.push(toCityDisplayName(city))
  if (hasValue(province)) lines.push(toCityDisplayName(province))
  if (hasValue(postalCode)) lines.push(`CP: ${postalCode.trim()}, Espana`)
  return lines
}

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
  const { lat, lng } = project.location
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=es&z=15&output=embed`

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
            {hasValue(project.location.city)
              ? `La mejor opcion para vivir en ${toCityDisplayName(project.location.city)}. A un paso de Madrid y Toledo.`
              : "La mejor opcion para vivir. A un paso de Madrid y Toledo."}
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
              {hasAddressContent(project.location) && (
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Direccion</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {addressLines(project.location).map((line, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              )}

              {hasDistances(project.location.distances) && (
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 flex-shrink-0">
                    <Car className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Distancias</h3>
                    <div className="flex flex-col gap-1.5">
                      {nonEmptyDistances(project.location.distances).map((d, i) => (
                        <div key={`${d}-${i}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                          {d.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Servicios Cercanos */}
        {project.location.amenities.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
                Servicios Cercanos
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(amenitiesByType).map(([type, amenities]) => {
                const Icon = amenityIcons[type as Amenity["type"]]
                const label = amenityLabels[type as Amenity["type"]]
                return (
                  <div
                    key={type}
                    className="bg-background rounded-2xl border border-border/70 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Card header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-accent/10 flex-shrink-0">
                        <Icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm tracking-wide">
                        {label}
                      </h4>
                    </div>

                    {/* Amenity rows with separators */}
                    <div className="flex flex-col">
                      {amenities.map((a, idx) => (
                        <div
                          key={a.name}
                          className={`flex items-center justify-between py-2 text-sm ${
                            idx < amenities.length - 1
                              ? "border-b border-border/50"
                              : ""
                          }`}
                        >
                          <span className="text-muted-foreground leading-snug pr-4">
                            {a.name}
                          </span>
                          <span className="text-foreground font-semibold flex-shrink-0 tabular-nums">
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
