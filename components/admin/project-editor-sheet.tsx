"use client";

import {
  deleteProject,
  saveProjectAmenities,
  saveProjectDistances,
  saveProjectFeatures,
  saveProjectQualities,
  updateGallery,
  updateHeroImage,
  updateHeroVideo,
  updateProjectFull,
} from "@/app/admin/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Amenity, Project } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { GalleryEditor } from "./gallery-editor";
import { MapPicker } from "./map-picker";
import { MediaSectionEditor } from "./media-section-editor";
import { TagInput } from "./tag-input";

const AMENITY_TYPES: { value: Amenity["type"]; label: string }[] = [
  { value: "education", label: "Educación" },
  { value: "health", label: "Salud" },
  { value: "transport", label: "Transporte" },
  { value: "shopping", label: "Compras" },
  { value: "leisure", label: "Ocio" },
];

import { PROJECT_ICON_OPTIONS } from "@/lib/project-icons";

const SUGGESTED_TAGS = [
  "En Construcción",
  "Últimas Unidades",
  "Proximamente",
  "Piscina",
  "Gimnasio",
  "Seguridad",
  "Jardín",
];

const STATUS_OPTIONS: { value: Project["status"]; label: string }[] = [
  { value: "coming-soon", label: "Proximamente" },
  { value: "active", label: "En Venta" },
  { value: "sold-out", label: "Agotado" },
];

export interface ProjectEditorSheetProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Full project edit form with live preview and floating action bar. */
export function ProjectEditorSheet({
  project,
  open,
  onOpenChange,
}: ProjectEditorSheetProps) {
  const router = useRouter();
  const tabsAnchorRef = React.useRef<HTMLDivElement | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState("");
  const [form, setForm] = React.useState({
    name: project.name,
    tagline: project.tagline,
    description: project.description,
    status: project.status,
    totalUnits: String(project.totalUnits),
    constructionStartDate: project.constructionStartDate ?? "",
    constructionEndDate: project.constructionEndDate ?? "",
    mapEmbedUrl: project.mapEmbedUrl ?? "",
    address: project.location.address,
    city: project.location.city,
    province: project.location.province,
    postalCode: project.location.postalCode,
    lat: project.location.lat,
    lng: project.location.lng,
    tags: [...project.tags],
    galleryPhotos: [...project.gallery.photos],
    galleryConstruction: [...(project.gallery.construction ?? [])],
    galleryVideos: [...(project.gallery.videos ?? [])],
    galleryTour360: [...(project.gallery.tour360 ?? [])],
    galleryParcela: [...(project.gallery.parcela ?? [])],
    heroImage: project.heroImage,
    heroVideoUrl: project.heroVideoUrl ?? "",
    heroVirtualTourUrl: project.heroVirtualTourUrl ?? "",
    showPricingTable: project.showPricingTable,
    amenities: [...project.location.amenities],
    distances: [...project.location.distances],
    features: [...project.features],
    qualities: [...project.qualities],
  });

  React.useEffect(() => {
    if (open) {
      setForm({
        name: project.name,
        tagline: project.tagline,
        description: project.description,
        status: project.status,
        totalUnits: String(project.totalUnits),
        constructionStartDate: project.constructionStartDate ?? "",
        constructionEndDate: project.constructionEndDate ?? "",
        mapEmbedUrl: project.mapEmbedUrl ?? "",
        address: project.location.address,
        city: project.location.city,
        province: project.location.province,
        postalCode: project.location.postalCode,
        lat: project.location.lat,
        lng: project.location.lng,
        tags: [...project.tags],
        galleryPhotos: [...project.gallery.photos],
        galleryConstruction: [...(project.gallery.construction ?? [])],
        galleryVideos: [...(project.gallery.videos ?? [])],
        galleryTour360: [...(project.gallery.tour360 ?? [])],
        galleryParcela: [...(project.gallery.parcela ?? [])],
        heroImage: project.heroImage,
        heroVideoUrl: project.heroVideoUrl ?? "",
        heroVirtualTourUrl: project.heroVirtualTourUrl ?? "",
        showPricingTable: project.showPricingTable,
        amenities: [...project.location.amenities],
        distances: [...project.location.distances],
        features: [...project.features],
        qualities: [...project.qualities],
      });
    }
  }, [open, project]);

  const isDirty = React.useMemo(() => {
    return (
      form.name !== project.name ||
      form.tagline !== project.tagline ||
      form.description !== project.description ||
      form.status !== project.status ||
      form.totalUnits !== String(project.totalUnits) ||
      form.constructionStartDate !== (project.constructionStartDate ?? "") ||
      form.constructionEndDate !== (project.constructionEndDate ?? "") ||
      form.mapEmbedUrl !== (project.mapEmbedUrl ?? "") ||
      form.address !== project.location.address ||
      form.city !== project.location.city ||
      form.province !== project.location.province ||
      form.postalCode !== project.location.postalCode ||
      form.lat !== project.location.lat ||
      form.lng !== project.location.lng ||
      JSON.stringify(form.tags) !== JSON.stringify(project.tags) ||
      JSON.stringify(form.galleryPhotos) !==
        JSON.stringify(project.gallery.photos) ||
      JSON.stringify(form.galleryConstruction) !==
        JSON.stringify(project.gallery.construction ?? []) ||
      JSON.stringify(form.galleryVideos) !==
        JSON.stringify(project.gallery.videos ?? []) ||
      JSON.stringify(form.galleryTour360) !==
        JSON.stringify(project.gallery.tour360 ?? []) ||
      JSON.stringify(form.galleryParcela) !==
        JSON.stringify(project.gallery.parcela ?? []) ||
      form.heroImage !== project.heroImage ||
      form.heroVideoUrl !== (project.heroVideoUrl ?? "") ||
      form.heroVirtualTourUrl !== (project.heroVirtualTourUrl ?? "") ||
      form.showPricingTable !== project.showPricingTable ||
      JSON.stringify(form.amenities) !==
        JSON.stringify(project.location.amenities) ||
      JSON.stringify(form.distances) !==
        JSON.stringify(project.location.distances) ||
      JSON.stringify(form.features) !== JSON.stringify(project.features) ||
      JSON.stringify(form.qualities) !== JSON.stringify(project.qualities)
    );
  }, [form, project]);

  const update = (partial: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const handleDiscard = () => {
    setForm({
      name: project.name,
      tagline: project.tagline,
      description: project.description,
      status: project.status,
      totalUnits: String(project.totalUnits),
      constructionStartDate: project.constructionStartDate ?? "",
      constructionEndDate: project.constructionEndDate ?? "",
      mapEmbedUrl: project.mapEmbedUrl ?? "",
      address: project.location.address,
      city: project.location.city,
      province: project.location.province,
      postalCode: project.location.postalCode,
      lat: project.location.lat,
      lng: project.location.lng,
      tags: [...project.tags],
      galleryPhotos: [...project.gallery.photos],
      galleryConstruction: [...(project.gallery.construction ?? [])],
      galleryVideos: [...(project.gallery.videos ?? [])],
      galleryTour360: [...(project.gallery.tour360 ?? [])],
      galleryParcela: [...(project.gallery.parcela ?? [])],
      heroImage: project.heroImage,
      heroVideoUrl: project.heroVideoUrl ?? "",
      heroVirtualTourUrl: project.heroVirtualTourUrl ?? "",
      showPricingTable: project.showPricingTable,
      amenities: [...project.location.amenities],
      distances: [...project.location.distances],
      features: [...project.features],
      qualities: [...project.qualities],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateResult = await updateProjectFull(project.slug, {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        status: form.status,
        totalUnits: parseInt(form.totalUnits, 10) || project.totalUnits,
        constructionStartDate: form.constructionStartDate || undefined,
        constructionEndDate: form.constructionEndDate || undefined,
        mapEmbedUrl: form.mapEmbedUrl || undefined,
        location: {
          address: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          lat: form.lat,
          lng: form.lng,
        },
        tags: form.tags,
        // Important: when the user clears the input we must persist NULL in DB.
        // Passing `undefined` means "keep existing". Passing `""` will become NULL in the store layer.
        heroVirtualTourUrl: form.heroVirtualTourUrl.trim(),
        showPricingTable: form.showPricingTable,
      });
      if (!updateResult.success) {
        toast.error("Error al guardar", {
          description: "No se pudieron guardar los datos del proyecto.",
        });
        return;
      }
      const galleryChanged =
        JSON.stringify(form.galleryPhotos) !==
          JSON.stringify(project.gallery.photos) ||
        JSON.stringify(form.galleryConstruction) !==
          JSON.stringify(project.gallery.construction ?? []) ||
        JSON.stringify(form.galleryVideos) !==
          JSON.stringify(project.gallery.videos ?? []) ||
        JSON.stringify(form.galleryTour360) !==
          JSON.stringify(project.gallery.tour360 ?? []) ||
        JSON.stringify(form.galleryParcela) !==
          JSON.stringify(project.gallery.parcela ?? []);
      if (galleryChanged) {
        await updateGallery(
          project.slug,
          form.galleryPhotos,
          form.galleryConstruction,
          form.galleryVideos,
          form.galleryTour360,
          form.galleryParcela,
        );
      }
      if (form.heroImage !== project.heroImage) {
        await updateHeroImage(project.slug, form.heroImage);
      }
      if (form.heroVideoUrl !== (project.heroVideoUrl ?? "")) {
        await updateHeroVideo(project.slug, form.heroVideoUrl);
      }
      if (
        JSON.stringify(form.amenities) !==
        JSON.stringify(project.location.amenities)
      ) {
        await saveProjectAmenities(project.slug, form.amenities);
      }
      if (
        JSON.stringify(form.distances) !==
        JSON.stringify(project.location.distances)
      ) {
        await saveProjectDistances(project.slug, form.distances);
      }
      if (JSON.stringify(form.features) !== JSON.stringify(project.features)) {
        await saveProjectFeatures(project.slug, form.features);
      }
      if (
        JSON.stringify(form.qualities) !== JSON.stringify(project.qualities)
      ) {
        await saveProjectQualities(project.slug, form.qualities);
      }
      toast.success("Proyecto actualizado", {
        description: "Los cambios se han guardado correctamente.",
      });
      router.refresh();
      onOpenChange(false);
    } catch {
      toast.error("Error al guardar", {
        description: "No se pudieron guardar los cambios.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== project.name) return;
    setSaving(true);
    try {
      const res = await deleteProject(project.slug);
      if (res.success) {
        toast.success("Proyecto eliminado");
        onOpenChange(false);
        await router.push("/projects");
        router.refresh();
      } else {
        toast.error("No se pudo eliminar el proyecto");
      }
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setSaving(false);
      setDeleteConfirm("");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-4xl flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>
            <span className="flex flex-col gap-0.5">
              <span>Editar proyecto</span>
              <span className="text-xs font-normal text-muted-foreground">
                Edit project
              </span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-4 space-y-6">
            {/* Live preview */}
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Vista previa{" "}
                <span className="normal-case text-[11px] text-muted-foreground/80">
                  (Preview)
                </span>
              </p>
              <div className="flex items-end gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-xl font-bold truncate">
                    {form.name || "Nombre del proyecto"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {form.tagline || "Slogan"}
                  </p>
                  {form.city && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {form.city}
                      {form.province && `, ${form.province}`}
                    </p>
                  )}
                </div>
                {form.heroImage && (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={form.heroImage}
                      alt=""
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <Tabs
              defaultValue="core"
              className="w-full"
              onValueChange={() => {
                tabsAnchorRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <TabsList
                ref={tabsAnchorRef}
                className="grid w-full grid-cols-2 sm:grid-cols-4 scroll-mt-2"
              >
                <TabsTrigger value="core">
                  Core{" "}
                  <span className="ml-1 text-[11px] text-muted-foreground">
                    (Core details)
                  </span>
                </TabsTrigger>
                <TabsTrigger value="location">
                  Ubicación{" "}
                  <span className="ml-1 text-[11px] text-muted-foreground">
                    (Location)
                  </span>
                </TabsTrigger>
                <TabsTrigger value="specs">
                  Especificaciones{" "}
                  <span className="ml-1 text-[11px] text-muted-foreground">
                    (Specifications)
                  </span>
                </TabsTrigger>
                <TabsTrigger value="media">
                  Medios{" "}
                  <span className="ml-1 text-[11px] text-muted-foreground">
                    (Media)
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="core" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">
                    Nombre{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Project name)
                    </span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="Nombre del proyecto"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">
                    Slogan{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Tagline)
                    </span>
                  </Label>
                  <Input
                    id="tagline"
                    value={form.tagline}
                    onChange={(e) => update({ tagline: e.target.value })}
                    placeholder="Casas exclusivas..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">
                    Descripción{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Project description)
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                    placeholder="Descripción del proyecto"
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>
                    Etiquetas (amenidades){" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Highlight tags)
                    </span>
                  </Label>
                  <TagInput
                    value={form.tags}
                    onChange={(tags) => update({ tags })}
                    suggestedTags={SUGGESTED_TAGS}
                    placeholder="Piscina, Gimnasio..."
                    className="mt-1"
                  />
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4 mt-4">
                <p className="text-xs text-muted-foreground">
                  Dirección, ciudad y provincia se muestran en la barra inferior
                  de la ficha del proyecto (sección Ubicación).{" "}
                  <span className="text-[11px] text-muted-foreground/80">
                    (Address, city and province are shown in the lower bar of
                    the project detail page.)
                  </span>
                </p>
                <div>
                  <Label htmlFor="address">
                    Dirección{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Address)
                    </span>
                  </Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="Calle, número"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">
                      Ciudad{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (City)
                      </span>
                    </Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => update({ city: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">
                      Provincia{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (Province)
                      </span>
                    </Label>
                    <Input
                      id="province"
                      value={form.province}
                      onChange={(e) => update({ province: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="postalCode">
                    Código postal{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Postcode)
                    </span>
                  </Label>
                  <Input
                    id="postalCode"
                    value={form.postalCode}
                    onChange={(e) => update({ postalCode: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <MapPicker
                  lat={form.lat}
                  lng={form.lng}
                  onLatLngChange={(lat, lng) => update({ lat, lng })}
                />
                <div>
                  <Label htmlFor="mapEmbedUrl">
                    URL de Google Maps (embed){" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Google Maps embed URL)
                    </span>
                  </Label>
                  <Input
                    id="mapEmbedUrl"
                    value={form.mapEmbedUrl}
                    onChange={(e) => update({ mapEmbedUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?..."
                    className="mt-1"
                  />
                </div>

                <Separator />

                {/* Distances */}
                <div>
                  <Label className="mb-2 block">
                    Distancias clave{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Key distances)
                    </span>
                  </Label>
                  <div className="space-y-2">
                    {form.distances.map((d, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={d}
                          onChange={(e) => {
                            const next = [...form.distances];
                            next[i] = e.target.value;
                            update({ distances: next });
                          }}
                          placeholder="35 km a Madrid centro"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-destructive shrink-0"
                          onClick={() =>
                            update({
                              distances: form.distances.filter(
                                (_, j) => j !== i,
                              ),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        update({ distances: [...form.distances, ""] })
                      }
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Añadir distancia
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Amenities */}
                <div>
                  <Label className="mb-2 block">
                    Servicios Cercanos{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Nearby services)
                    </span>
                  </Label>
                  <div className="space-y-2">
                    {form.amenities.map((a, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_18ch_auto_auto] gap-2 items-center"
                      >
                        <Input
                          value={a.name}
                          onChange={(e) => {
                            const next = [...form.amenities];
                            next[i] = { ...next[i], name: e.target.value };
                            update({ amenities: next });
                          }}
                          placeholder="Centro de Salud"
                        />
                        <Input
                          value={a.distance}
                          onChange={(e) => {
                            const next = [...form.amenities];
                            next[i] = { ...next[i], distance: e.target.value };
                            update({ amenities: next });
                          }}
                          placeholder="800 m"
                        />
                        <Select
                          value={a.type}
                          onValueChange={(v) => {
                            const next = [...form.amenities];
                            next[i] = {
                              ...next[i],
                              type: v as Amenity["type"],
                            };
                            update({ amenities: next });
                          }}
                        >
                          <SelectTrigger className="w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AMENITY_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() =>
                            update({
                              amenities: form.amenities.filter(
                                (_, j) => j !== i,
                              ),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        update({
                          amenities: [
                            ...form.amenities,
                            {
                              name: "",
                              distance: "",
                              type: "education" as Amenity["type"],
                            },
                          ],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Añadir servicio
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="specs"
                className="space-y-4 mt-4 min-w-0 overflow-hidden"
              >
                <div>
                  <Label htmlFor="status">
                    Estado{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Sales status)
                    </span>
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      update({ status: v as Project["status"] })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="totalUnits">
                    Total de unidades{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Total units)
                    </span>
                  </Label>
                  <Input
                    id="totalUnits"
                    type="number"
                    min={1}
                    value={form.totalUnits}
                    onChange={(e) => update({ totalUnits: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="constructionStart">
                    Inicio construcción{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Construction start)
                    </span>
                  </Label>
                  <Input
                    id="constructionStart"
                    value={form.constructionStartDate}
                    onChange={(e) =>
                      update({ constructionStartDate: e.target.value })
                    }
                    placeholder="Enero 2024"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="constructionEnd">
                    Fin construcción{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Construction end)
                    </span>
                  </Label>
                  <Input
                    id="constructionEnd"
                    value={form.constructionEndDate}
                    onChange={(e) =>
                      update({ constructionEndDate: e.target.value })
                    }
                    placeholder="Julio 2026"
                    className="mt-1"
                  />
                </div>

                <div className="flex flex-row items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <div className="min-w-0 space-y-1 pr-2">
                    <Label htmlFor="show-pricing" className="text-sm font-medium">
                      Mostrar tabla de precios
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Igual que publicar en el blog: la sección &quot;Los Precios&quot;
                      solo aparece si está activa.
                    </p>
                  </div>
                  <Switch
                    id="show-pricing"
                    checked={form.showPricingTable}
                    onCheckedChange={(v) => update({ showPricingTable: v })}
                  />
                </div>

                <Separator />

                {/* Features (USPs) */}
                <div className="min-w-0">
                  <Label className="mb-2 block">
                    Puntos fuertes{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Key selling points)
                    </span>
                  </Label>
                  <div className="space-y-2">
                    {form.features.map((f, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[9rem_minmax(0,1fr)_auto] gap-2 items-start"
                      >
                        <Select
                          value={f.icon}
                          onValueChange={(v) => {
                            const next = [...form.features];
                            next[i] = { ...next[i], icon: v };
                            update({ features: next });
                          }}
                        >
                          <SelectTrigger className="text-xs w-full max-w-[9rem]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_ICON_OPTIONS.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                <div className="flex items-center gap-2">
                                  <opt.Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                  <span>{opt.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="min-w-0 grid grid-cols-2 gap-2">
                          <Input
                            value={f.title}
                            onChange={(e) => {
                              const next = [...form.features];
                              next[i] = { ...next[i], title: e.target.value };
                              update({ features: next });
                            }}
                            placeholder="Luminosas"
                            className="min-w-0"
                          />
                          <Input
                            value={f.description}
                            onChange={(e) => {
                              const next = [...form.features];
                              next[i] = {
                                ...next[i],
                                description: e.target.value,
                              };
                              update({ features: next });
                            }}
                            placeholder="Descripción breve"
                            className="min-w-0"
                          />
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-destructive shrink-0"
                          onClick={() =>
                            update({
                              features: form.features.filter((_, j) => j !== i),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        update({
                          features: [
                            ...form.features,
                            { title: "", description: "", icon: "Sun" },
                          ],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Añadir punto fuerte
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Qualities */}
                <div className="min-w-0">
                  <Label className="mb-2 block">
                    Memoria de Calidades{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (Specifications / finishes)
                    </span>
                  </Label>
                  <div className="space-y-2">
                    {form.qualities.map((q, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[9rem_minmax(0,1fr)_auto] gap-2 items-start"
                      >
                        <Select
                          value={q.icon}
                          onValueChange={(v) => {
                            const next = [...form.qualities];
                            next[i] = { ...next[i], icon: v };
                            update({ qualities: next });
                          }}
                        >
                          <SelectTrigger className="text-xs w-full max-w-[9rem]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_ICON_OPTIONS.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                <div className="flex items-center gap-2">
                                  <opt.Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                  <span>{opt.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="min-w-0 grid grid-cols-2 gap-2">
                          <Input
                            value={q.title}
                            onChange={(e) => {
                              const next = [...form.qualities];
                              next[i] = { ...next[i], title: e.target.value };
                              update({ qualities: next });
                            }}
                            placeholder="Cubiertas"
                            className="min-w-0"
                          />
                          <Input
                            value={q.description}
                            onChange={(e) => {
                              const next = [...form.qualities];
                              next[i] = {
                                ...next[i],
                                description: e.target.value,
                              };
                              update({ qualities: next });
                            }}
                            placeholder="Descripción breve"
                            className="min-w-0"
                          />
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-destructive shrink-0"
                          onClick={() =>
                            update({
                              qualities: form.qualities.filter(
                                (_, j) => j !== i,
                              ),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        update({
                          qualities: [
                            ...form.qualities,
                            { title: "", description: "", icon: "Layers" },
                          ],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Añadir calidad
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 mt-4">
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                  <Label htmlFor="hero-vt-url">
                    Tour virtual bajo hero (embed)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Independiente del Tour 360° de la galería. Cualquier proveedor
                    con URL de embed o iframe (Matterport, Wizio, etc.).
                  </p>
                  <div className="relative">
                    <Input
                      id="hero-vt-url"
                      type="url"
                      placeholder="URL de embed o enlace público (cualquier proveedor)"
                      value={form.heroVirtualTourUrl}
                      onChange={(e) =>
                        update({ heroVirtualTourUrl: e.target.value })
                      }
                      className="mt-1 font-mono text-sm pr-9"
                    />
                    {form.heroVirtualTourUrl.trim().length > 0 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label="Quitar tour virtual"
                        onClick={() => update({ heroVirtualTourUrl: "" })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <Tabs defaultValue="fotos" className="w-full">
                  <TabsList className="flex flex-wrap gap-2 p-2 rounded-full bg-muted/80 w-full h-auto">
                    <TabsTrigger
                      value="fotos"
                      className="rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-4 py-2"
                    >
                      Fotos
                    </TabsTrigger>
                    <TabsTrigger
                      value="videos"
                      className="rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-4 py-2"
                    >
                      Vídeos
                    </TabsTrigger>
                    <TabsTrigger
                      value="tour360"
                      className="rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-4 py-2"
                    >
                      Tour 360°
                    </TabsTrigger>
                    <TabsTrigger
                      value="parcela"
                      className="rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-4 py-2"
                    >
                      Parcela
                    </TabsTrigger>
                    <TabsTrigger
                      value="construccion"
                      className="rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-4 py-2"
                    >
                      Construccion
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="fotos" className="mt-4">
                    <GalleryEditor
                      photos={form.galleryPhotos}
                      heroImage={form.heroImage}
                      onReorder={(photos) => update({ galleryPhotos: photos })}
                      onHeroChange={(src) => update({ heroImage: src })}
                      projectSlug={project.slug}
                    />
                  </TabsContent>
                  <TabsContent value="videos" className="mt-4">
                    <MediaSectionEditor
                      items={form.galleryVideos}
                      onChange={(items) => update({ galleryVideos: items })}
                      type="videos"
                      addPlaceholder="URL de video o thumbnail"
                      projectSlug={project.slug}
                      heroVideoUrl={form.heroVideoUrl}
                      onHeroVideoChange={(url) => update({ heroVideoUrl: url })}
                    />
                  </TabsContent>
                  <TabsContent value="tour360" className="mt-4">
                    <MediaSectionEditor
                      items={form.galleryTour360}
                      onChange={(items) => update({ galleryTour360: items })}
                      type="tour360"
                      projectSlug={project.slug}
                    />
                  </TabsContent>
                  <TabsContent value="parcela" className="mt-4">
                    <MediaSectionEditor
                      items={form.galleryParcela}
                      onChange={(items) => update({ galleryParcela: items })}
                      type="parcela"
                      addPlaceholder="URL de imagen de parcela"
                      projectSlug={project.slug}
                    />
                  </TabsContent>
                  <TabsContent value="construccion" className="mt-4">
                    <MediaSectionEditor
                      items={form.galleryConstruction}
                      onChange={(items) =>
                        update({ galleryConstruction: items })
                      }
                      type="construction"
                      addPlaceholder="URL de imagen de obra"
                      projectSlug={project.slug}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {/* Floating Action Bar */}
        {isDirty && (
          <div className="border-t bg-background px-6 py-4 flex items-center justify-between gap-4 shrink-0">
            <Button variant="outline" onClick={handleDiscard} disabled={saving}>
              Descartar cambios
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        )}

        {/* Safe Delete - always visible at bottom */}
        <div className="border-t px-6 py-4 shrink-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full">
                Eliminar proyecto
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar proyecto</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Para confirmar, escribe el
                  nombre del proyecto:{" "}
                  <strong className="text-foreground">{project.name}</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={project.name}
                className="mt-4"
                aria-label="Confirmar nombre del proyecto"
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirm("")}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteConfirm !== project.name || saving}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SheetContent>
    </Sheet>
  );
}
