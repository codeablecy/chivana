"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  CheckCircle2, FolderPlus, ChevronRight, ChevronLeft,
  Check, Globe, Link2, Building2, MapPin, Layers, Image as ImageIcon,
} from "lucide-react"
import { addProject } from "@/app/admin/actions"
import { PricingInventoryTable } from "./pricing-inventory-table"
import { ImageUploader } from "./image-uploader"
import { GalleryEditor } from "./gallery-editor"
import type { PricingItem } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Identidad", icon: Building2, description: "Nombre, descripción, ubicación" },
  { id: 2, label: "Inventario", icon: Layers, description: "Tipologías, precios y disponibilidad" },
  { id: 3, label: "Medios", icon: ImageIcon, description: "Hero, galería y tours" },
] as const

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step, maxReached }: { step: number; maxReached: number }) {
  return (
    <div className="flex items-center gap-0 mb-8 select-none">
      {STEPS.map((s, i) => {
        const done = maxReached > s.id
        const active = step === s.id
        const reachable = s.id <= maxReached
        const Icon = s.icon
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all",
                  active && "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                  done && "border-primary bg-primary/10 text-primary",
                  !active && !done && "border-muted-foreground/30 bg-background text-muted-foreground/40",
                )}
              >
                {done ? <Check className="h-4 w-4 stroke-[2.5]" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="text-center hidden sm:block">
                <p className={cn("text-xs font-semibold leading-tight", active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground/50")}>
                  {s.label}
                </p>
                <p className={cn("text-[10px] leading-tight hidden lg:block", active ? "text-muted-foreground" : "text-muted-foreground/40")}>
                  {s.description}
                </p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-3 transition-colors", maxReached > s.id ? "bg-primary/40" : "bg-muted")} />
            )}
          </div>
        )
        void reachable
      })}
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-5 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground text-base">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProjectCreator() {
  const [step, setStep] = useState(1)
  const [maxReached, setMaxReached] = useState(1)
  const [formData, setFormData] = useState({
    name: "", slug: "", tagline: "", description: "",
    address: "", city: "", province: "", postalCode: "",
    lat: "40.14199365784348", lng: "-3.924643621440974",
    totalUnits: "",
  })
  const [heroImage, setHeroImage] = useState("")
  const [galleryPhotos, setGalleryPhotos] = useState<{ src: string; alt: string }[]>([])
  const [tour360Url, setTour360Url] = useState("")
  const [videoEmbedUrl, setVideoEmbedUrl] = useState("")
  const [pricing, setPricing] = useState<PricingItem[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const goTo = useCallback((n: number) => {
    setStep(n)
    setMaxReached((m) => Math.max(m, n))
  }, [])

  function updateField(field: string, value: string) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "name") {
        updated.slug = value.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-").replace(/-+/g, "-").trim()
      }
      return updated
    })
  }

  const totalUnitsFromPricing = pricing.reduce((s, p) => s + p.available + p.sold, 0)
  const totalUnits = Number(formData.totalUnits) || totalUnitsFromPricing || 1

  const step1Valid = formData.name.trim() && formData.slug.trim() && formData.tagline.trim() && formData.description.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // normalise YouTube video URL
    let videoUrl: string | undefined
    if (videoEmbedUrl.trim()) {
      const ytMatch = videoEmbedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/)
      const ytId = ytMatch?.[1]
      videoUrl = ytId
        ? `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0&modestbranding=1`
        : videoEmbedUrl.trim()
    }

    const result = await addProject({
      slug: formData.slug,
      name: formData.name,
      tagline: formData.tagline,
      description: formData.description,
      heroImage: heroImage || galleryPhotos[0]?.src || "/images/exterior.jpg",
      totalUnits,
      pricing: pricing.length > 0 ? pricing : undefined,
      location: {
        address:    formData.address    || undefined,
        city:       formData.city       || undefined,
        province:   formData.province   || undefined,
        postalCode: formData.postalCode || undefined,
        lat:        parseFloat(formData.lat) || undefined,
        lng:        parseFloat(formData.lng) || undefined,
      },
      galleryPhotos: galleryPhotos.length > 0 ? galleryPhotos : undefined,
      galleryTour360: tour360Url.trim() ? [{ url: tour360Url.trim() }] : undefined,
      galleryVideos: videoUrl ? [{ src: "", alt: "Vídeo del proyecto", url: videoUrl }] : undefined,
    })

    if (result.success) {
      setSubmitted(true)
      toast.success("Proyecto creado", { description: `"${formData.name}" añadido correctamente.` })
    } else {
      toast.error("El slug ya está en uso", { description: "Cambia el nombre del proyecto." })
    }
    setLoading(false)
  }

  function reset() {
    setSubmitted(false); setStep(1); setMaxReached(1)
    setFormData({ name: "", slug: "", tagline: "", description: "", address: "", city: "", province: "", postalCode: "", lat: "40.14199365784348", lng: "-3.924643621440974", totalUnits: "" })
    setHeroImage(""); setGalleryPhotos([]); setTour360Url(""); setVideoEmbedUrl(""); setPricing([])
  }

  // ── Success ──────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-border max-w-md mx-auto">
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 ring-8 ring-primary/5 mx-auto mb-5">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">¡Proyecto Creado!</h3>
        <p className="text-muted-foreground text-sm mb-2">
          <strong className="text-foreground">{formData.name}</strong> está listo con estado <span className="text-accent font-medium">Próximamente</span>.
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          Edita el proyecto desde <strong>Inventario</strong> para añadir más medios o datos.
        </p>
        <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <FolderPlus className="h-4 w-4 mr-2" />
          Crear Otro Proyecto
        </Button>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">Crear Nuevo Proyecto</h2>
        <p className="text-sm text-muted-foreground mt-1">Configura el proyecto en 3 pasos y publícalo desde el panel.</p>
      </div>

      <Stepper step={step} maxReached={maxReached} />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">

        {/* ══ STEP 1 ══ */}
        {step === 1 && (
          <>
            <StepCard title="Identidad del proyecto" subtitle="Nombre, descripción y posicionamiento en la web">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Nombre del Proyecto <span className="text-destructive">*</span></Label>
                  <Input id="name" value={formData.name} onChange={(e) => updateField("name", e.target.value)}
                    placeholder="El Mirador del Viso — Fase III" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL) <span className="text-destructive">*</span></Label>
                  <Input id="slug" value={formData.slug} onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="viso-3" required className="mt-1.5 font-mono text-sm" />
                  {formData.slug && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      /proyectos/<strong>{formData.slug}</strong>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="tagline">Subtítulo / Tagline <span className="text-destructive">*</span></Label>
                <Input id="tagline" value={formData.tagline} onChange={(e) => updateField("tagline", e.target.value)}
                  placeholder="Viviendas de lujo en entorno natural privilegiado" required className="mt-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Descripción <span className="text-destructive">*</span></Label>
                  <span className="text-xs text-muted-foreground">{formData.description.length} / 800</span>
                </div>
                <Textarea id="description" value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Descripción completa del proyecto, sus valores, arquitectura y entorno..."
                  rows={4} required maxLength={800} className="mt-1.5 resize-none" />
              </div>
            </StepCard>

            <StepCard title="Ubicación" subtitle="Dirección y coordenadas para el mapa interactivo">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address" className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Dirección
                  </Label>
                  <Input id="address" value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Urb. Apr 19, 1P" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="El Viso de San Juan" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="province">Provincia</Label>
                  <Input id="province" value={formData.province}
                    onChange={(e) => updateField("province", e.target.value)}
                    placeholder="La Sagra, Toledo" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-muted-foreground text-xs">Código postal</Label>
                  <Input id="postalCode" value={formData.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    placeholder="45215" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="lat" className="text-muted-foreground text-xs">Latitud</Label>
                  <Input id="lat" value={formData.lat} onChange={(e) => updateField("lat", e.target.value)}
                    placeholder="40.14199" className="mt-1 font-mono text-sm" />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-muted-foreground text-xs">Longitud</Label>
                  <Input id="lng" value={formData.lng} onChange={(e) => updateField("lng", e.target.value)}
                    placeholder="-3.92464" className="mt-1 font-mono text-sm" />
                </div>
              </div>
            </StepCard>

            <div className="flex justify-end">
              <Button type="button" onClick={() => goTo(2)} disabled={!step1Valid}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[160px]">
                Siguiente: Inventario
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* ══ STEP 2 ══ */}
        {step === 2 && (
          <>
            <StepCard title="Inventario de tipologías" subtitle="Añade tipologías con precios, superficies y disponibilidad">
              <div className="sm:w-52">
                <Label htmlFor="totalUnits">Total viviendas (opcional)</Label>
                <Input id="totalUnits" type="number" min="1"
                  value={formData.totalUnits || totalUnits}
                  onChange={(e) => updateField("totalUnits", e.target.value)}
                  placeholder={String(totalUnits)} className="mt-1.5" />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-calculado desde inventario: <strong>{totalUnitsFromPricing}</strong>
                </p>
              </div>
              <PricingInventoryTable
                items={pricing} localOnly onLocalChange={setPricing}
                addButtonLabel="Añadir tipología"
                projectSlug={formData.slug}
              />
            </StepCard>

            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" onClick={() => goTo(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Atrás
              </Button>
              <Button type="button" onClick={() => goTo(3)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px]">
                Siguiente: Medios
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* ══ STEP 3 ══ */}
        {step === 3 && (
          <>
            {/* Hero image */}
            <StepCard title="Imagen principal (Hero)" subtitle="Esta imagen aparece en la tarjeta del proyecto y como cabecera">
              {!formData.slug ? (
                <div className="rounded-xl border border-dashed border-muted-foreground/25 py-10 text-center">
                  <p className="text-sm text-muted-foreground">Define el nombre del proyecto en el Paso 1 antes de subir imágenes.</p>
                </div>
              ) : (
                <ImageUploader
                  value={heroImage}
                  onChange={setHeroImage}
                  context="project"
                  slug={formData.slug}
                  category="hero"
                  label="Subir imagen principal"
                />
              )}
              {heroImage && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  Imagen seleccionada como hero
                </div>
              )}
            </StepCard>

            {/* Gallery photos */}
            <StepCard title="Galería de fotos" subtitle="Sube las imágenes del proyecto. La primera foto sin hero explícito usará la primera imagen.">
              {!formData.slug ? (
                <div className="rounded-xl border border-dashed border-muted-foreground/25 py-8 text-center">
                  <p className="text-sm text-muted-foreground">Necesitas definir el nombre del proyecto primero.</p>
                </div>
              ) : (
                <GalleryEditor
                  photos={galleryPhotos}
                  heroImage={heroImage}
                  onReorder={setGalleryPhotos}
                  onHeroChange={setHeroImage}
                  projectSlug={formData.slug}
                />
              )}
            </StepCard>

            {/* Video embed */}
            <StepCard title="Vídeo del proyecto" subtitle="Enlace de YouTube o Vimeo. Se mostrará en la pestaña Vídeos de la galería.">
              <div className="space-y-2">
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="https://www.youtube.com/watch?v=... o youtu.be/..."
                    value={videoEmbedUrl}
                    onChange={(e) => setVideoEmbedUrl(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {videoEmbedUrl && (() => {
                  const m = videoEmbedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/)
                  const id = m?.[1]
                  if (!id) return null
                  return (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                      <div className="relative h-12 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                          alt="YouTube preview"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">YouTube · {id}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{videoEmbedUrl}</p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </StepCard>

            {/* Tour 360° */}
            <StepCard title="Tour 360°" subtitle="Embed de Matterport, Wizio u otra plataforma. Puedes añadir más después.">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="url"
                  placeholder="https://my.matterport.com/show/?m=..."
                  value={tour360Url}
                  onChange={(e) => setTour360Url(e.target.value)}
                  className="pl-9"
                />
              </div>
            </StepCard>

            <div className="flex items-center justify-between pt-1">
              <Button type="button" variant="outline" onClick={() => goTo(2)}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Atrás
              </Button>
              <Button type="submit" disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[160px] shadow-lg shadow-primary/20">
                <FolderPlus className="h-4 w-4 mr-2" />
                {loading ? "Creando proyecto…" : "Crear Proyecto"}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
