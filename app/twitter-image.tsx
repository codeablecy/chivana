import { ImageResponse } from "next/og"
import { seo } from "@/lib/seo"

export const runtime = "edge"

export const alt = "Chivana Real Estate"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b1921",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{seo.siteName}</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              padding: "10px 14px",
              borderRadius: 999,
              background: "#e69500",
              color: "#0b1921",
            }}
          >
            Real Estate
          </div>
        </div>

        <div style={{ maxWidth: 980 }}>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.03 }}>
            Viviendas exclusivas
          </div>
          <div style={{ marginTop: 14, fontSize: 28, opacity: 0.92 }}>
            El Viso de San Juan · A 35 km de Madrid · A 33 km de Toledo
          </div>
        </div>
      </div>
    ),
    size,
  )
}

