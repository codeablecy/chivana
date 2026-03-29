/**
 * Shared embed URL normalization for iframes (YouTube vs passthrough).
 * Used by gallery embeds and hero virtual tour section.
 */

function ytId(url: string): string | null {
  const patterns = [
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ]
  for (const r of patterns) {
    const m = url.match(r)
    if (m?.[1]) return m[1]
  }
  return null
}

/** YouTube → embed with params; other URLs returned as-is (Matterport, Wizio, etc.). */
export function embedDisplayUrl(url: string): string {
  const id = ytId(url)
  if (!id) return url
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    rel: "0",
    modestbranding: "1",
    showinfo: "0",
    controls: "1",
    iv_load_policy: "3",
    fs: "1",
  })
  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

export function embedTitle(url: string): string {
  if (/youtube\.com|youtu\.be/.test(url)) return "YouTube"
  if (/vimeo\.com/.test(url)) return "Vimeo"
  if (/matterport\.com/.test(url)) return "Matterport"
  if (/wizio/i.test(url)) return "Wizio"
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return "Embed"
  }
}

export function embedThumb(url: string): string | undefined {
  const id = ytId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined
}
