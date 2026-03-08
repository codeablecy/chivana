"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin } from "lucide-react"

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contacto" data-accent-section className="py-16 px-4 lg:py-24 lg:px-8 bg-accent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="lg:flex-1">
            <p className="text-white/90 font-semibold text-sm tracking-widest uppercase mb-2">
              Contacto
            </p>
            <h2 className="font-serif text-2xl font-bold text-accent-foreground lg:text-4xl mb-4 text-balance">
              Pedir Cita
            </h2>
            <p className="text-accent-foreground/90 leading-relaxed mb-8 max-w-md">
              Visitanos en nuestra oficina de ventas o contactanos para mas informacion. Estaremos
              encantados de ayudarte a encontrar tu hogar ideal.
            </p>

            <div className="flex flex-col gap-5">
              <a
                href="tel:+34655754978"
                className="flex items-center gap-3 text-accent-foreground hover:text-white transition-colors"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-accent-foreground/70">Telefono</p>
                  <p className="font-medium">+34 655 754 978</p>
                </div>
              </a>
              <a
                href="mailto:info@chivana-realestate.com"
                className="flex items-center gap-3 text-accent-foreground hover:text-white transition-colors"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-accent-foreground/70">Email</p>
                  <p className="font-medium">info@chivana-realestate.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-accent-foreground">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-accent-foreground/70">Oficina de Ventas</p>
                  <p className="font-medium">Urb. Apr 19, 1P, 45215 El Viso de San Juan, Toledo, Spain</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:flex-1">
            {submitted ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mx-auto mb-4">
                  <Mail className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-serif text-xl font-bold text-accent-foreground mb-2">
                  Mensaje Enviado
                </h3>
                <p className="text-accent-foreground/80 text-sm">
                  Gracias por contactarnos. Te responderemos lo antes posible.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col gap-4 border border-white/10 lg:p-8"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-accent-foreground/90 mb-1.5 block">
                      Nombre
                    </label>
                    <Input
                      placeholder="Tu nombre"
                      required
                      className="bg-white/10 border-white/20 text-accent-foreground placeholder:text-accent-foreground/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-accent-foreground/90 mb-1.5 block">
                      Apellidos
                    </label>
                    <Input
                      placeholder="Tus apellidos"
                      required
                      className="bg-white/10 border-white/20 text-accent-foreground placeholder:text-accent-foreground/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-accent-foreground/90 mb-1.5 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    required
                    className="bg-white/10 border-white/20 text-accent-foreground placeholder:text-accent-foreground/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-accent-foreground/90 mb-1.5 block">
                    Telefono
                  </label>
                  <Input
                    type="tel"
                    placeholder="+34 600 000 000"
                    className="bg-white/10 border-white/20 text-accent-foreground placeholder:text-accent-foreground/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-accent-foreground/90 mb-1.5 block">
                    Mensaje
                  </label>
                  <Textarea
                    placeholder="Cuentanos que te interesa..."
                    rows={4}
                    className="bg-white/10 border-white/20 text-accent-foreground placeholder:text-accent-foreground/50 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-white text-accent hover:bg-white/90 mt-2"
                >
                  Enviar Mensaje
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
