# SEO Integration — Technical Guide

This document describes the SEO implementation for the Chivana Real Estate Next.js app: architecture, files, APIs, and how to extend or maintain it.

---

## 1. Overview

- **Stack:** Next.js App Router, `Metadata` API, dynamic `sitemap.ts` / `robots.ts`, JSON-LD (Schema.org), dynamic OG/Twitter images.
- **Base URL:** Driven by `NEXT_PUBLIC_SITE_URL`. All canonicals, sitemap, and social URLs resolve from this.

---

## 2. File Map

| Path | Purpose |
|------|---------|
| `lib/seo.ts` | Central config: `baseUrl`, `siteName`, default title/description, locale. `absoluteUrl()` helper. |
| `app/layout.tsx` | Root metadata (title template, OG, Twitter, robots, canonical), Organization + WebSite JSON-LD. |
| `app/opengraph-image.tsx` | Default OG image (1200×630, Edge). |
| `app/twitter-image.tsx` | Default Twitter card image (1200×630, Edge). |
| `app/sitemap.ts` | Dynamic sitemap: home, `/projects`, `/projects/[slug]`, `/blog/[id]`, `/privacy-policy`, `/citas-visitas`. |
| `app/robots.ts` | `robots.txt`: allow `/`, disallow `/admin`, `/auth`; sitemap URL. |
| `components/seo-json-ld.tsx` | Reusable `<JsonLd data={...} />` for schema injection. |
| **Per-route** | `generateMetadata()` + optional JSON-LD in project detail and blog post pages. |

---

## 3. Central Config (`lib/seo.ts`)

```ts
seo.baseUrl         // From NEXT_PUBLIC_SITE_URL (no trailing slash)
seo.siteName       // "Chivana Real Estate"
seo.defaultTitle   // Default <title> for the site
seo.defaultDescription
seo.locale         // "es_ES"
absoluteUrl(path)  // baseUrl + path (e.g. "/projects/el-mirador")
```

Use `absoluteUrl()` for any URL that must be absolute (canonicals, OG images, JSON-LD `url`/`image`).

---

## 4. Metadata API (Next.js)

- **Root** (`app/layout.tsx`): `metadataBase: new URL(seo.baseUrl)`, `title.template`, default `openGraph` / `twitter` / `robots` / `alternates.canonical`.
- **Child routes:** Export `metadata` or `generateMetadata()`. Title uses template: `%s | Chivana Real Estate`.
- **Per-page canonicals:** Set `alternates: { canonical: "/path" }` (relative; `metadataBase` resolves it).

Important: do not duplicate default OG image in every page unless you need a page-specific image; the root layout and file-based `opengraph-image.tsx` / `twitter-image.tsx` cover the default.

---

## 5. Sitemap (`app/sitemap.ts`)

- Returns `MetadataRoute.Sitemap` with `url`, `lastModified`, `changeFrequency`, `priority`.
- Data: `getAllProjects()`, `getPublishedPosts()`; plus static routes.
- Served at `/sitemap.xml` (Next.js convention).

To add a route: append an object to the returned array with `url: `${seo.baseUrl}/your-path`` and appropriate `changeFrequency` / `priority`.

---

## 6. Robots (`app/robots.ts`)

- Returns `MetadataRoute.Robots`: `rules` (allow/disallow), `sitemap`.
- Currently: allow `/`, disallow `/admin`, `/auth`; single sitemap URL.

To add more disallows: add entries to the `disallow` array for the relevant `userAgent`.

---

## 7. JSON-LD (Structured Data)

- **Layout:** `RealEstateAgent` (`@id` for publisher), `WebSite` (with `publisher` reference).
- **Project page:** `RealEstateListing` (name, description, url, image, address).
- **Blog post:** `Article` (headline, description, datePublished, image, author/publisher).

Rendered via `<JsonLd data={object} />`. Keep payloads minimal and valid for [Google’s Rich Results](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).

---

## 8. Open Graph & Twitter Images

- **Default:** `app/opengraph-image.tsx` and `app/twitter-image.tsx` (Edge, 1200×630). No static file required.
- **Per-route override:** Add `opengraph-image.tsx` or `twitter-image.tsx` in that route segment, or set `metadata.openGraph.images` / `metadata.twitter.images` in `generateMetadata()`.

Project and blog pages set OG/Twitter images from `heroImage` / `post.image`; use `absoluteUrl()` when the image path is relative.

---

## 9. Environment

| Variable | Required | Use |
|----------|----------|-----|
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonicals, sitemap, OG/Twitter URLs, JSON-LD. Example: `https://chivana-realestate.com`. |

Without it, `lib/seo.ts` falls back to a default (e.g. Vercel preview URL); always set it in production.

---

## 10. Extending SEO

- **New public page:** Add to `sitemap.ts`, set `metadata` (and `alternates.canonical`), add JSON-LD if it’s a distinct entity type.
- **New default OG/Twitter image:** Edit `app/opengraph-image.tsx` and `app/twitter-image.tsx`, or replace with static files in `app/` if preferred.
- **Structured data:** Add a new schema object and render it with `<JsonLd data={...} />` in the relevant layout or page.
- **Multi-language:** Extend `metadata` with `alternates.languages` and duplicate/handle sitemap and hreflang when you add locales.

---

## 11. Verification & Testing

- **Canonicals:** View page source, check `<link rel="canonical" href="...">`.
- **Sitemap:** Open `https://<your-domain>/sitemap.xml`.
- **Robots:** Open `https://<your-domain>/robots.txt`.
- **Structured data:** [Google Rich Results Test](https://search.google.com/test/rich-results) or [Schema.org Validator](https://validator.schema.org/).
- **OG/Twitter:** [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator) (or equivalent).

---

*Last updated to match the current codebase (central config, sitemap, robots, JSON-LD, dynamic OG/Twitter images).*
