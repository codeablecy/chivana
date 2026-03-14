import { ImageResponse } from "next/og"
import { seo } from "@/lib/seo"

export const runtime = "edge"

export const alt = "Chivana Real Estate"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background:
            "radial-gradient(1200px 630px at 15% 20%, #2b5168 0%, #132a36 45%, #0b1921 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: "#e69500",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 0.2 }}>
            {seo.siteName}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          El Mirador del Viso de San Juan
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 26,
            lineHeight: 1.3,
            opacity: 0.92,
            maxWidth: 980,
          }}
        >
          Casas exclusivas cerca de Madrid y Toledo · 4 dormitorios · Sostenibles
        </div>
      </div>
    ),
    size,
  )
}

