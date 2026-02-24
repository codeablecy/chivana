import Image from "next/image"
import { MapPin, Clock, Car } from "lucide-react"

export function Location() {
  return (
    <section id="ubicacion" className="py-16 px-4 lg:py-24 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
            Ubicacion
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Donde estamos?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
            La mejor opcion para vivir en El Viso de San Juan. A un paso de Madrid y Toledo.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="lg:flex-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/location.jpg"
                alt="Vista aerea de El Viso de San Juan"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-xl font-bold text-card mb-1">El Mirador</h3>
                <p className="text-card/80 text-sm">El Viso de San Juan, Toledo</p>
              </div>
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
                    Cuesta de la Higuera, 19<br />
                    El Viso de San Juan<br />
                    La Sagra, Toledo<br />
                    CP: 45215, Espana
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      35 km a Madrid centro
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      33 km a Toledo
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      Acceso directo a la autovia
                    </div>
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
                    Lunes a Viernes: 10:00h - 14:30h y 15:30h - 19:00h<br />
                    Sabados: 10:00h - 14:00h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
