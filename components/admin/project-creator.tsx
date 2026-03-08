"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, FolderPlus, ChevronRight, ChevronLeft } from "lucide-react"
import { addProject } from "@/app/admin/actions"
import { PricingInventoryTable } from "./pricing-inventory-table"
import type { PricingItem } from "@/lib/types"
import { toast } from "sonner"

const STEPS = [
  { id: 1, label: "Identidad y ubicación", description: "Nombre, descripción, mapa" },
  { id: 2, label: "Inventario", description: "Tipologías, precios y unidades" },
  { id: 3, label: "Medios", description: "Imagen hero y galería" },
] as const

export function ProjectCreator() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    heroImage: "/images/exterior.jpg",
    totalUnits: "",
    address: "",
    city: "El Viso de San Juan",
    lat: "40.0716",
    lng: "-3.9397",
  })
  const [pricing, setPricing] = useState<PricingItem[]>([])
  const [galleryPhotos, setGalleryPhotos] = useState<{ src: string; alt: string }[]>([])
  const [tour360Url, setTour360Url] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  function updateField(field: string, value: string) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "name") updated.slug = generateSlug(value)
      return updated
    })
  }

  const totalUnitsFromPricing = pricing.reduce(
    (s, p) => s + p.available + p.sold,
    0
  )
  const totalUnits = Number(formData.totalUnits) || totalUnitsFromPricing || 1

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await addProject({
      slug: formData.slug,
      name: formData.name,
      tagline: formData.tagline,
      description: formData.description,
      heroImage: formData.heroImage,
      totalUnits,
      pricing: pricing.length > 0 ? pricing : undefined,
      location: {
        address: formData.address || undefined,
        city: formData.city || undefined,
        lat: parseFloat(formData.lat) || undefined,
        lng: parseFloat(formData.lng) || undefined,
      },
      galleryPhotos:
        galleryPhotos.length > 0 ? galleryPhotos : undefined,
      galleryTour360: tour360Url.trim()
        ? [{ url: tour360Url.trim() }]
        : undefined,
    })

    if (result.success) {
      setSubmitted(true)
      toast.success("Proyecto creado", {
        description: `"${formData.name}" ha sido añadido correctamente.`,
      })
    } else {
      setError("Ya existe un proyecto con ese slug. Usa otro nombre.")
      toast.error("Error al crear", { description: "El slug ya está en uso." })
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-16 bg-card rounded-xl border border-border">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-2">
          Proyecto Creado
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          El proyecto <strong>{formData.name}</strong> ha sido creado con estado
          &quot;Proximamente&quot;.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false)
            setStep(1)
            setFormData({
              name: "",
              slug: "",
              tagline: "",
              description: "",
              heroImage: "/images/exterior.jpg",
              totalUnits: "",
              address: "",
              city: "El Viso de San Juan",
              lat: "40.0716",
              lng: "-3.9397",
            })
            setPricing([])
            setGalleryPhotos([])
            setTour360Url("")
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Crear Otro Proyecto
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
          Crear Nuevo Proyecto
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Formulario en varios pasos para añadir un nuevo proyecto.
        </p>
      </div>

      {/* Stepper indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                step === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-current/20 text-xs">
                {s.id}
              </span>
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="bg-card rounded-xl border border-border p-6 lg:p-8 max-w-2xl space-y-5">
            <h3 className="font-semibold text-foreground">Identidad y ubicación</h3>
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="name">Nombre del Proyecto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Ej: El Mirador del Viso - Fase III"
                  required
                  className="mt-1.5"
                />
              </div>
              <div className="sm:w-48">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="viso-3"
                  required
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tagline">Subtítulo</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="Frase destacada del proyecto"
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Descripción detallada del proyecto..."
                rows={4}
                required
                className="mt-1.5 resize-none"
              />
            </div>
            <div>
              <Label>Ubicación (Mapa)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1.5">
                <div>
                  <Label htmlFor="address" className="text-xs text-muted-foreground">
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Cuesta de la Higuera, 19"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-xs text-muted-foreground">
                    Ciudad
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="El Viso de San Juan"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lat" className="text-xs text-muted-foreground">
                    Latitud
                  </Label>
                  <Input
                    id="lat"
                    type="text"
                    value={formData.lat}
                    onChange={(e) => updateField("lat", e.target.value)}
                    placeholder="40.0716"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-xs text-muted-foreground">
                    Longitud
                  </Label>
                  <Input
                    id="lng"
                    type="text"
                    value={formData.lng}
                    onChange={(e) => updateField("lng", e.target.value)}
                    placeholder="-3.9397"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setStep(2)}
              className="bg-primary text-primary-foreground"
            >
              Siguiente: Inventario
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Dynamic Inventory */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground">
                Inventario de tipologías
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Añade las tipologías de vivienda con sus precios y disponibilidad.
                El total de viviendas se calcula automáticamente o puede definirse manualmente.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="sm:w-48">
                <Label htmlFor="totalUnits">Total viviendas (opcional)</Label>
                <Input
                  id="totalUnits"
                  type="number"
                  min="1"
                  value={formData.totalUnits || totalUnits}
                  onChange={(e) => updateField("totalUnits", e.target.value)}
                  placeholder={String(totalUnits)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto: {totalUnitsFromPricing} desde inventario
                </p>
              </div>
            </div>
            <PricingInventoryTable
              items={pricing}
              localOnly
              onLocalChange={setPricing}
              addButtonLabel="Añadir tipología"
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Atrás
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="bg-primary text-primary-foreground"
              >
                Siguiente: Medios
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Media & Gallery */}
        {step === 3 && (
          <div className="bg-card rounded-xl border border-border p-6 lg:p-8 max-w-2xl space-y-5">
            <h3 className="font-semibold text-foreground">Medios y galería</h3>
            <p className="text-sm text-muted-foreground">
              Imagen principal del proyecto. La galería puede añadirse después desde el inventario.
            </p>
            <div>
              <Label htmlFor="heroImage">Imagen hero (ruta)</Label>
              <Input
                id="heroImage"
                value={formData.heroImage}
                onChange={(e) => updateField("heroImage", e.target.value)}
                placeholder="/images/hero.jpg"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ruta relativa en /public
              </p>
            </div>
            <div>
              <Label htmlFor="tour360Url">Tour 360°</Label>
              <Input
                id="tour360Url"
                type="url"
                value={tour360Url}
                onChange={(e) => setTour360Url(e.target.value)}
                placeholder="https://... (Matterport, Wizio, etc.)"
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional. URL de embed del tour 360° (Matterport, Wizio u otra
                plataforma). Puedes añadir más en el editor → Medios → Tour 360°.
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                Galería (opcional, añadir después en el inventario)
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Las fotos de galería se pueden configurar desde el gestor de
                inventario una vez creado el proyecto.
              </p>
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Atrás
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                {loading ? "Creando..." : "Crear Proyecto"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
