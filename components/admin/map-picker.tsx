"use client"

import * as React from "react"
import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

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
 * Map picker with lat/lng text inputs + OpenStreetMap embed preview.
 *
 * Uses `type="text"` with `inputMode="decimal"` instead of `type="number"`
 * to avoid browser number-input quirks (step rounding, value normalization,
 * loss of trailing decimals/zeros, and the useEffect sync loop that would
 * overwrite user input mid-keystroke).
 *
 * Focus tracking prevents the parent→child sync from interfering while
 * the user is actively editing. On blur the value is normalised and any
 * invalid input reverts to the last known-good prop value.
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
  const latFocusedRef = React.useRef(false)
  const lngFocusedRef = React.useRef(false)

  React.useEffect(() => {
    if (!latFocusedRef.current) {
      setLatStr(String(lat))
    }
  }, [lat])

  React.useEffect(() => {
    if (!lngFocusedRef.current) {
      setLngStr(String(lng))
    }
  }, [lng])

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

  const handleLatBlur = () => {
    latFocusedRef.current = false
    const n = parseFloat(latStr)
    if (!Number.isNaN(n) && n >= -90 && n <= 90) {
      setLatStr(String(n))
      onLatLngChange(n, lng)
    } else {
      setLatStr(String(lat))
    }
  }

  const handleLngBlur = () => {
    lngFocusedRef.current = false
    const n = parseFloat(lngStr)
    if (!Number.isNaN(n) && n >= -180 && n <= 180) {
      setLngStr(String(n))
      onLatLngChange(lat, n)
    } else {
      setLngStr(String(lng))
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
            type="text"
            inputMode="decimal"
            value={latStr}
            onChange={(e) => handleLatChange(e.target.value)}
            onFocus={() => { latFocusedRef.current = true }}
            onBlur={handleLatBlur}
            className="mt-1 font-mono text-sm"
            placeholder="40.14199365784348"
            aria-label="Latitud (-90 a 90)"
          />
        </div>
        <div>
          <Label htmlFor="map-lng" className="text-xs text-muted-foreground">
            Longitud
          </Label>
          <Input
            id="map-lng"
            type="text"
            inputMode="decimal"
            value={lngStr}
            onChange={(e) => handleLngChange(e.target.value)}
            onFocus={() => { lngFocusedRef.current = true }}
            onBlur={handleLngBlur}
            className="mt-1 font-mono text-sm"
            placeholder="-3.924643621440974"
            aria-label="Longitud (-180 a 180)"
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
