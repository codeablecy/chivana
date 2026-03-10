"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Check, X, Plus, Trash2, FileText, Upload, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  formatPrice,
  formatSuperficie,
  parseSuperficieForEdit,
} from "@/lib/format"
import type { PricingItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { TypologyImagePicker } from "./typology-image-picker"

type PricingInventoryTableProps = {
  items: PricingItem[]
  onAdd?: (item: PricingItem) => Promise<void>
  onUpdate?: (originalType: string, item: Partial<PricingItem>) => Promise<void>
  onRemove?: (typeName: string) => Promise<void>
  /** When true, uses local state only (e.g. in Project Creator). No server calls. */
  localOnly?: boolean
  onLocalChange?: (items: PricingItem[]) => void
  addButtonLabel?: string
  /** Supabase Storage folder for typology image uploads */
  projectSlug?: string
}

const EMPTY_ROW: PricingItem = {
  type: "",
  area: "",
  price: "Consultar",
  details: "",
  available: 0,
  sold: 0,
  images: [],
}

/**
 * Linked inventory: Total = available + sold (constant when editing existing row).
 * Changing one adjusts the other to preserve total.
 */
function applyAvailableChange(
  current: { available: number; sold: number },
  newAvailableRaw: string | number,
): { available: number; sold: number } {
  const total  = current.available + current.sold
  const parsed = typeof newAvailableRaw === "string" ? parseInt(newAvailableRaw, 10) : newAvailableRaw
  const available = Math.max(0, Math.min(total, Number.isNaN(parsed) ? 0 : parsed))
  return { available, sold: total - available }
}

function applySoldChange(
  current: { available: number; sold: number },
  newSoldRaw: string | number,
): { available: number; sold: number } {
  const total  = current.available + current.sold
  const parsed = typeof newSoldRaw === "string" ? parseInt(newSoldRaw, 10) : newSoldRaw
  const sold = Math.max(0, Math.min(total, Number.isNaN(parsed) ? 0 : parsed))
  return { available: total - sold, sold }
}

// ─── PDF upload hook ──────────────────────────────────────────────────────────

function usePdfUpload(projectSlug: string) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  async function upload(file: File): Promise<string | null> {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("context", "project")
      fd.append("slug", projectSlug)
      fd.append("category", "plans")
      const res  = await fetch("/api/upload", { method: "POST", body: fd })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || data.error) { setError(data.error ?? "Error al subir"); return null }
      return data.url ?? null
    } catch {
      setError("Error al subir el archivo")
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error, inputRef }
}

// ─── PDF field component ──────────────────────────────────────────────────────

function PdfField({
  value,
  onChange,
  projectSlug,
  disabled,
}: {
  value: string | undefined
  onChange: (url: string | undefined) => void
  projectSlug: string
  disabled?: boolean
}) {
  const { upload, uploading, error, inputRef } = usePdfUpload(projectSlug)
  const [urlInput, setUrlInput]                = useState("")

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file)
    if (url) onChange(url)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs">Plano PDF (Las Viviendas)</Label>

      {value ? (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
          <FileText className="h-4 w-4 text-accent shrink-0" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate text-xs text-foreground underline-offset-2 hover:underline"
          >
            {value.split("/").pop() ?? "plano.pdf"}
          </a>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Eliminar PDF"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Upload button */}
          <button
            type="button"
            disabled={uploading || disabled || !projectSlug}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary",
              (uploading || !projectSlug) && "opacity-50 cursor-not-allowed",
            )}
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading ? "Subiendo…" : "Subir PDF"}
          </button>

          {/* Direct URL */}
          <div className="flex flex-1 items-center gap-1.5">
            <Input
              placeholder="o pegar URL del PDF"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="h-8 text-xs"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 shrink-0 text-xs"
              onClick={() => { if (urlInput.trim()) { onChange(urlInput.trim()); setUrlInput("") } }}
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      {!projectSlug && (
        <p className="text-[11px] text-muted-foreground">
          Guarda el proyecto primero para habilitar la subida de PDFs.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}

// ─── Full typology form (shared by add & edit) ────────────────────────────────

interface TypologyFormProps {
  title: string
  form: Partial<PricingItem>
  onChange: (patch: Partial<PricingItem>) => void
  isEdit?: boolean
  projectSlug: string
  saving: boolean
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
}

function TypologyForm({
  title,
  form,
  onChange,
  isEdit = false,
  projectSlug,
  saving,
  onSubmit,
  onCancel,
  submitLabel,
}: TypologyFormProps) {
  return (
    <div className="border-b border-border bg-muted/20 px-4 py-5" role="form" aria-label={title}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Cancelar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Row 1: core fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-type`}>Tipología</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-type`}
            placeholder="ej: Unifamiliar Tipo D"
            value={form.type ?? ""}
            onChange={(e) => onChange({ type: e.target.value })}
            className="h-9"
            autoFocus={!isEdit}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-area`}>Superficie</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-area`}
            placeholder="ej: 183.80 m²"
            value={isEdit ? parseSuperficieForEdit(form.area ?? "") : (form.area ?? "")}
            onChange={(e) => onChange({ area: e.target.value })}
            className="h-9"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-price`}>Precio</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-price`}
            placeholder="Consultar o 268.000€"
            value={form.price ?? "Consultar"}
            onChange={(e) => onChange({ price: e.target.value })}
            className="h-9 font-semibold text-primary"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-details`}>Detalles</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-details`}
            placeholder="ej: 4 hab. + 3 baños - Jardín 56 m²"
            value={form.details ?? ""}
            onChange={(e) => onChange({ details: e.target.value })}
            className="h-9"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Row 2: optional spec fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-rooms`} className="text-muted-foreground text-xs">Hab.</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-rooms`}
            type="number"
            min={0}
            placeholder="4"
            value={form.rooms ?? ""}
            onChange={(e) => onChange({ rooms: e.target.value ? parseInt(e.target.value, 10) : undefined })}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-baths`} className="text-muted-foreground text-xs">Baños</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-baths`}
            type="number"
            min={0}
            placeholder="3"
            value={form.baths ?? ""}
            onChange={(e) => onChange({ baths: e.target.value ? parseInt(e.target.value, 10) : undefined })}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-garden`} className="text-muted-foreground text-xs">Jardín</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-garden`}
            placeholder="56 m²"
            value={form.garden ?? ""}
            onChange={(e) => onChange({ garden: e.target.value })}
            className="h-9"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2 sm:col-span-2 lg:col-span-1" />
      </div>

      {/* Row 3: description + inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-desc`} className="text-muted-foreground text-xs">
            Descripción (Las Viviendas)
          </Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-desc`}
            placeholder="Opcional: párrafo descriptivo"
            value={form.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            className="h-9"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-available`}>Disponibles</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-available`}
            type="number"
            min={0}
            value={form.available ?? ""}
            onChange={(e) => {
              if (isEdit) {
                const { available, sold } = applyAvailableChange(
                  { available: form.available ?? 0, sold: form.sold ?? 0 },
                  e.target.value,
                )
                onChange({ available, sold })
              } else {
                onChange({ available: Math.max(0, parseInt(e.target.value, 10) || 0) })
              }
            }}
            className="h-9 text-center"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? "edit" : "new"}-sold`}>Vendidas</Label>
          <Input
            id={`${isEdit ? "edit" : "new"}-sold`}
            type="number"
            min={0}
            value={form.sold ?? ""}
            onChange={(e) => {
              if (isEdit) {
                const { available, sold } = applySoldChange(
                  { available: form.available ?? 0, sold: form.sold ?? 0 },
                  e.target.value,
                )
                onChange({ available, sold })
              } else {
                onChange({ sold: Math.max(0, parseInt(e.target.value, 10) || 0) })
              }
            }}
            className="h-9 text-center"
          />
        </div>
      </div>

      {isEdit && (
        <p className="text-xs text-muted-foreground mb-4">
          Al editar, Disponibles y Vendidas están vinculados al total ({(form.available ?? 0) + (form.sold ?? 0)} viviendas).
        </p>
      )}

      {/* Row 4: images + PDF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Imágenes (Las Viviendas)</Label>
          <TypologyImagePicker
            images={form.images ?? []}
            onChange={(imgs) => onChange({ images: imgs })}
            typologyName={form.type?.trim() || undefined}
            projectSlug={projectSlug}
          />
        </div>
        <PdfField
          value={form.planPdf}
          onChange={(url) => onChange({ planPdf: url })}
          projectSlug={projectSlug}
          disabled={saving}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={saving || !form.type?.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Check className="h-3.5 w-3.5 mr-1.5" />
          {submitLabel}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function PricingInventoryTable({
  items,
  onAdd,
  onUpdate,
  onRemove,
  localOnly = false,
  onLocalChange,
  addButtonLabel = "Añadir tipología",
  projectSlug = "",
}: PricingInventoryTableProps) {
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [editRow,    setEditRow]    = useState<Partial<PricingItem>>({})
  const [saving,     setSaving]     = useState(false)
  const [localItems, setLocalItems] = useState<PricingItem[]>(items)
  const [addingNew,  setAddingNew]  = useState(false)
  const [newRowForm, setNewRowForm] = useState<Partial<PricingItem>>({ ...EMPTY_ROW })

  const displayItems = localOnly ? localItems : items

  function resetNewRowForm() {
    setNewRowForm({ ...EMPTY_ROW })
    setAddingNew(false)
  }

  function startEdit(item: PricingItem) {
    setAddingNew(false)
    setEditingRow(item.type)
    setEditRow({
      type:        item.type,
      area:        item.area,
      price:       item.price,
      details:     item.details,
      available:   item.available,
      sold:        item.sold,
      images:      item.images ?? [],
      rooms:       item.rooms,
      baths:       item.baths,
      garden:      item.garden,
      description: item.description,
      planPdf:     item.planPdf,
    })
  }

  function cancelEdit() {
    setEditingRow(null)
    setEditRow({})
  }

  async function handleSave(originalTypeName: string) {
    const updates: PricingItem = {
      type:        editRow.type?.trim() || originalTypeName,
      area:        editRow.area?.trim() ?? "",
      price:       editRow.price?.trim() ?? "Consultar",
      details:     editRow.details?.trim() ?? "",
      available:   Number(editRow.available) || 0,
      sold:        Number(editRow.sold) || 0,
      images:      editRow.images ?? [],
      rooms:       editRow.rooms,
      baths:       editRow.baths,
      garden:      editRow.garden,
      description: editRow.description,
      planPdf:     editRow.planPdf,
    }
    setSaving(true)
    if (localOnly && onLocalChange) {
      const next = displayItems.map((i) => i.type === originalTypeName ? updates : i)
      setLocalItems(next)
      onLocalChange(next)
      cancelEdit()
    } else if (onUpdate) {
      await onUpdate(originalTypeName, updates)
      cancelEdit()
    }
    setSaving(false)
  }

  async function handleAddRow() {
    const { type, area, price, details, available, sold, images, rooms, baths, garden, description, planPdf } = newRowForm
    const typeVal = type?.trim() || "Nueva tipología"
    const item: PricingItem = {
      type:        typeVal,
      area:        (area?.trim() ?? "") || "—",
      price:       (price?.trim() ?? "") || "Consultar",
      details:     (details?.trim() ?? "") || "—",
      available:   Number(available) || 0,
      sold:        Number(sold) || 0,
      images:      images && images.length > 0 ? images : undefined,
      rooms,
      baths,
      garden:      garden?.trim() || undefined,
      description: description?.trim() || undefined,
      planPdf:     planPdf?.trim() || undefined,
    }
    setSaving(true)
    if (localOnly && onLocalChange) {
      const next = [...displayItems, item]
      setLocalItems(next)
      onLocalChange(next)
      resetNewRowForm()
    } else if (onAdd) {
      await onAdd(item)
      resetNewRowForm()
    }
    setSaving(false)
  }

  async function handleRemoveRow(typeName: string) {
    if (!localOnly && !confirm(`¿Eliminar la tipología "${typeName}"?`)) return
    setSaving(true)
    if (localOnly && onLocalChange) {
      const next = displayItems.filter((i) => i.type !== typeName)
      setLocalItems(next)
      onLocalChange(next)
      if (editingRow === typeName) cancelEdit()
    } else if (onRemove) {
      await onRemove(typeName)
      if (editingRow === typeName) cancelEdit()
    }
    setSaving(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-foreground">
          Inventario de tipologías
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => { setAddingNew(true); setEditingRow(null); setNewRowForm({ ...EMPTY_ROW }) }}
          disabled={saving || addingNew}
          className="text-primary border-primary bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          {addButtonLabel.replace(/^\s*\+\s*/, "").trim() || "Añadir tipología"}
        </Button>
      </div>

      {/* Add new panel */}
      {addingNew && (
        <TypologyForm
          title="Nueva tipología"
          form={newRowForm}
          onChange={(patch) => setNewRowForm((p) => ({ ...p, ...patch }))}
          isEdit={false}
          projectSlug={projectSlug}
          saving={saving}
          onSubmit={handleAddRow}
          onCancel={resetNewRowForm}
          submitLabel="Añadir tipología"
        />
      )}

      {/* Edit expanded panel — shown above the table when a row is being edited */}
      {editingRow && (
        <TypologyForm
          title={`Editando: ${editingRow}`}
          form={editRow}
          onChange={(patch) => setEditRow((p) => ({ ...p, ...patch }))}
          isEdit
          projectSlug={projectSlug}
          saving={saving}
          onSubmit={() => handleSave(editingRow)}
          onCancel={cancelEdit}
          submitLabel="Guardar cambios"
        />
      )}

      {/* Table (read-only rows) */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium w-16 hidden sm:table-cell">Img</TableHead>
              <TableHead className="text-muted-foreground font-medium">Tipología</TableHead>
              <TableHead className="text-muted-foreground font-medium">Superficie</TableHead>
              <TableHead className="text-muted-foreground font-medium">Precio</TableHead>
              <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Detalles</TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">Disponibles</TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">Vendidas</TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayItems.map((item) => {
              const isBeingEdited = editingRow === item.type
              return (
                <TableRow
                  key={item.type}
                  className={cn(
                    "border-border transition-colors",
                    isBeingEdited
                      ? "bg-primary/5 hover:bg-primary/5"
                      : "hover:bg-muted/30",
                  )}
                >
                  {/* Thumb */}
                  <TableCell className="hidden sm:table-cell w-16 align-middle">
                    <div className="relative h-10 w-12 rounded overflow-hidden bg-muted shrink-0">
                      {item.images?.[0]?.src ? (
                        <img
                          src={item.images[0].src}
                          alt={item.images[0].alt || ""}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground flex items-center justify-center h-full w-full">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-1.5">
                      {item.type}
                      {item.planPdf && (
                        <a
                          href={item.planPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Ver plano PDF"
                          className="text-accent hover:text-primary transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </TableCell>

                  {/* Area */}
                  <TableCell className="text-muted-foreground">{formatSuperficie(item.area)}</TableCell>

                  {/* Price */}
                  <TableCell>
                    <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
                  </TableCell>

                  {/* Details */}
                  <TableCell className="max-w-[180px] text-muted-foreground hidden md:table-cell">
                    <span className="truncate block">{item.details || "—"}</span>
                  </TableCell>

                  {/* Available */}
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium",
                        item.available > 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {item.available}
                    </Badge>
                  </TableCell>

                  {/* Sold */}
                  <TableCell className="text-center text-muted-foreground">{item.sold}</TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant={isBeingEdited ? "default" : "outline"}
                        onClick={() => isBeingEdited ? cancelEdit() : startEdit(item)}
                        className={cn(
                          "h-8",
                          isBeingEdited
                            ? "bg-primary text-primary-foreground"
                            : "border-border hover:bg-muted/50",
                        )}
                      >
                        {isBeingEdited ? (
                          <><X className="h-3.5 w-3.5 mr-1" />Cerrar</>
                        ) : (
                          <><Pencil className="h-3.5 w-3.5 mr-1" />Editar</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveRow(item.type)}
                        disabled={saving}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label={`Eliminar ${item.type}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {displayItems.length === 0 && (
        <div className="px-4 py-8 text-center text-muted-foreground text-sm">
          No hay tipologías. Haz clic en &quot;{addButtonLabel}&quot; para añadir la primera.
        </div>
      )}
    </div>
  )
}
