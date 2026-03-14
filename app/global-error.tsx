"use client"

import { useEffect } from "react"

/**
 * Root-level error boundary. Catches client-side crashes that replace the
 * whole app (e.g. after browser translation + interaction). Renders its own
 * <html> and <body> so the UI is still visible when the root layout is gone.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[global error boundary]", error)
  }, [error])

  return (
    <html lang="es" translate="no">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#fafafa",
          color: "#171717",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          boxSizing: "border-box",
        }}
      >
        <main
          style={{
            maxWidth: "28rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Algo ha ido mal
          </h1>
          <p
            style={{
              color: "#737373",
              fontSize: "0.875rem",
              lineHeight: 1.5,
              marginBottom: "1.5rem",
            }}
          >
            Si has usado &quot;Traducir página&quot; del navegador (Chrome u otro), la
            página puede haberse roto. <strong>Recarga la página</strong> o
            desactiva la traducción para este sitio y vuelve a entrar.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#fff",
                background: "#e69500",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Intentar de nuevo
            </button>
            <a
              href="/"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "inherit",
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "0.375rem",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Ir al inicio
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
