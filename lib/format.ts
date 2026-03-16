/**
 * Parse price string that may use European formatting:
 * - Dot as thousands separator (e.g. "1.450.000")
 * - Comma as decimal separator (e.g. "1.450.000,50")
 * Returns null for non-numeric or empty values.
 */
export function parsePriceEuropean(value: string | undefined | null): number | null {
  const s = value?.trim() ?? ""
  if (!s || /^[a-zA-ZáéíóúñÑ\s]+$/i.test(s)) return null
  const digitsOnly = s.replace(/[^\d.,]/g, "")
  if (!digitsOnly) return null
  const hasComma = digitsOnly.includes(",")
  const parts = digitsOnly.split(/[.,]/)
  const looksEuropean =
    hasComma ||
    (parts.length > 2 && parts[parts.length - 1].length <= 2) ||
    parts.some((p) => p.length === 3)
  let normalized: string
  if (looksEuropean) {
    normalized = digitsOnly.replace(/\./g, "").replace(",", ".")
  } else {
    normalized = digitsOnly.replace(",", ".")
  }
  const num = parseFloat(normalized)
  return Number.isNaN(num) || num < 0 ? null : num
}

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
  const num = parsePriceEuropean(trimmed)
  if (num === null) return trimmed
  return (
    new Intl.NumberFormat("es-ES", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num) + "€"
  )
}

/**
 * Format a numeric price for project cards: compact for millions (e.g. "1,45 M€"),
 * full Spanish format otherwise. Designed for award-style card UI with clear hierarchy.
 */
export function formatPriceForCard(amount: number): { fromLabel: string; amount: string } {
  const oneM = 1_000_000
  if (amount >= oneM) {
    const millions = amount / oneM
    const amountStr =
      millions % 1 === 0
        ? `${millions.toLocaleString("es-ES", { maximumFractionDigits: 0 })} M€`
        : `${millions.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} M€`
    return { fromLabel: "Desde", amount: amountStr }
  }
  const amountStr = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)
  return { fromLabel: "Desde", amount: amountStr.trim() }
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
