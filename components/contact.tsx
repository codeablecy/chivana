"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2, Instagram, Facebook, Linkedin } from "lucide-react"
import { formatAddressLine, formatPhoneHref, useSettings } from "@/lib/settings-context"
import { cn } from "@/lib/utils"

/** Build Google Maps URL for office (search by lat/lng or address). */
function mapsUrl(settings: ReturnType<typeof useSettings>): string {
  if (settings.officeLat && settings.officeLng) {
    return `https://www.google.com/maps/search/?api=1&query=${settings.officeLat},${settings.officeLng}`
  }
  const q = [settings.address, settings.city, settings.province].filter(Boolean).join(", ")
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}

/** Parsed office hours: period label + time ranges for readable weekday/weekend UI. */
export type OfficeHoursBlock = { period: string; ranges: string[] }

/**
 * Parse office_hours string into weekday/weekend blocks for clear, scannable layout.
 * Handles "Lunes a Viernes: 10:00h - 14:30h y 15:30h - 19:00h | Sabados: 10:00h - 14:00h".
 */
function parseOfficeHours(raw: string): OfficeHoursBlock[] {
  const blocks: OfficeHoursBlock[] = []
  const segments = raw.split("|").map((s) => s.trim()).filter(Boolean)
  for (const segment of segments) {
    const colonIndex = segment.indexOf(":")
    if (colonIndex === -1) {
      blocks.push({ period: segment, ranges: [] })
      continue
    }
    const period = segment.slice(0, colonIndex).trim()
    const rest = segment.slice(colonIndex + 1).trim()
    const ranges = rest
      ? rest.split(/\s+y\s+/i).map((r) => r.trim()).filter(Boolean)
      : []
    blocks.push({ period, ranges })
  }
  return blocks
}

export function Contact() {
  const settings = useSettings()
  const [submitted, setSubmitted] = useState(false)
  const baseAddress = formatAddressLine(settings)
  const fullAddress = baseAddress
    ? baseAddress.endsWith("Spain")
      ? baseAddress
      : `${baseAddress}${settings.city || settings.province ? ", Spain" : ""}`
    : ""

  const hasContact =
    settings.phone ||
    settings.email ||
    settings.address ||
    fullAddress ||
    (settings.officeHours?.trim() ?? "")

  const contactItems = [
    settings.phone && {
      href: formatPhoneHref(settings.phone),
      icon: Phone,
      label: "Teléfono",
      value: settings.phone,
      external: false,
    },
    settings.email && {
      href: `mailto:${settings.email}`,
      icon: Mail,
      label: "Email",
      value: settings.email,
      external: false,
    },
    (settings.address || fullAddress) && {
      href: mapsUrl(settings),
      icon: MapPin,
      label: "Oficina de ventas",
      value: fullAddress || settings.address,
      external: true,
    },
    settings.officeHours?.trim() && {
      href: null,
      icon: Clock,
      label: "Horario de oficina",
      value: settings.officeHours.trim(),
      external: false,
    },
  ].filter(Boolean) as Array<{
    href: string | null
    icon: typeof Phone
    label: string
    value: string
    external: boolean
  }>

  return (
    <section
      id="contacto"
      data-accent-section
      className="py-16 px-4 lg:py-24 lg:px-8 bg-accent scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header — brand orange background, light text; same structure as other sections */}
        <div className="text-center mb-10 lg:mb-12">
          <p className="text-white/90 font-semibold text-sm tracking-widest uppercase mb-2">
            Contacto
          </p>
          <h2 className="font-serif text-2xl font-bold text-accent-foreground lg:text-4xl text-balance mb-3">
            Escríbenos o visítanos
          </h2>
          <p className="text-accent-foreground/90 max-w-xl mx-auto leading-relaxed">
            Estaremos encantados de ayudarte a encontrar tu hogar ideal. Responde en poco tiempo.
          </p>
          {/* Social links from Configuración Global — Awwwards-style minimal icon row */}
          {(settings.socialInstagram || settings.socialFacebook || settings.socialLinkedIn) && (
            <div className="mt-6 flex items-center justify-center gap-2" aria-label="Redes sociales">
              {settings.socialInstagram && (
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-accent-foreground/80",
                    "hover:bg-accent-foreground/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-accent",
                    "transition-colors duration-200 touch-manipulation"
                  )}
                  aria-label="Instagram — abrir en nueva pestaña"
                >
                  <Instagram className="h-5 w-5" aria-hidden />
                </a>
              )}
              {settings.socialFacebook && (
                <a
                  href={settings.socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-accent-foreground/80",
                    "hover:bg-accent-foreground/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-accent",
                    "transition-colors duration-200 touch-manipulation"
                  )}
                  aria-label="Facebook — abrir en nueva pestaña"
                >
                  <Facebook className="h-5 w-5" aria-hidden />
                </a>
              )}
              {settings.socialLinkedIn && (
                <a
                  href={settings.socialLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-accent-foreground/80",
                    "hover:bg-accent-foreground/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-accent",
                    "transition-colors duration-200 touch-manipulation"
                  )}
                  aria-label="LinkedIn — abrir en nueva pestaña"
                >
                  <Linkedin className="h-5 w-5" aria-hidden />
                </a>
              )}
            </div>
          )}
        </div>

        <div
          className={cn(
            "grid gap-8 lg:gap-10 lg:items-stretch",
            hasContact
              ? "grid-cols-1 lg:grid-cols-[minmax(320px,360px)_1fr]"
              : "grid-cols-1"
          )}
        >
          {/* Contact cards — grid row gives equal height; last card grows to fill */}
          {hasContact && (
            <div className="flex min-h-0 flex-col gap-3 lg:h-full">
              {contactItems.map((item, index) => {
                const Icon = item.icon
                const isOfficeHours = !item.href && item.label.toLowerCase().includes("horario")
                const parsedHours = isOfficeHours ? parseOfficeHours(item.value) : []
                const isCompact = !isOfficeHours

                const content = isOfficeHours && parsedHours.length > 0 ? (
                  <>
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 text-accent shrink-0 transition-colors group-hover:bg-accent/20">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </p>
                      <dl className="space-y-2" aria-label={item.value}>
                        {parsedHours.map((block) => (
                          <div key={block.period} className="flex flex-col gap-0.5">
                            <dt className="text-sm font-semibold text-foreground">
                              {block.period}
                            </dt>
                            <dd className="text-sm text-muted-foreground leading-snug">
                              {block.ranges.length > 0 ? (
                                <span className="flex flex-col gap-0.5">
                                  {block.ranges.map((range, i) => (
                                    <span key={i}>{range}</span>
                                  ))}
                                </span>
                              ) : (
                                "—"
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0 transition-colors group-hover:bg-accent/20",
                        isCompact ? "h-9 w-9" : "h-12 w-12"
                      )}
                    >
                      <Icon className={isCompact ? "h-4 w-4" : "h-6 w-6"} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="font-medium text-foreground mt-0.5 break-words text-sm group-hover:text-accent transition-colors leading-snug">
                        {item.value}
                      </p>
                    </div>
                    {item.external && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                    )}
                  </>
                )
                const isLastCard = index === contactItems.length - 1
                const cardClass = cn(
                  "group flex items-start gap-3 rounded-xl border border-border bg-background",
                  "hover:shadow-lg hover:border-accent/30 transition-all duration-200",
                  "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:border-accent/30",
                  isCompact ? "p-3" : "p-5",
                  isLastCard && "lg:flex-1 lg:min-h-0"
                )
                if (!item.href) {
                  return (
                    <div key={item.label} className={cardClass} role="group">
                      {content}
                    </div>
                  )
                }
                if (item.external) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClass}
                      aria-label={`${item.label}: ${item.value}. Abrir en mapa`}
                    >
                      {content}
                    </a>
                  )
                }
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cardClass}
                    aria-label={`${item.label}: ${item.value}`}
                  >
                    {content}
                  </a>
                )
              })}
            </div>
          )}

          {/* Form card — same border/card style as other sections */}
          <div className="flex-1 min-w-0">
            {submitted ? (
              <div
                className="rounded-xl border border-border bg-background p-8 text-center"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8" aria-hidden />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  Mensaje enviado
                </h3>
                <p className="text-muted-foreground text-sm">
                  Gracias por contactarnos. Te responderemos lo antes posible.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className={cn(
                  "rounded-xl border border-border bg-background p-5 lg:p-6 flex flex-col gap-3",
                  "focus-within:border-accent/30 transition-colors"
                )}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-medium text-foreground mb-1.5 block">
                      Nombre
                    </label>
                    <Input
                      id="contact-name"
                      placeholder="Tu nombre"
                      required
                      className="border-border bg-background focus-visible:ring-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-surname" className="text-sm font-medium text-foreground mb-1.5 block">
                      Apellidos
                    </label>
                    <Input
                      id="contact-surname"
                      placeholder="Tus apellidos"
                      required
                      className="border-border bg-background focus-visible:ring-accent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-sm font-medium text-foreground mb-1.5 block">
                    Email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    className="border-border bg-background focus-visible:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-sm font-medium text-foreground mb-1.5 block">
                    Teléfono
                  </label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+34 600 000 000"
                    className="border-border bg-background focus-visible:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-sm font-medium text-foreground mb-1.5 block">
                    Mensaje
                  </label>
                  <Textarea
                    id="contact-message"
                    placeholder="Cuéntanos qué te interesa..."
                    rows={3}
                    className="border-border bg-background resize-none focus-visible:ring-accent"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-1">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent"
                  >
                    Enviar mensaje
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden />
                  </Button>
                  <Link
                    href="/citas-visitas"
                    className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
                  >
                    Pedir cita →
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
