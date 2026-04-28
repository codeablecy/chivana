"use client";

import styled from "styled-components";

import { cn } from "@/lib/utils";

const LOADER_MARKS = ["C", "H", "I", "V", "A", "N", "A"] as const;

type LoaderSize = "sm" | "md" | "lg";
type LoaderOrientation = "horizontal" | "vertical";

export type LoaderProps = {
  className?: string;
  label?: string;
  size?: LoaderSize;
  fullScreen?: boolean;
  orientation?: LoaderOrientation;
  tone?: "default" | "inherit";
};

const sizeMap: Record<LoaderSize, string> = {
  sm: "h-6 text-xs [--loader-cell-size:1.65rem] [--loader-gap:0.4rem] [--loader-font-size:0.8rem] [--loader-dot-size:0.22rem]",
  md: "h-10 text-sm [--loader-cell-size:2.5rem] [--loader-gap:0.65rem] [--loader-font-size:1rem] [--loader-dot-size:0.3rem]",
  lg: "h-12 text-base [--loader-cell-size:3rem] [--loader-gap:0.8rem] [--loader-font-size:1.1rem] [--loader-dot-size:0.35rem]",
};

export default function Loader({
  className,
  label = "Cargando...",
  size = "md",
  fullScreen = false,
  orientation = "vertical",
  tone = "default",
}: LoaderProps) {
  return (
    <StyledWrapper
      aria-live="polite"
      aria-busy="true"
      role="status"
      className={cn(
        "flex text-foreground",
        fullScreen &&
          "min-h-screen w-full items-center justify-center bg-background px-6 py-10",
        orientation === "vertical" ? "flex-col gap-4" : "items-center gap-3",
        sizeMap[size],
        tone === "inherit" ? "text-current" : "text-foreground",
        className,
      )}
    >
      <div className="loader-track" aria-hidden="true">
        {LOADER_MARKS.map((mark, index) => (
          <div key={`${mark}-${index}`} className="loader-cell">
            <svg viewBox="0 0 80 80">
              <rect x={8} y={8} width={64} height={64} />
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                className="loader-glyph"
              >
                {mark}
              </text>
            </svg>
          </div>
        ))}
      </div>
      {label ? (
        <span
          className={cn(
            "font-medium tracking-[0.14em] uppercase",
            tone === "inherit" ? "text-current/90" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      ) : (
        <span className="sr-only">Cargando</span>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  --loader-path: hsl(var(--foreground));
  --loader-dot: hsl(var(--accent));
  --loader-duration: 3s;

  &.text-current {
    --loader-path: currentColor;
    --loader-dot: currentColor;
  }

  .loader-track {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--loader-gap);
  }

  .loader-cell {
    position: relative;
    width: var(--loader-cell-size);
    height: var(--loader-cell-size);
    flex: 0 0 auto;
  }

  .loader-cell::before {
    content: "";
    position: absolute;
    top: calc(var(--loader-cell-size) - 7px);
    left: 50%;
    width: var(--loader-dot-size);
    height: var(--loader-dot-size);
    border-radius: 9999px;
    background: var(--loader-dot);
    transform: translate(
      calc(var(--loader-cell-size) * -0.41),
      calc(var(--loader-cell-size) * -0.41)
    );
    animation: loaderDotRect var(--loader-duration)
      cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
  }

  .loader-cell svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .loader-cell rect {
    fill: none;
    stroke: var(--loader-path);
    stroke-width: 10px;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-dasharray: 192 64 192 64;
    stroke-dashoffset: 0;
    animation: loaderPathRect var(--loader-duration)
      cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
  }

  .loader-glyph {
    fill: var(--loader-path);
    font-size: var(--loader-font-size);
    font-weight: 700;
    dominant-baseline: middle;
  }

  @keyframes loaderPathRect {
    25% {
      stroke-dashoffset: 64;
    }

    50% {
      stroke-dashoffset: 128;
    }

    75% {
      stroke-dashoffset: 192;
    }

    100% {
      stroke-dashoffset: 256;
    }
  }

  @keyframes loaderDotRect {
    25% {
      transform: translate(0, 0);
    }

    50% {
      transform: translate(
        calc(var(--loader-cell-size) * 0.41),
        calc(var(--loader-cell-size) * -0.41)
      );
    }

    75% {
      transform: translate(0, calc(var(--loader-cell-size) * -0.82));
    }

    100% {
      transform: translate(
        calc(var(--loader-cell-size) * -0.41),
        calc(var(--loader-cell-size) * -0.41)
      );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-cell::before,
    .loader-cell rect {
      animation-duration: 0.01ms;
      animation-iteration-count: 1;
    }
  }
`;
