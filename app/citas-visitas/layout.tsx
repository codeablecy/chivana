import type { Metadata } from "next"
import { seo } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Citas y Visitas",
  description:
    "Visítanos o reserva cita en línea. Visita online por videollamada o en nuestra oficina de ventas en El Viso de San Juan.",
  alternates: { canonical: "/citas-visitas" },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: "/citas-visitas",
    siteName: seo.siteName,
    title: "Citas y Visitas",
    description:
      "Visítanos o reserva cita en línea. Visita online por videollamada o en nuestra oficina de ventas en El Viso de San Juan.",
  },
}

export default function CitasVisitasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
