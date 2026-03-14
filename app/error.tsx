"use client"

import { useEffect } from "react"
import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Segment-level error boundary. Catches client-side errors (e.g. after
 * browser translation mutates the DOM and React reconciliation fails).
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[error boundary]", error)
  }, [error])

  const isLikelyTranslation = typeof window !== "undefined" && (
    error?.message?.includes("hydration") ||
    error?.message?.includes("Minified React") ||
    document.documentElement.classList.contains("translated") ||
    document.documentElement.getAttribute("translate") === "yes"
  )

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-xl font-semibold text-foreground">
          Algo ha ido mal
        </h1>
        <p className="text-muted-foreground text-sm">
          {isLikelyTranslation ? (
            <>
              Si has usado &quot;Traducir página&quot; del navegador, puede que la
              página se haya roto. Prueba a{" "}
              <strong>recargar la página</strong> o a desactivar la traducción
              para este sitio.
            </>
          ) : (
            "Se ha producido un error inesperado. Puedes intentar de nuevo o volver al inicio."
          )}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-[#e69500] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e69500] focus-visible:ring-offset-2"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
