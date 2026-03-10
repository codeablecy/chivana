"use client"

import { useEffect, useRef, type RefObject } from "react"

/**
 * Scrolls a ref's element into view when dependencies change.
 * Prevents jarring layout jumps when switching tabs, steps, or content that changes height.
 * Skips the initial mount so we only scroll on user-driven changes.
 *
 * @param ref - Ref to the element to scroll into view (e.g. content wrapper)
 * @param deps - Dependency array; when any value changes, scroll is triggered
 * @param options - Optional scroll options (default: smooth, block start)
 */
export function useScrollToTopOnChange(
  ref: RefObject<HTMLElement | null>,
  deps: unknown[],
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "start" }
): void {
  const isInitial = useRef(true)

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }
    ref.current?.scrollIntoView(options)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
