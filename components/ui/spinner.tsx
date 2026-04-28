"use client"

import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type SpinnerProps = {
  className?: string
  label?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
}

export function Spinner({
  className,
  label,
  size = "md",
  fullScreen = false,
}: SpinnerProps) {
  const spinner = (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "inline-flex items-center justify-center gap-2",
        fullScreen && "flex min-h-screen w-full flex-col bg-background px-6 py-10",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-accent", sizeMap[size])} aria-hidden="true" />
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
      {!label ? <span className="sr-only">Cargando</span> : null}
    </span>
  )

  return spinner
}
