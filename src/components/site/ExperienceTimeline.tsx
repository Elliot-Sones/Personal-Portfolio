"use client";

import { useEffect, useState } from "react";
import type { ExperienceItem } from "@/lib/site-data";

const toIdx = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

export function ExperienceTimeline({
  items,
  now,
}: {
  items: ExperienceItem[];
  now: string; // "YYYY-MM", passed from server to avoid hydration drift
}) {
  const [selected, setSelected] = useState<ExperienceItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const minIdx = Math.min(...items.map((i) => toIdx(i.start)));
  const maxIdx = toIdx(now);
  const span = maxIdx - minIdx + 1;
  const pos = (ym: string) => ((toIdx(ym) - minIdx) / span) * 100;
  const barWidth = (i: ExperienceItem) =>
    (((i.end ? toIdx(i.end) : maxIdx + 1) - toIdx(i.start)) / span) * 100;

  const minYear = Math.floor(minIdx / 12);
  const maxYear = Math.floor(maxIdx / 12);
  const years: { label: string; x: number }[] = [];
  for (let y = minYear + 1; y <= maxYear; y++) {
    years.push({ label: String(y), x: pos(`${y}-01`) });
  }

  return (
    <div className="mt-6">
      {/* axis header */}
      <div className="relative h-7 font-[family-name:var(--font-jbmono)] text-[12px] uppercase tracking-[0.14em] text-faint">
        {years.map((y) => (
          <span
            key={y.label}
            className="absolute -translate-x-1/2"
            style={{ left: `${y.x}%` }}
          >
            {y.label}
          </span>
        ))}
        <span className="absolute right-0 text-ember">now</span>
      </div>

      {/* lanes */}
      <div className="relative overflow-x-auto">
        <div className="relative min-w-[1000px]">
          {/* year gridlines */}
          {years.map((y) => (
            <div
              key={y.label}
              className="absolute top-0 bottom-0 w-px bg-[#d9d0ba]"
              style={{ left: `${y.x}%` }}
            />
          ))}
          {items.map((e) => {
            const l = pos(e.start);
            const w = barWidth(e);
            const narrow = w < 15;
            const labelRight = l + w < 60;
            return (
              <div key={e.role} className="relative h-[96px]">
                <button
                  onClick={() => setSelected(e)}
                  style={{ left: `${l}%`, width: `${w}%` }}
                  className={`group absolute top-1/2 flex h-16 min-w-[60px] -translate-y-1/2 cursor-pointer items-center gap-3 overflow-hidden rounded-full px-4 transition-colors ${
                    e.current
                      ? "bg-ember text-paper hover:bg-[#a04826]"
                      : "border border-line bg-raised text-inksoft hover:border-ember"
                  }`}
                  aria-label={`${e.role} at ${e.org} — details`}
                >
                  {e.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.logo}
                      alt=""
                      className={`h-9 w-9 shrink-0 rounded-full border border-line object-contain p-[4px] ${
                        e.logoDark ? "bg-[#151515]" : "bg-raised"
                      }`}
                    />
                  )}
                  {!narrow && (
                    <span className="truncate font-[family-name:var(--font-jbmono)] text-[14px] font-medium">
                      {e.short ?? e.role}
                    </span>
                  )}
                </button>
                {narrow && (
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-[family-name:var(--font-jbmono)] text-[13px] text-inksoft ${
                      labelRight ? "" : "text-right"
                    }`}
                    style={
                      labelRight
                        ? { left: `calc(${l + w}% + 10px)` }
                        : { right: `calc(${100 - l}% + 10px)` }
                    }
                  >
                    {e.short ?? e.role}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[10.5px] text-faint">
        click a bar for details
      </div>

      {/* detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" />
          <div
            className="relative max-h-[85vh] w-full max-w-[620px] overflow-y-auto rounded-[8px] border border-line bg-raised p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 cursor-pointer font-[family-name:var(--font-jbmono)] text-[11px] text-mute hover:text-ember"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="flex items-start gap-4">
              {selected.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.logo}
                  alt={`${selected.org} logo`}
                  className={`h-11 w-11 shrink-0 rounded-[6px] border border-line object-contain p-1.5 ${
                    selected.logoDark ? "bg-[#151515]" : ""
                  }`}
                />
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-[family-name:var(--font-fraunces)] text-[21px] font-medium leading-snug text-ink">
                    {selected.role}
                  </span>
                  {selected.current && (
                    <span className="badge badge-live">current</span>
                  )}
                </div>
                <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[10.5px] uppercase tracking-[0.14em] text-mute">
                  {selected.org}
                </div>
                <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[10px] text-faint">
                  {selected.period}
                </div>
              </div>
            </div>
            <p className="mt-4 font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.7] text-inksoft">
              {selected.detail}
            </p>
            {selected.more && (
              <p className="mt-2 font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.7] text-inksoft">
                {selected.more}
              </p>
            )}
            {selected.highlights && selected.highlights.length > 0 && (
              <div className="mt-5 border-t border-line pt-4">
                <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.18em] text-mute">
                  What I did
                </div>
                <ul className="mt-2.5 flex flex-col gap-2.5">
                  {selected.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-3 font-[family-name:var(--font-fraunces)] text-[14.5px] leading-[1.65] text-inksoft"
                    >
                      <span
                        className="mt-[10px] h-[3px] w-[14px] shrink-0 rounded-full bg-ember"
                        aria-hidden
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selected.link && (
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-[family-name:var(--font-jbmono)] text-[11px] text-ember u-draw"
              >
                Link ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
