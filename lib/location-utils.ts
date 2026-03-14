import type { Project } from "@/lib/types"

/**
 * Normalizes a city string to a stable, case-insensitive key for grouping and comparison.
 * Use this whenever comparing or grouping cities so that "Madrid", "madrid", and "MADRID"
 * are treated as the same location.
 */
export function normalizeCityKey(city: string | undefined | null): string {
  return (city ?? "").trim().toLowerCase()
}

/**
 * Formats a city name for display using a single case convention: title case
 * (first letter uppercase, rest lowercase). Bulletproof for any input casing:
 * madrid, Madrid, MADRID, mAdRid, MADrid, mAdRiD, etc. → "Madrid".
 *
 * Uses lower-then-capitalize so every character's case is normalized, not only
 * the first and the rest as two chunks.
 */
export function toCityDisplayName(city: string | undefined | null): string {
  const s = (city ?? "").trim().replace(/\s+/g, " ")
  if (!s) return ""
  const lower = s.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

/**
 * Derives unique cities from projects in a case-insensitive way.
 * "madrid" and "Madrid" are merged into one entry with a single canonical label
 * and the combined project count.
 *
 * @returns Array of { city: canonicalDisplayName, count } sorted by count descending
 */
export function getUniqueCitiesCaseInsensitive(
  projects: Pick<Project, "location">[]
): { city: string; count: number }[] {
  const byKey = new Map<
    string,
    { canonical: string; rawValues: Set<string>; count: number }
  >()

  for (const p of projects) {
    const raw = p.location.city?.trim()
    if (!raw) continue

    const key = normalizeCityKey(raw)
    const existing = byKey.get(key)

    if (existing) {
      existing.rawValues.add(raw)
      existing.count += 1
    } else {
      byKey.set(key, {
        canonical: raw,
        rawValues: new Set([raw]),
        count: 1,
      })
    }
  }

  return Array.from(byKey.entries())
    .map(([, v]) => {
      const anyRaw = Array.from(v.rawValues)[0] ?? ""
      return {
        city: toCityDisplayName(anyRaw),
        count: v.count,
      }
    })
    .filter((x) => x.city)
    .sort((a, b) => b.count - a.count)
}
