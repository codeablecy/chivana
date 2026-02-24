"use client"

import { useState } from "react"
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
import { Pencil, Check, X, Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  formatPrice,
  formatSuperficie,
  parsePriceForEdit,
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
 * Linked inventory logic: Total = Disponibles + Vendidas (constant).
 * Changing one auto-adjusts the other to preserve total.
 * Industry-standard inventory allocation pattern.
 */
function applyAvailableChange(
  current: { available: number; sold: number },
  newAvailableRaw: string | number
): { available: number; sold: number } {
  const total = current.available + current.sold
  const parsed = typeof newAvailableRaw === "string" ? parseInt(newAvailableRaw, 10) : newAvailableRaw
  const available = Math.max(0, Math.min(total, Number.isNaN(parsed) ? 0 : parsed))
  return { available, sold: total - available }
}

function applySoldChange(
  current: { available: number; sold: number },
  newSoldRaw: string | number
): { available: number; sold: number } {
  const total = current.available + current.sold
  const parsed = typeof newSoldRaw === "string" ? parseInt(newSoldRaw, 10) : newSoldRaw
  const sold = Math.max(0, Math.min(total, Number.isNaN(parsed) ? 0 : parsed))
  return { available: total - sold, sold }
}

export function PricingInventoryTable({
  items,
  onAdd,
  onUpdate,
  onRemove,
  localOnly = false,
  onLocalChange,
  addButtonLabel = "Añadir tipología",
}: PricingInventoryTableProps) {
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [editRow, setEditRow] = useState<Partial<PricingItem>>({})
  const [saving, setSaving] = useState(false)
  const [localItems, setLocalItems] = useState<PricingItem[]>(items)
  const [addingNew, setAddingNew] = useState(false)
  const [newRowForm, setNewRowForm] = useState<Partial<PricingItem>>({
    ...EMPTY_ROW,
  })

  const displayItems = localOnly ? localItems : items

  function resetNewRowForm() {
    setNewRowForm({ ...EMPTY_ROW })
    setAddingNew(false)
  }

  function startEdit(item: PricingItem) {
    setEditingRow(item.type)
    setEditRow({
      type: item.type,
      area: item.area,
      price: item.price,
      details: item.details,
      available: item.available,
      sold: item.sold,
      images: item.images ?? [],
      rooms: item.rooms,
      baths: item.baths,
      garden: item.garden,
      description: item.description,
    })
  }

  function cancelEdit() {
    setEditingRow(null)
    setEditRow({})
  }

  async function handleSave(originalTypeName: string) {
    const updates: PricingItem = {
      type: editRow.type?.trim() || originalTypeName,
      area: editRow.area?.trim() ?? "",
      price: editRow.price?.trim() ?? "Consultar",
      details: editRow.details?.trim() ?? "",
      available: Number(editRow.available) || 0,
      sold: Number(editRow.sold) || 0,
      images: editRow.images ?? [],
      rooms: editRow.rooms,
      baths: editRow.baths,
      garden: editRow.garden,
      description: editRow.description,
    }
    setSaving(true)
    if (localOnly && onLocalChange) {
      const next = displayItems.map((i) =>
        i.type === originalTypeName ? updates : i
      )
      setLocalItems(next)
      onLocalChange(next)
      cancelEdit()
    } else if (onUpdate) {
      await onUpdate(originalTypeName, updates)
      cancelEdit()
    }
    setSaving(false)
  }

  function handleClickAdd() {
    setAddingNew(true)
    setNewRowForm({ ...EMPTY_ROW })
  }

  async function handleAddRow() {
    const { type, area, price, details, available, sold, images, rooms, baths, garden, description } = newRowForm
    const typeVal = type?.trim() || "Nueva tipología"
    const item: PricingItem = {
      type: typeVal,
      area: (area?.trim() ?? "") || "—",
      price: (price?.trim() ?? "") || "Consultar",
      details: (details?.trim() ?? "") || "—",
      available: Number(available) || 0,
      sold: Number(sold) || 0,
      images: images && images.length > 0 ? images : undefined,
      rooms,
      baths,
      garden: garden?.trim() || undefined,
      description: description?.trim() || undefined,
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

  function handleCancelAdd() {
    resetNewRowForm()
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-foreground">
          Inventario de tipologías
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleClickAdd}
          disabled={saving || addingNew}
          className="text-primary border-primary bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          {addButtonLabel.replace(/^\s*\+\s*/, "").trim() || "Añadir tipología"}
        </Button>
      </div>

      {/* Add new row panel - full form with all fields */}
      {addingNew && (
        <div
          className="border-b border-border bg-muted/20 px-4 py-5"
          role="form"
          aria-label="Añadir nueva tipología"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Nueva tipología
            </h3>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCancelAdd}
              className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Cancelar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="new-type">Tipología</Label>
              <Input
                id="new-type"
                placeholder="ej: Unifamiliar Tipo D"
                value={newRowForm.type ?? ""}
                onChange={(e) =>
                  setNewRowForm((p) => ({ ...p, type: e.target.value }))
                }
                className="h-9"
                autoFocus
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-area">Superficie</Label>
              <Input
                id="new-area"
                placeholder="ej: 183.80 m²"
                value={newRowForm.area ?? ""}
                onChange={(e) =>
                  setNewRowForm((p) => ({ ...p, area: e.target.value }))
                }
                className="h-9"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-price">Precio</Label>
              <Input
                id="new-price"
                placeholder="Consultar o 268.000€"
                value={newRowForm.price ?? "Consultar"}
                onChange={(e) =>
                  setNewRowForm((p) => ({ ...p, price: e.target.value }))
                }
                className="h-9 font-semibold text-primary"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-details">Detalles</Label>
              <Input
                id="new-details"
                placeholder="ej: 4 hab. + 3 baños - Jardín 56 m²"
                value={newRowForm.details ?? ""}
                onChange={(e) =>
                  setNewRowForm((p) => ({ ...p, details: e.target.value }))
                }
                className="h-9"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-rooms" className="text-muted-foreground text-xs">
                Hab.
              </Label>
              <Input
                id="new-rooms"
                type="number"
                min={0}
                placeholder="4"
                value={newRowForm.rooms ?? ""}
                onChange={(e) =>
                  setNewRowForm((p) => ({
                    ...p,
                    rooms: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  }))
                }
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-baths" className="text-muted-foreground text-xs">
                Baños
              </Label>
              <Input
                id="new-baths"
                type="number"
                min={0}
                placeholder="3"
                value={newRowForm.baths ?? ""}
                onChange={(e) =>
                  setNewRowForm((p) => ({
                    ...p,
                    baths: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  }))
                }
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-garden" className="text-muted-foreground text-xs">
                Jardín
              </Label>
              <Input
                id="new-garden"
                placeholder="56 m²"
                value={newRowForm.garden ?? ""}
                onChange={(e) =>
                  setNewRowForm((p) => ({ ...p, garden: e.target.value }))
                }
                className="h-9"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="new-description" className="text-muted-foreground text-xs">
                Descripción (Las Viviendas)
              </Label>
              <Input
                id="new-description"
                placeholder="Opcional: párrafo descriptivo"
                value={newRowForm.description ?? ""}
                onChange={(e) =>
                  setNewRowForm((p) => ({ ...p, description: e.target.value }))
                }
                className="h-9"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-available">Disponibles</Label>
              <Input
                id="new-available"
                type="number"
                min={0}
                value={newRowForm.available ?? ""}
                onChange={(e) => {
                  const { available, sold } = applyAvailableChange(
                    {
                      available: newRowForm.available ?? 0,
                      sold: newRowForm.sold ?? 0,
                    },
                    e.target.value
                  )
                  setNewRowForm((p) => ({ ...p, available, sold }))
                }}
                className="h-9 text-center"
                aria-describedby="new-inventory-hint"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-sold">Vendidas</Label>
              <Input
                id="new-sold"
                type="number"
                min={0}
                value={newRowForm.sold ?? ""}
                onChange={(e) => {
                  const { available, sold } = applySoldChange(
                    {
                      available: newRowForm.available ?? 0,
                      sold: newRowForm.sold ?? 0,
                    },
                    e.target.value
                  )
                  setNewRowForm((p) => ({ ...p, available, sold }))
                }}
                className="h-9 text-center"
                aria-describedby="new-inventory-hint"
              />
            </div>
          </div>
          <p
            id="new-inventory-hint"
            className="text-xs text-muted-foreground mb-4"
          >
            Disponibles y Vendidas están vinculados: al cambiar uno, el otro se
            ajusta automáticamente para mantener el total.
          </p>
          <div className="mb-4">
            <Label className="text-xs text-muted-foreground mb-2 block">
              Imágenes (Las Viviendas)
            </Label>
            <TypologyImagePicker
              images={newRowForm.images ?? []}
              onChange={(imgs) => setNewRowForm((p) => ({ ...p, images: imgs }))}
              typologyName={newRowForm.type?.trim() || undefined}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAddRow}
              disabled={saving || !newRowForm.type?.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Añadir tipología
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancelAdd}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium w-16 hidden sm:table-cell">
                Img
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Tipologia
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Superficie
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Precio
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Detalles
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Disponibles
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Vendidas
              </TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayItems.map((item) => (
              <TableRow
                key={item.type}
                className="border-border hover:bg-muted/30"
              >
                <TableCell className="hidden sm:table-cell w-16 align-top pt-3">
                  {editingRow === item.type ? (
                    <TypologyImagePicker
                      images={editRow.images ?? item.images ?? []}
                      onChange={(imgs) =>
                        setEditRow((p) => ({ ...p, images: imgs }))
                      }
                      typologyName={editRow.type || item.type}
                      className="min-h-0"
                    />
                  ) : (
                    <div className="relative h-10 w-12 rounded overflow-hidden bg-muted shrink-0">
                      {item.images?.[0]?.src ? (
                        <img
                          src={item.images[0].src}
                          alt={item.images[0].alt || ""}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground flex items-center justify-center h-full w-full">
                          —
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {editingRow === item.type ? (
                    <Input
                      value={editRow.type ?? ""}
                      onChange={(e) =>
                        setEditRow((p) => ({ ...p, type: e.target.value }))
                      }
                      className="h-8 w-40 text-sm font-medium"
                    />
                  ) : (
                    item.type
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {editingRow === item.type ? (
                    <Input
                      value={parseSuperficieForEdit(editRow.area ?? item.area)}
                      onChange={(e) =>
                        setEditRow((p) => ({
                          ...p,
                          area: e.target.value,
                        }))
                      }
                      placeholder="183.80"
                      className="h-8 w-28 text-sm"
                    />
                  ) : (
                    formatSuperficie(item.area)
                  )}
                </TableCell>
                <TableCell>
                  {editingRow === item.type ? (
                    <Input
                      value={editRow.price ?? item.price}
                      onChange={(e) =>
                        setEditRow((p) => ({ ...p, price: e.target.value }))
                      }
                      placeholder="Consultar"
                      className="h-8 w-32 text-sm font-semibold text-primary"
                    />
                  ) : (
                    <span className="font-semibold text-primary">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="max-w-[180px] text-muted-foreground">
                  {editingRow === item.type ? (
                    <Input
                      value={editRow.details ?? ""}
                      onChange={(e) =>
                        setEditRow((p) => ({ ...p, details: e.target.value }))
                      }
                      placeholder="4 hab. + 3 baños"
                      className="h-8 text-sm"
                    />
                  ) : (
                    <span className="truncate block">{item.details || "—"}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editingRow === item.type ? (
                    <Input
                      type="number"
                      min="0"
                      value={editRow.available ?? ""}
                      onChange={(e) => {
                        const { available, sold } = applyAvailableChange(
                          {
                            available: editRow.available ?? item.available,
                            sold: editRow.sold ?? item.sold,
                          },
                          e.target.value
                        )
                        setEditRow((p) => ({ ...p, available, sold }))
                      }}
                      className="h-8 w-16 text-sm mx-auto text-center"
                      aria-label="Disponibles"
                    />
                  ) : (
                    <Badge
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium",
                        item.available > 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.available > 0 ? item.available : "0"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {editingRow === item.type ? (
                    <Input
                      type="number"
                      min="0"
                      value={editRow.sold ?? ""}
                      onChange={(e) => {
                        const { available, sold } = applySoldChange(
                          {
                            available: editRow.available ?? item.available,
                            sold: editRow.sold ?? item.sold,
                          },
                          e.target.value
                        )
                        setEditRow((p) => ({ ...p, available, sold }))
                      }}
                      className="h-8 w-14 text-sm mx-auto text-center"
                      aria-label="Vendidas"
                    />
                  ) : (
                    item.sold
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingRow === item.type ? (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleSave(item.type)}
                        disabled={saving}
                        className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        className="h-8"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(item)}
                        className="h-8 border-border hover:bg-muted/50"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Editar
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
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {displayItems.length === 0 && (
        <div className="px-4 py-8 text-center text-muted-foreground text-sm">
          No hay tipologías. Haz clic en &quot;{addButtonLabel}&quot; para
          añadir la primera.
        </div>
      )}
    </div>
  )
}
