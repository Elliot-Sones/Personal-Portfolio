"use client";

export function FilmOverlay() {
  return (
    <>
      {/* Subtle pixel-style scanlines for retro game feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
          )`,
          backgroundSize: "100% 4px",
        }}
      />

      {/* Very subtle noise texture - less than before for cleaner pixel look */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[99] opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Cozy vignette - softer for warm feeling */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[98]"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 55%, var(--vignette-color) 100%)`,
        }}
      />
    </>
  );
}
