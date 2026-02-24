/**
 * Format a price for display with € symbol and thousands separator.
 * Preserves "Consultar" and values that already include €.
 */
export function formatPrice(value: string): string {
  const trimmed = value?.trim() ?? ""
  if (!trimmed) return "Consultar"
  if (trimmed === "Consultar" || /^[a-zA-ZáéíóúñÑ\s]+$/i.test(trimmed)) {
    return trimmed
  }
  if (/\d.*€/.test(trimmed)) return trimmed
  const cleaned = trimmed.replace(/[^\d.,-]/g, "").replace(",", ".")
  const num = parseFloat(cleaned)
  if (Number.isNaN(num)) return trimmed
  return (
    new Intl.NumberFormat("es-ES", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num) + "€"
  )
}

/**
 * Parse display price back to raw string for editing.
 */
export function parsePriceForEdit(displayValue: string): string {
  const v = displayValue?.trim() ?? ""
  if (v === "Consultar" || /^[a-zA-ZáéíóúñÑ\s]+$/i.test(v)) return v
  const num = parseFloat(v.replace(/[^\d.,-]/g, "").replace(",", "."))
  if (Number.isNaN(num)) return v
  return String(num)
}

/**
 * Ensure superficie has m² suffix for display.
 */
export function formatSuperficie(value: string): string {
  const v = value?.trim() ?? ""
  if (!v) return "—"
  if (/\s*m²\s*$/i.test(v)) return v
  return `${v} m²`
}

/**
 * Strip m² from superficie for editing.
 */
export function parseSuperficieForEdit(value: string): string {
  return (value ?? "").replace(/\s*m²\s*$/gi, "").trim()
}
