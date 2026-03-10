"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
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
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Settings2,
} from "lucide-react"
import {
  fetchProjects,
  updatePricing,
  updateTags,
  updateStatus,
  setCustomField,
  deleteCustomField,
  updatePhases,
  addPricingRow,
  removePricingRow,
} from "@/app/admin/actions"
import type { Project, Phase, PricingItem } from "@/lib/types"
import { CardsSkeleton, TableSkeleton } from "./admin-skeleton"
import { PricingInventoryTable } from "./pricing-inventory-table"
import { ProjectEditorSheet } from "./project-editor-sheet"
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top-on-change"
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

const CUSTOM_FIELD_SUGGESTIONS = [
  "Certificación energética",
  "Año entrega",
  "Acabados",
  "Garaje",
]

const STATUS_CONFIG: Record<
  Project["status"],
  { label: string; color: string; icon: React.ElementType }
> = {
  "coming-soon": {
    label: "Próximamente",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: Clock,
  },
  active: {
    label: "En Venta",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  "sold-out": {
    label: "Agotado",
    color: "text-slate-500 bg-slate-50 border-slate-200",
    icon: AlertCircle,
  },
}

// ─── Project List Sidebar ─────────────────────────────────────────────────────

interface ProjectListSidebarProps {
  projects: Project[]
  selectedSlug: string
  onSelect: (slug: string) => void
}

function ProjectListSidebar({
  projects,
  selectedSlug,
  onSelect,
}: ProjectListSidebarProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(
    () =>
      projects.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      ),
    [projects, query]
  )

  return (
    <aside className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Proyectos ({projects.length})
        </h3>
      </div>

      {projects.length > 3 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar proyecto…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-muted/40"
          />
        </div>
      )}

      <nav className="flex flex-col gap-1.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Sin resultados
          </p>
        ) : (
          filtered.map((p) => {
            const isSelected = p.slug === selectedSlug
            const cfg = STATUS_CONFIG[p.status ?? "coming-soon"]
            const sold = p.pricing.reduce((s, t) => s + t.sold, 0)
            const pct =
              p.totalUnits > 0 ? Math.round((sold / p.totalUnits) * 100) : 0

            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => onSelect(p.slug)}
                className={`w-full text-left rounded-xl px-3 py-2.5 border transition-all group ${
                  isSelected
                    ? "bg-primary/8 border-primary/30 shadow-sm"
                    : "bg-card border-border hover:bg-muted/50 hover:border-border/80"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`text-sm font-medium leading-tight ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span
                    className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {p.availableUnits}
                    </span>{" "}
                    / {p.totalUnits} disp.
                  </span>
                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {pct}%
                  </span>
                </div>
              </button>
            )
          })
        )}
      </nav>
    </aside>
  )
}

// ─── Project Header ───────────────────────────────────────────────────────────

interface ProjectHeaderProps {
  project: Project
  saving: boolean
  onStatusChange: (status: Project["status"]) => void
  onBack?: () => void
}

function ProjectHeader({
  project,
  saving,
  onStatusChange,
  onBack,
}: ProjectHeaderProps) {
  const cfg = STATUS_CONFIG[project.status ?? "coming-soon"]
  const sold = project.pricing.reduce((s, p) => s + p.sold, 0)

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-5">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-3 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/60"
          aria-label="Volver a la lista de proyectos"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Todos los proyectos
        </Button>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground leading-tight">
              {project.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inventario de tipologías y disponibilidad
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select
            value={project.status}
            onValueChange={(v) => onStatusChange(v as Project["status"])}
            disabled={saving}
          >
            <SelectTrigger
              className={`h-8 text-xs font-medium border px-2.5 gap-1.5 w-auto ${cfg.color}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(STATUS_CONFIG) as [
                  Project["status"],
                  (typeof STATUS_CONFIG)[Project["status"]],
                ][]
              ).map(([val, c]) => (
                <SelectItem key={val} value={val}>
                  <div className="flex items-center gap-2">
                    <c.icon className="h-3.5 w-3.5" />
                    {c.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="text-center py-2 rounded-lg bg-muted/40">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
            Total
          </p>
          <p className="text-xl font-bold text-foreground">
            {project.totalUnits}
          </p>
        </div>
        <div className="text-center py-2 rounded-lg bg-primary/5 border border-primary/15">
          <p className="text-xs text-primary/80 uppercase tracking-wide mb-0.5">
            Disponibles
          </p>
          <p className="text-xl font-bold text-primary">
            {project.availableUnits}
          </p>
        </div>
        <div className="text-center py-2 rounded-lg bg-muted/40">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
            Vendidas
          </p>
          <p className="text-xl font-bold text-foreground">{sold}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Empty (no project selected) ─────────────────────────────────────────────
// Single source of truth for project selection is the left sidebar; center only prompts.

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <TrendingUp className="h-7 w-7 text-primary" />
      </div>
      <h3 className="font-serif text-xl font-bold text-foreground mb-2">
        Ningún proyecto seleccionado
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Elige un proyecto en la lista de la izquierda para ver y editar su
        inventario, precios y disponibilidad.
      </p>
    </div>
  )
}

// ─── Phases Section ───────────────────────────────────────────────────────────

interface PhasesSectionProps {
  project: Project
  saving: boolean
  resolvedSlug: string
  onReload: () => Promise<void>
}

function PhasesSection({
  project,
  saving,
  resolvedSlug,
  onReload,
}: PhasesSectionProps) {
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    status: "disponible" as Phase["status"],
    label: "",
    date: "",
  })

  function resetForm() {
    setForm({ name: "", subtitle: "", status: "disponible", label: "", date: "" })
    setEditingIdx(null)
  }

  function startEdit(idx: number) {
    const phase = project.phases?.[idx]
    if (!phase) return
    setForm({
      name: phase.name,
      subtitle: phase.subtitle ?? "",
      status: phase.status,
      label: phase.label,
      date: phase.date ?? "",
    })
    setEditingIdx(idx)
  }

  async function handleSave() {
    const { name, subtitle, label, status, date } = form
    if (!name.trim() || !label.trim()) return
    const newPhase: Phase = {
      name: name.trim(),
      subtitle: subtitle.trim() || name.trim(),
      status,
      label: label.trim(),
      date: date.trim() || undefined,
    }

    let updated: Phase[]
    if (editingIdx !== null) {
      updated = [...(project.phases ?? [])]
      updated[editingIdx] = newPhase
    } else {
      updated = [...(project.phases ?? []), newPhase]
    }

    setIsSaving(true)
    await updatePhases(resolvedSlug, updated)
    toast.success(editingIdx !== null ? "Fase actualizada" : "Fase añadida", {
      description: newPhase.name,
    })
    resetForm()
    await onReload()
    setIsSaving(false)
  }

  async function handleRemove(idx: number) {
    const phaseName = project.phases?.[idx]?.name ?? "Fase"
    const updated = (project.phases ?? []).filter((_, i) => i !== idx)
    setIsSaving(true)
    await updatePhases(resolvedSlug, updated)
    toast.success("Fase eliminada", { description: phaseName })
    if (editingIdx === idx) resetForm()
    else if (editingIdx !== null && editingIdx > idx)
      setEditingIdx(editingIdx - 1)
    await onReload()
    setIsSaving(false)
  }

  const disabled = saving || isSaving

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm text-foreground">
              Fases / Avance de Ventas
            </span>
            {(project.phases?.length ?? 0) > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {project.phases?.length}
              </Badge>
            )}
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-3 border-t border-border space-y-4">
            <p className="text-xs text-muted-foreground">
              Las fases aparecen como tarjetas en{" "}
              <code className="bg-muted px-1 rounded text-[10px]">
                /projects/{resolvedSlug}
              </code>
              .
            </p>

            {(project.phases ?? []).length > 0 ? (
              <div className="space-y-2">
                {(project.phases ?? []).map((phase, idx) => (
                  <div
                    key={`${phase.name}-${idx}`}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border ${
                      editingIdx === idx
                        ? "border-primary/30 bg-primary/5"
                        : "bg-muted/40 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-foreground truncate">
                        {phase.name}
                      </span>
                      {phase.subtitle && (
                        <span className="text-xs text-muted-foreground hidden sm:inline truncate">
                          {phase.subtitle}
                        </span>
                      )}
                      <Badge
                        variant={
                          phase.status === "disponible" ? "default" : "secondary"
                        }
                        className="text-[10px] h-4 shrink-0"
                      >
                        {phase.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => startEdit(idx)}
                        disabled={disabled}
                        aria-label={`Editar ${phase.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(idx)}
                        disabled={disabled}
                        aria-label={`Eliminar ${phase.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Aún no hay fases definidas.
              </p>
            )}

            <div className="rounded-lg border border-dashed border-border p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                {editingIdx !== null ? "Editando fase" : "Nueva fase"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <Input
                  placeholder="Nombre (ej: Fase 1)"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Subtítulo"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subtitle: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
                <Select
                  value={form.status}
                  onValueChange={(v: Phase["status"]) =>
                    setForm((f) => ({ ...f, status: v }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="vendida">Vendida</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Etiqueta"
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, label: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Fecha (ej: Jul 2026)"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleSave}
                  disabled={disabled || !form.name.trim() || !form.label.trim()}
                >
                  {editingIdx !== null ? (
                    <>
                      <Pencil className="h-3 w-3 mr-1" />
                      Guardar cambios
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" />
                      Añadir fase
                    </>
                  )}
                </Button>
                {editingIdx !== null && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ─── Tags Section ─────────────────────────────────────────────────────────────

interface TagsSectionProps {
  project: Project
  saving: boolean
  resolvedSlug: string
  onReload: () => Promise<void>
}

function TagsSection({
  project,
  saving,
  resolvedSlug,
  onReload,
}: TagsSectionProps) {
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState("")

  const disabled = saving || isSaving

  async function addTag(tag: string) {
    const t = tag.trim()
    if (!t || (project.tags ?? []).includes(t)) return
    setIsSaving(true)
    await updateTags(resolvedSlug, [...(project.tags ?? []), t])
    setNewTag("")
    await onReload()
    setIsSaving(false)
  }

  async function removeTag(tag: string) {
    setIsSaving(true)
    await updateTags(
      resolvedSlug,
      (project.tags ?? []).filter((t) => t !== tag)
    )
    await onReload()
    setIsSaving(false)
  }

  const unusedSuggestions = SUGGESTED_TAGS.filter(
    (t) => !(project.tags ?? []).includes(t)
  )

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm text-foreground">
              Property Tags
            </span>
            {(project.tags?.length ?? 0) > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {project.tags?.length}
              </Badge>
            )}
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-3 border-t border-border space-y-3">
            <p className="text-xs text-muted-foreground">
              Se muestran en la tarjeta del proyecto y en la ficha pública.
            </p>

            {(project.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(project.tags ?? []).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="pl-2 pr-1 py-0.5 gap-1 text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      disabled={disabled}
                      className="rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                      aria-label={`Eliminar ${tag}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {unusedSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {unusedSuggestions.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs px-2"
                    onClick={() => addTag(tag)}
                    disabled={disabled}
                  >
                    <Plus className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Etiqueta personalizada"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag(newTag))
                }
                className="h-8 text-xs max-w-[200px]"
              />
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={() => addTag(newTag)}
                disabled={disabled || !newTag.trim()}
              >
                Añadir
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ─── Custom Fields Section ────────────────────────────────────────────────────

interface CustomFieldsSectionProps {
  project: Project
  saving: boolean
  resolvedSlug: string
  onReload: () => Promise<void>
}

function CustomFieldsSection({
  project,
  saving,
  resolvedSlug,
  onReload,
}: CustomFieldsSectionProps) {
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")

  const entries = Object.entries(project.customFields ?? {})
  const disabled = saving || isSaving

  async function handleAdd() {
    const k = key.trim()
    const v = value.trim()
    if (!k) return
    setIsSaving(true)
    await setCustomField(resolvedSlug, k, v)
    setKey("")
    setValue("")
    await onReload()
    setIsSaving(false)
  }

  async function handleRemove(fieldKey: string) {
    setIsSaving(true)
    await deleteCustomField(resolvedSlug, fieldKey)
    await onReload()
    setIsSaving(false)
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <Settings2 className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm text-foreground">
              Campos Dinámicos
            </span>
            {entries.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {entries.length}
              </Badge>
            )}
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-3 border-t border-border space-y-3">
            <p className="text-xs text-muted-foreground">
              Atributos adicionales del proyecto (certificación energética, año
              de entrega, acabados…).
            </p>

            {entries.length > 0 && (
              <div className="space-y-1.5">
                {entries.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-3 px-3 py-2 bg-muted/40 rounded-lg"
                  >
                    <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
                      <span className="text-xs font-medium text-foreground shrink-0">
                        {k}
                      </span>
                      <span className="text-xs text-muted-foreground">—</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {v}
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => handleRemove(k)}
                      disabled={disabled}
                      aria-label={`Eliminar ${k}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg border border-dashed border-border p-3 space-y-2">
              <div className="flex flex-wrap gap-1.5 mb-1">
                {CUSTOM_FIELD_SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs px-2"
                    onClick={() => {
                      setKey(s)
                      setValue("")
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                    Campo
                  </label>
                  <Input
                    placeholder="Nombre del campo"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                    Valor
                  </label>
                  <Input
                    placeholder="Valor"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAdd())
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={handleAdd}
                disabled={disabled || !key.trim() || !value.trim()}
              >
                <Plus className="h-3 w-3 mr-1" />
                Añadir campo
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function InventoryManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  // Mobile: show detail panel when project is selected
  const [mobileShowDetail, setMobileShowDetail] = useState(false)
  const [editorSheetOpen, setEditorSheetOpen] = useState(false)
  const detailContentRef = useRef<HTMLDivElement>(null)
  useScrollToTopOnChange(detailContentRef, [selectedSlug])

  const loadProjects = useCallback(async () => {
    const data = await fetchProjects()
    setProjects(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const currentProject = useMemo(
    () => projects.find((p) => p.slug === selectedSlug),
    [projects, selectedSlug]
  )

  function handleSelectProject(slug: string) {
    setSelectedSlug(slug)
    setMobileShowDetail(true)
  }

  /** Clear selection and return to project list / empty state (mobile + desktop). */
  function handleBackToProjectList() {
    setSelectedSlug("")
    setMobileShowDetail(false)
  }

  async function handleStatusChange(status: Project["status"]) {
    if (!currentProject) return
    setSaving(true)
    const res = await updateStatus(currentProject.slug, status)
    if (res.success) {
      await loadProjects()
      toast.success("Estado actualizado", {
        description: STATUS_CONFIG[status].label,
      })
    } else {
      toast.error("No se pudo actualizar el estado")
    }
    setSaving(false)
  }

  async function handlePricingAdd(item: PricingItem) {
    if (!currentProject) return
    const res = await addPricingRow(currentProject.slug, item)
    if (res.success) {
      toast.success("Tipología añadida", { description: item.type })
      await loadProjects()
    }
  }

  async function handlePricingUpdate(
    originalType: string,
    updates: Partial<PricingItem>
  ) {
    if (!currentProject) return
    const res = await updatePricing(currentProject.slug, originalType, updates)
    if (res.success) {
      toast.success("Tipología actualizada", {
        description: updates.type || originalType,
      })
      await loadProjects()
    }
  }

  async function handlePricingRemove(typeName: string) {
    if (!currentProject) return
    const res = await removePricingRow(currentProject.slug, typeName)
    if (res.success) {
      toast.success("Tipología eliminada", { description: typeName })
      await loadProjects()
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
            Gestor de Inventario
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Cargando proyectos…</p>
        </div>
        <CardsSkeleton />
        <div className="mt-6">
          <TableSkeleton rows={5} cols={6} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Page title — always visible */}
      <div className="mb-5 hidden lg:block">
        <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
          Gestor de Inventario
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Selecciona un proyecto y gestiona su inventario, precios y disponibilidad.
        </p>
      </div>

      {/* Two-panel layout: sidebar (desktop) + detail */}
      <div className="lg:grid lg:grid-cols-[264px_1fr] lg:gap-6 lg:items-start">
        {/* ── Sidebar: project list ── */}
        <div
          className={`lg:sticky lg:top-24 ${
            mobileShowDetail ? "hidden lg:block" : "block"
          }`}
        >
          <ProjectListSidebar
            projects={projects}
            selectedSlug={selectedSlug}
            onSelect={handleSelectProject}
          />
        </div>

        {/* ── Detail panel ── */}
        <div ref={detailContentRef} className={`scroll-mt-20 ${mobileShowDetail ? "block" : "hidden lg:block"}`}>
          {currentProject ? (
            <div className="space-y-4">
              <ProjectHeader
                project={currentProject}
                saving={saving}
                onStatusChange={handleStatusChange}
                onBack={handleBackToProjectList}
              />

              {/* Edit project button + editor sheet */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setEditorSheetOpen(true)}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Editar proyecto
                </Button>
                <p className="text-xs text-muted-foreground">
                  Ubicación, servicios cercanos, calidades, medios…
                </p>
              </div>
              <ProjectEditorSheet
                project={currentProject}
                open={editorSheetOpen}
                onOpenChange={(open) => {
                  setEditorSheetOpen(open)
                  if (!open) loadProjects()
                }}
              />

              {/* Primary: Pricing table */}
              <PricingInventoryTable
                items={currentProject.pricing}
                onAdd={handlePricingAdd}
                onUpdate={handlePricingUpdate}
                onRemove={handlePricingRemove}
                addButtonLabel="Añadir tipología"
                projectSlug={currentProject.slug}
              />

              {/* Secondary: Phases */}
              <PhasesSection
                project={currentProject}
                saving={saving}
                resolvedSlug={currentProject.slug}
                onReload={loadProjects}
              />

              {/* Tertiary: Tags + Custom Fields */}
              <TagsSection
                project={currentProject}
                saving={saving}
                resolvedSlug={currentProject.slug}
                onReload={loadProjects}
              />

              <CustomFieldsSection
                project={currentProject}
                saving={saving}
                resolvedSlug={currentProject.slug}
                onReload={loadProjects}
              />
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}
