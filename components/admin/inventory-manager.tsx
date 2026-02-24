"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  X,
  Building2,
  Tag,
  Plus,
  Pencil,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react"
import {
  fetchProjects,
  updatePricing,
  updateTags,
  setCustomField,
  deleteCustomField,
  updatePhases,
  addPricingRow,
  removePricingRow,
} from "@/app/admin/actions"
import type { Project, Phase, PricingItem } from "@/lib/types"
import { CardsSkeleton, TableSkeleton } from "./admin-skeleton"
import { PricingInventoryTable } from "./pricing-inventory-table"
import { toast } from "sonner"

const SUGGESTED_TAGS = [
  "En Construccion",
  "Ultimas Unidades",
  "Proximamente",
  "Pre-Venta",
  "Vendido",
  "Nuevo",
  "Destacado",
]

export function InventoryManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newTag, setNewTag] = useState("")
  const [tagsOpen, setTagsOpen] = useState(false)
  const [fieldsOpen, setFieldsOpen] = useState(false)
  const [newFieldKey, setNewFieldKey] = useState("")
  const [newFieldValue, setNewFieldValue] = useState("")
  const [phasesOpen, setPhasesOpen] = useState(false)
  const [phaseForm, setPhaseForm] = useState({
    name: "",
    subtitle: "",
    status: "disponible" as Phase["status"],
    label: "",
    date: "",
  })
  const [editingPhaseIdx, setEditingPhaseIdx] = useState<number | null>(null)

  const loadProjects = useCallback(async () => {
    const data = await fetchProjects()
    setProjects(data)
    if (data.length > 0 && !selectedSlug) {
      const v = data[0].slug || `project-0`
      setSelectedSlug(v)
    }
    setLoading(false)
  }, [selectedSlug])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
            Gestor de Inventario
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Cargando datos...</p>
        </div>
        <CardsSkeleton />
        <div className="mt-6">
          <TableSkeleton rows={5} cols={6} />
        </div>
      </div>
    )
  }

  const currentProject = projects.find(
    (p, i) => (p.slug || `project-${i}`) === selectedSlug
  )
  const resolvedSlug = currentProject?.slug ?? selectedSlug

  async function handlePricingAdd(item: PricingItem) {
    const res = await addPricingRow(resolvedSlug, item)
    if (res.success) {
      toast.success("Tipología añadida", { description: item.type })
      await loadProjects()
    }
  }

  async function handlePricingUpdate(
    originalType: string,
    updates: Partial<PricingItem>
  ) {
    const res = await updatePricing(resolvedSlug, originalType, updates)
    if (res.success) {
      toast.success("Tipología actualizada", {
        description: updates.type || originalType,
      })
      await loadProjects()
    }
  }

  async function handlePricingRemove(typeName: string) {
    const res = await removePricingRow(resolvedSlug, typeName)
    if (res.success) {
      toast.success("Tipología eliminada", { description: typeName })
      await loadProjects()
    }
  }

  async function handleAddTag() {
    const tag = newTag.trim()
    if (!tag || !currentProject) return
    const updated = [...(currentProject.tags || []), tag]
    setSaving(true)
    await updateTags(resolvedSlug, updated)
    setNewTag("")
    await loadProjects()
    setSaving(false)
  }

  async function handleRemoveTag(tag: string) {
    if (!currentProject) return
    const updated = (currentProject.tags || []).filter((t) => t !== tag)
    setSaving(true)
    await updateTags(resolvedSlug, updated)
    await loadProjects()
    setSaving(false)
  }

  async function handleAddField() {
    const key = newFieldKey.trim()
    const value = newFieldValue.trim()
    if (!key || !currentProject) return
    setSaving(true)
    await setCustomField(resolvedSlug, key, value)
    setNewFieldKey("")
    setNewFieldValue("")
    await loadProjects()
    setSaving(false)
  }

  async function handleRemoveField(key: string) {
    setSaving(true)
    await deleteCustomField(resolvedSlug, key)
    await loadProjects()
    setSaving(false)
  }

  function resetPhaseForm() {
    setPhaseForm({
      name: "",
      subtitle: "",
      status: "disponible",
      label: "",
      date: "",
    })
    setEditingPhaseIdx(null)
  }

  function startEditPhase(idx: number) {
    const phase = currentProject?.phases?.[idx]
    if (!phase) return
    setPhaseForm({
      name: phase.name,
      subtitle: phase.subtitle ?? "",
      status: phase.status,
      label: phase.label,
      date: phase.date ?? "",
    })
    setEditingPhaseIdx(idx)
  }

  async function handleAddPhase() {
    const { name, subtitle, label } = phaseForm
    if (!name.trim() || !label.trim() || !currentProject) return
    const newPhase: Phase = {
      name: name.trim(),
      subtitle: subtitle.trim() || `${name.trim()}`,
      status: phaseForm.status,
      label: label.trim(),
      date: phaseForm.date.trim() || undefined,
    }
    const updated = [...(currentProject.phases ?? []), newPhase]
    setSaving(true)
    await updatePhases(resolvedSlug, updated)
    toast.success("Fase añadida", { description: newPhase.name })
    resetPhaseForm()
    await loadProjects()
    setSaving(false)
  }

  async function handleUpdatePhase() {
    if (editingPhaseIdx === null || !currentProject) return
    const { name, subtitle, label, status, date } = phaseForm
    if (!name.trim() || !label.trim()) return
    const updatedPhase: Phase = {
      name: name.trim(),
      subtitle: subtitle.trim() || name.trim(),
      status,
      label: label.trim(),
      date: date.trim() || undefined,
    }
    const phases = [...(currentProject.phases ?? [])]
    phases[editingPhaseIdx] = updatedPhase
    setSaving(true)
    await updatePhases(resolvedSlug, phases)
    toast.success("Fase actualizada", { description: updatedPhase.name })
    resetPhaseForm()
    await loadProjects()
    setSaving(false)
  }

  async function handleRemovePhase(index: number) {
    if (!currentProject) return
    const phaseName = currentProject.phases?.[index]?.name ?? "Fase"
    const updated = (currentProject.phases ?? []).filter((_, i) => i !== index)
    setSaving(true)
    await updatePhases(resolvedSlug, updated)
    toast.success("Fase eliminada", { description: phaseName })
    if (editingPhaseIdx === index) resetPhaseForm()
    else if (editingPhaseIdx !== null && editingPhaseIdx > index) {
      setEditingPhaseIdx(editingPhaseIdx - 1)
    }
    await loadProjects()
    setSaving(false)
  }

  const customFields = currentProject?.customFields ?? {}
  const customFieldsEntries = Object.entries(customFields)

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
            Gestor de Inventario
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edita precios y disponibilidad de las viviendas.
          </p>
        </div>
        <Select value={selectedSlug} onValueChange={setSelectedSlug}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Seleccionar proyecto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p, i) => (
              <SelectItem key={p.slug || i} value={p.slug || `project-${i}`}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentProject ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-foreground">{currentProject.totalUnits}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Disponibles</p>
              <p className="text-2xl font-bold text-primary">{currentProject.availableUnits}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Vendidas</p>
              <p className="text-2xl font-bold text-foreground">
                {currentProject.pricing.reduce((s, p) => s + p.sold, 0)}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Estado</p>
              <Badge
                className={
                  currentProject.status === "active"
                    ? "bg-primary text-primary-foreground mt-1"
                    : "bg-accent text-accent-foreground mt-1"
                }
              >
                {currentProject.status === "active" ? "En Venta" : "Proximamente"}
              </Badge>
            </div>
          </div>

          {/* Phase Manager - Avance de Ventas */}
          <Collapsible open={phasesOpen} onOpenChange={setPhasesOpen} className="mb-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Fases / Avance de Ventas</span>
                  {(currentProject.phases?.length ?? 0) > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {currentProject.phases?.length}
                    </Badge>
                  )}
                </div>
                {phasesOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-1 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Las fases se muestran como tarjetas en la pagina del proyecto (
                    <code className="text-xs bg-muted px-1 rounded">/projects/{resolvedSlug || "(sin slug)"}</code>
                    ). Al añadir una fase, aparecera automaticamente en la ruta del proyecto.
                  </p>
                  {(currentProject.phases ?? []).length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {(currentProject.phases ?? []).map((phase, idx) => (
                        <div
                          key={`${phase.name}-${idx}`}
                          className="flex items-center justify-between gap-4 py-3 px-4 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <span className="font-medium text-foreground">{phase.name}</span>
                            <span className="text-muted-foreground text-sm ml-2">
                              {phase.subtitle}
                            </span>
                            <Badge
                              variant={phase.status === "disponible" ? "default" : "secondary"}
                              className="ml-2"
                            >
                              {phase.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                              onClick={() => startEditPhase(idx)}
                              disabled={saving}
                              aria-label={`Editar fase ${phase.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                              onClick={() => handleRemovePhase(idx)}
                              disabled={saving}
                              aria-label={`Eliminar fase ${phase.name}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">
                      Aun no hay fases. Añade la primera para que aparezca en la pagina del
                      proyecto.
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    <Input
                      placeholder="Nombre (ej: Fase 1)"
                      value={phaseForm.name}
                      onChange={(e) =>
                        setPhaseForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Subtitulo (ej: Viviendas 3 - 8)"
                      value={phaseForm.subtitle}
                      onChange={(e) =>
                        setPhaseForm((p) => ({ ...p, subtitle: e.target.value }))
                      }
                      className="h-8 text-sm"
                    />
                    <Select
                      value={phaseForm.status}
                      onValueChange={(v: Phase["status"]) =>
                        setPhaseForm((p) => ({ ...p, status: v }))
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="vendida">Vendida</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Etiqueta (ej: Ultimas 3 viviendas)"
                      value={phaseForm.label}
                      onChange={(e) =>
                        setPhaseForm((p) => ({ ...p, label: e.target.value }))
                      }
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Fecha (ej: Julio 2026)"
                      value={phaseForm.date}
                      onChange={(e) =>
                        setPhaseForm((p) => ({ ...p, date: e.target.value }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={
                        editingPhaseIdx !== null ? handleUpdatePhase : handleAddPhase
                      }
                      disabled={
                        saving || !phaseForm.name.trim() || !phaseForm.label.trim()
                      }
                      className={
                        editingPhaseIdx !== null
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {editingPhaseIdx !== null ? (
                        <>
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Guardar cambios
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Añadir fase
                        </>
                      )}
                    </Button>
                    {editingPhaseIdx !== null && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetPhaseForm}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Property Tags */}
          <Collapsible open={tagsOpen} onOpenChange={setTagsOpen} className="mb-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Property Tags</span>
                  {(currentProject.tags?.length ?? 0) > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {currentProject.tags?.length}
                    </Badge>
                  )}
                </div>
                {tagsOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-1 border-t border-border">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(currentProject.tags ?? []).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="pl-2 pr-1 py-1 gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={saving}
                          className="rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                          aria-label={`Eliminar etiqueta ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.filter(
                      (t) => !(currentProject.tags ?? []).includes(t)
                    ).map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={async () => {
                          setSaving(true)
                          await updateTags(resolvedSlug, [
                            ...(currentProject.tags ?? []),
                            tag,
                          ])
                          await loadProjects()
                          setSaving(false)
                        }}
                        disabled={saving}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="Nueva etiqueta personalizada"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      className="max-w-xs h-8 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddTag}
                      disabled={saving || !newTag.trim()}
                      className="h-8"
                    >
                      Añadir
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Pricing table */}
          <div className="mb-6">
            <PricingInventoryTable
              items={currentProject.pricing}
              onAdd={handlePricingAdd}
              onUpdate={handlePricingUpdate}
              onRemove={handlePricingRemove}
              addButtonLabel="Añadir tipología"
            />
          </div>

          {/* Dynamic Fields */}
          <Collapsible open={fieldsOpen} onOpenChange={setFieldsOpen} className="mb-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Campos Dinamicos</span>
                  {customFieldsEntries.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {customFieldsEntries.length}
                    </Badge>
                  )}
                </div>
                {fieldsOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-1 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Añade campos personalizados para caracteristicas adicionales del proyecto
                    (certificación energética, año de entrega, acabados, etc.).
                  </p>
                  {customFieldsEntries.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {customFieldsEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-4 py-2 px-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm text-foreground">{key}</span>
                            <span className="text-muted-foreground text-sm mx-2">:</span>
                            <span className="text-sm text-muted-foreground truncate">{value}</span>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={() => handleRemoveField(key)}
                            disabled={saving}
                            aria-label={`Eliminar campo ${key}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Nombre del campo
                        </label>
                        <Input
                          placeholder="ej: Certificación energética, Año entrega, Acabados"
                          value={newFieldKey}
                          onChange={(e) => setNewFieldKey(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Valor
                        </label>
                        <Input
                          placeholder="ej: A, 2026, Premium"
                          value={newFieldValue}
                          onChange={(e) => setNewFieldValue(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAddField())
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Certificación energética", "Año entrega", "Acabados", "Garaje"].map(
                        (suggest) => (
                          <Button
                            key={suggest}
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => {
                              setNewFieldKey(suggest)
                              setNewFieldValue("")
                            }}
                          >
                            {suggest}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={handleAddField}
                      disabled={
                        saving || !newFieldKey.trim() || !newFieldValue.trim()
                      }
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Añadir campo
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

        </>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-foreground mb-1">
            Sin datos de inventario
          </h3>
          <p className="text-muted-foreground text-sm">
            {currentProject
              ? "Este proyecto aun no tiene precios configurados."
              : "Selecciona un proyecto para gestionar su inventario."}
          </p>
        </div>
      )}
    </div>
  )
}
