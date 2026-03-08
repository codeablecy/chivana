# 360° Tour – Centralized setup

## Platform-agnostic

Tours from **any provider** that offer an embed URL work: Matterport, Wizio, or others. The app stores the URL and embeds it in an iframe; there is no provider-specific logic.

## Single source of truth

- **Data**: `project.gallery.tour360` (array of `{ url: string; thumb?: string }`) is the only place 360 tours are stored.
- **Public UI**: `components/project/project-gallery.tsx` reads `gallery.tour360` and shows the inline preview + fullscreen for any project that has at least one URL.

## Admin

- **Create project** (Step 3 Medios): optional “Tour 360°” field – paste the embed URL (Matterport, Wizio, etc.).
- **Edit project** → Medios → Tour 360°: add, remove, or reorder multiple tour URLs.


