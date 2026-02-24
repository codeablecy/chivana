import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Citas y Visitas | Chivana Real Estate",
  description:
    "Visítanos o reserva cita en línea. Visita online por videollamada o en nuestra oficina de ventas en El Viso de San Juan.",
}

export default function CitasVisitasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
