"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";

const reduceMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(reduceMotionQuery);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function HoverMorph({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const enabled = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(reduceMotionQuery).matches,
    () => false,
  );

  const active = enabled && hovered;

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontVariationSettings: active ? '"opsz" 144, "wght" 800' : '"opsz" 40, "wght" 600',
        transition: "font-variation-settings 0.35s ease",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}
