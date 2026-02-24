"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestedTags?: string[]
  className?: string
  disabled?: boolean
}

/**
 * Tag input for amenities/tags. Add with Enter or comma, remove by clicking X.
 * Awwwards-inspired minimal design with suggested tags.
 */
export function TagInput({
  value,
  onChange,
  placeholder = "Añadir etiqueta...",
  suggestedTags = [],
  className,
  disabled,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const addTag = React.useCallback(
    (tag: string) => {
      const t = tag.trim()
      if (!t || value.includes(t)) return
      onChange([...value, t])
      setInputValue("")
    },
    [value, onChange]
  )

  const removeTag = React.useCallback(
    (idx: number) => {
      onChange(value.filter((_, i) => i !== idx))
    },
    [value, onChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const suggested = suggestedTags.filter((s) => !value.includes(s))

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex flex-wrap gap-2 rounded-lg border border-input bg-background px-3 py-2 min-h-[42px]",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        {value.map((tag, i) => (
          <Badge
            key={`${tag}-${i}`}
            variant="secondary"
            className="gap-1 pr-1 py-1 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
              aria-label={`Eliminar ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue.trim() && addTag(inputValue)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[120px] flex-1 h-8 px-0"
          disabled={disabled}
        />
      </div>
      {suggested.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggested.slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
