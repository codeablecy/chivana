"use client"

import * as React from "react"
import { format, addDays, isBefore, isAfter, setHours, setMinutes } from "date-fns"
import { es } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Mail, CalendarPlus } from "lucide-react"

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "16:00",
  "17:00",
  "18:00",
]

/** Generate Google Calendar "Add event" URL. */
function googleCalendarUrl(
  title: string,
  date: Date,
  time: string,
  details: string
): string {
  const [hours, minutes] = time.split(":").map(Number)
  const start = setMinutes(setHours(date, hours), minutes)
  const end = setMinutes(setHours(date, hours + 1), minutes)
  const formatDate = (d: Date) => format(d, "yyyyMMdd'T'HHmmss")
  return [
    "https://calendar.google.com/calendar/render",
    "?action=TEMPLATE",
    `&text=${encodeURIComponent(title)}`,
    `&dates=${formatDate(start)}/${formatDate(end)}`,
    `&details=${encodeURIComponent(details)}`,
  ].join("")
}

export type BookingType = "online" | "office"

interface BookingRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingType: BookingType
}

/**
 * Booking request modal: calendar, time slots, contact form.
 * On submit: success + Google Calendar "Add event" link.
 * Industry-standard appointment UX. Awwwards-inspired.
 */
export function BookingRequestDialog({
  open,
  onOpenChange,
  bookingType,
}: BookingRequestDialogProps) {
  const [step, setStep] = React.useState<"datetime" | "form" | "success">(
    "datetime"
  )
  const [date, setDate] = React.useState<Date | undefined>()
  const [time, setTime] = React.useState<string>("")
  const [form, setForm] = React.useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    mensaje: "",
  })

  const today = new Date()
  const minDate = addDays(today, 1)
  const maxDate = addDays(today, 60)

  const reset = () => {
    setStep("datetime")
    setDate(undefined)
    setTime("")
    setForm({ nombre: "", apellidos: "", email: "", telefono: "", mensaje: "" })
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const handleDateTimeNext = () => {
    if (date && time) setStep("form")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("success")
  }

  const typeLabel =
    bookingType === "online" ? "Visita Online" : "Visita punto de venta"
  const calendarTitle = `Cita Chivana - ${typeLabel}`
  const calendarDetails = [
    `Tipo: ${typeLabel}`,
    `Nombre: ${form.nombre} ${form.apellidos}`,
    `Email: ${form.email}`,
    `Teléfono: ${form.telefono}`,
    form.mensaje ? `Mensaje: ${form.mensaje}` : "",
  ]
    .filter(Boolean)
    .join("\n")

  const gCalUrl =
    date && time
      ? googleCalendarUrl(calendarTitle, date, time, calendarDetails)
      : ""

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">
            Solicitud de reserva — {typeLabel}
          </DialogTitle>
        </DialogHeader>

        {step === "datetime" && (
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Elige fecha</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) =>
                  isBefore(d, minDate) || isAfter(d, maxDate)
                }
                locale={es}
                className="rounded-md border"
              />
            </div>
            <div>
              <Label className="mb-2 block">Elige hora</Label>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      time === slot
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleDateTimeNext}
              disabled={!date || !time}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Continuar
            </Button>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {date && time && (
                <>
                  <strong>
                    {format(date, "EEEE d 'de' MMMM", { locale: es })} a las{" "}
                    {time}
                  </strong>
                </>
              )}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nombre: e.target.value }))
                  }
                  required
                  placeholder="Nombre"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  value={form.apellidos}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, apellidos: e.target.value }))
                  }
                  required
                  placeholder="Apellidos"
                  className="h-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                placeholder="tu@email.com"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={form.telefono}
                onChange={(e) =>
                  setForm((p) => ({ ...p, telefono: e.target.value }))
                }
                placeholder="+34 600 000 000"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                value={form.mensaje}
                onChange={(e) =>
                  setForm((p) => ({ ...p, mensaje: e.target.value }))
                }
                placeholder="Indica si prefieres videollamada, llamada o visita presencial..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("datetime")}
                className="flex-1"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Enviar solicitud
              </Button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="py-4 text-center space-y-4">
            <div className="flex justify-center h-14 w-14 rounded-full bg-primary/10 mx-auto">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              Solicitud enviada
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gracias. Te confirmaremos la cita lo antes posible.
            </p>
            {gCalUrl && (
              <a
                href={gCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <CalendarPlus className="h-4 w-4" />
                Añadir a Google Calendar
              </a>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
