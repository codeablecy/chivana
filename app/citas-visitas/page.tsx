"use client"

import { useState } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { BookingRequestDialog } from "@/components/booking-request-dialog"
import type { BookingType } from "@/components/booking-request-dialog"
import { Video, MapPin } from "lucide-react"

/**
 * Appointments & visits page — two booking types: Online + Office.
 * Matches chivana-realestate.com/citas-visitas. Awwwards-inspired, mobile-first.
 */
export default function CitasVisitasPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bookingType, setBookingType] = useState<BookingType>("online")

  const openBooking = (type: BookingType) => {
    setBookingType(type)
    setDialogOpen(true)
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 px-4 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
              Reservas y Visitas
            </p>
            <h1 className="font-serif text-3xl font-bold text-foreground lg:text-4xl xl:text-5xl text-balance mb-4">
              Citas y visitas
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              Visítanos o reserva en línea
            </p>
            <p className="text-muted-foreground/80 text-base leading-relaxed">
              Vivir tranquilo es vivir mejor, a un paso de Madrid y Toledo
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
            {/* Visita Online */}
            <article className="flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:w-[45%] lg:min-h-[280px]">
                <Image
                  src="/images/living-room.jpg"
                  alt="Visita online por videollamada"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="flex flex-col justify-center p-6 lg:p-8 lg:flex-1 bg-muted/30">
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  Visita Online
                </h2>
                <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-foreground/10 text-foreground text-xs font-medium mb-6">
                  <Video className="h-3.5 w-3.5" />
                  Disponible online
                </span>
                <p className="text-muted-foreground text-sm mb-6">
                  Conecta con nosotros por videollamada desde donde estés.
                </p>
                <button
                  onClick={() => openBooking("online")}
                  className="w-full sm:w-auto rounded-lg bg-accent text-accent-foreground font-medium px-6 py-3 hover:bg-accent/90 active:scale-[0.98] transition-all"
                >
                  Solicitud de reserva
                </button>
              </div>
            </article>

            {/* Visita punto de venta */}
            <article className="flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:w-[45%] lg:min-h-[280px] order-2 lg:order-1">
                <Image
                  src="/images/exterior.jpg"
                  alt="Visita a la oficina de ventas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="flex flex-col justify-center p-6 lg:p-8 lg:flex-1 bg-muted/30 order-1 lg:order-2">
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  Visita punto de venta
                </h2>
                <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-foreground/10 text-foreground text-xs font-medium mb-6">
                  <MapPin className="h-3.5 w-3.5" />
                  El Viso de San Juan
                </span>
                <p className="text-muted-foreground text-sm mb-6">
                  Visítanos en nuestra oficina y descubre las viviendas en persona.
                </p>
                <button
                  onClick={() => openBooking("office")}
                  className="w-full sm:w-auto rounded-lg bg-accent text-accent-foreground font-medium px-6 py-3 hover:bg-accent/90 active:scale-[0.98] transition-all"
                >
                  Solicitud de reserva
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>

      <BookingRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bookingType={bookingType}
      />
    </>
  )
}
