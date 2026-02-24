"use client"

import * as React from "react"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const DEFAULT_LAT = 40.0716
const DEFAULT_LNG = -3.9397

function latLngToBbox(lat: number, lng: number, zoom = 0.01) {
  return `${lng - zoom},${lat - zoom},${lng + zoom},${lat + zoom}`
}

export interface MapPickerProps {
  lat: number
  lng: number
  onLatLngChange: (lat: number, lng: number) => void
  className?: string
  height?: number
}

/**
 * Map picker: lat/lng inputs + OpenStreetMap embed preview.
 * Coordinates update the map in real-time. For precise placement, copy coordinates from a map service.
 */
export function MapPicker({
  lat,
  lng,
  onLatLngChange,
  className,
  height = 200,
}: MapPickerProps) {
  const [latStr, setLatStr] = React.useState(String(lat))
  const [lngStr, setLngStr] = React.useState(String(lng))

  React.useEffect(() => {
    setLatStr(String(lat))
    setLngStr(String(lng))
  }, [lat, lng])

  const handleLatChange = (v: string) => {
    setLatStr(v)
    const n = parseFloat(v)
    if (!Number.isNaN(n) && n >= -90 && n <= 90) {
      onLatLngChange(n, lng)
    }
  }

  const handleLngChange = (v: string) => {
    setLngStr(v)
    const n = parseFloat(v)
    if (!Number.isNaN(n) && n >= -180 && n <= 180) {
      onLatLngChange(lat, n)
    }
  }

  const bbox = latLngToBbox(lat, lng)
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="map-lat" className="text-xs text-muted-foreground">
            Latitud
          </Label>
          <Input
            id="map-lat"
            type="number"
            step="0.0001"
            value={latStr}
            onChange={(e) => handleLatChange(e.target.value)}
            className="mt-1"
            placeholder="40.0716"
          />
        </div>
        <div>
          <Label htmlFor="map-lng" className="text-xs text-muted-foreground">
            Longitud
          </Label>
          <Input
            id="map-lng"
            type="number"
            step="0.0001"
            value={lngStr}
            onChange={(e) => handleLngChange(e.target.value)}
            className="mt-1"
            placeholder="-3.9397"
          />
        </div>
      </div>
      <div className="rounded-lg overflow-hidden border border-border">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">
            Vista previa — Ajusta coordenadas arriba
          </span>
        </div>
        <iframe
          title="Mapa"
          src={embedUrl}
          width="100%"
          height={height}
          className="border-0"
          loading="lazy"
        />
      </div>
    </div>
  )
}
