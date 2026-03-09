/**
 * Cal.com booking configuration.
 * Uses public booking URLs for each appointment type (no API key required for embed).
 * @see https://cal.com/docs/api-reference/v2/introduction
 * @see https://cal.com/embed
 */

export type CalComBookingType = "online" | "office"

/** Public booking page URLs – set in .env (e.g. https://cal.com/your-username/visita-online) */
const VISITA_ONLINE =
  process.env.NEXT_PUBLIC_CAL_COM_VISITA_ONLINE?.trim() || ""
const VISITA_OFICINA =
  process.env.NEXT_PUBLIC_CAL_COM_VISITA_OFICINA?.trim() || ""

/**
 * Returns the Cal.com booking URL for the given type, or null if not configured.
 */
export function getCalComBookingUrl(type: CalComBookingType): string | null {
  const url = type === "online" ? VISITA_ONLINE : VISITA_OFICINA
  return url && url.startsWith("https://") ? url : null
}

/** True if at least one Cal.com booking URL is configured. */
export function isCalComEnabled(): boolean {
  return !!(VISITA_ONLINE || VISITA_OFICINA)
}
