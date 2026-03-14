/**
 * Inline JSON-LD script for structured data (Organization, WebSite, etc.).
 * Rendered in layout/page for rich results in search.
 */
export function JsonLd<T extends Record<string, unknown>>({ data }: { data: T }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
