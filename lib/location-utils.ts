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
 * Picks a single canonical display name for a city from multiple raw values.
 * Prefers a variant with the first letter uppercase (e.g. "Madrid" over "madrid");
 * otherwise falls back to the first occurrence.
 */
function pickCanonicalCityName(rawValues: string[]): string {
  const trimmed = rawValues.map((s) => s.trim()).filter(Boolean)
  if (trimmed.length === 0) return ""
  const withLeadingUpper = trimmed.find(
    (s) => s.length > 0 && s[0] === s[0].toUpperCase(),
  )
  return withLeadingUpper ?? trimmed[0] ?? ""
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
    .map(([, v]) => ({
      city: pickCanonicalCityName(Array.from(v.rawValues)),
      count: v.count,
    }))
    .filter((x) => x.city)
    .sort((a, b) => b.count - a.count)
}
