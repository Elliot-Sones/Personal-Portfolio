"use client";

import { useEffect, useState } from "react";
import type { GithubActivity as GithubActivityData } from "@/app/api/github-activity/route";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

export function GithubActivity({ compact = false }: { compact?: boolean } = {}) {
  const [data, setData] = useState<GithubActivityData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github-activity")
      .then((r) => r.json())
      .then((d: GithubActivityData | { error: string }) => {
        if ("error" in d) setError(d.error);
        else setData(d);
      })
      .catch((e) => setError(String(e)));
  }, []);

  if (error) {
    return (
      <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase">
        Failed to load GitHub activity · {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 rounded-xl border border-white/5 bg-white/95 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-gray-400">
        Loading GitHub activity…
      </div>
    );
  }

  // Month labels: first week that enters a new month (skip duplicates)
  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  data.weeks.forEach((w, wi) => {
    const first = w.days[0];
    if (first) {
      const m = new Date(first.date + "T00:00:00").getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ weekIndex: wi, label: MONTH_NAMES[m] });
        lastMonth = m;
      }
    }
  });

  // GitHub light-mode legend colors
  const LIGHT_LEGEND = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

  // Sizing vars
  const cellSize = compact ? 8 : 10;
  const cellGap = compact ? 2 : 3;
  const streakRing = compact ? 64 : 92;
  const streakNum = compact ? "text-2xl" : "text-4xl";
  const bigNum = compact ? "text-3xl" : "text-5xl";
  const pad = compact ? "p-3" : "p-6";
  const gridPad = compact ? "p-3" : "p-5";

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] gap-3">
      {/* STREAK CARD — stays Stadium Nights dark */}
      <div className={`rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 ${pad}`}>
        <div className="grid grid-cols-3 gap-2 text-center h-full items-center">
          <div className="flex flex-col items-center justify-center">
            <div className={`font-[family-name:var(--font-bebas)] ${bigNum} tracking-[0.01em] text-[#f4ead5] leading-none`}>
              {data.totalContributions.toLocaleString()}
            </div>
            <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.2em] uppercase text-white/70">
              Total
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-white/10">
            <div
              className="relative rounded-full flex items-center justify-center"
              style={{
                width: `${streakRing}px`,
                height: `${streakRing}px`,
                border: "2px solid #00e87b",
                boxShadow: "0 0 16px rgba(0,232,123,0.35), inset 0 0 10px rgba(0,232,123,0.1)",
              }}
            >
              <span className="absolute -top-3 text-sm">⚽</span>
              <span className={`font-[family-name:var(--font-bebas)] ${streakNum} text-[#f4ead5] leading-none`}>
                {data.currentStreak}
              </span>
            </div>
            <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.2em] uppercase text-[#00e87b] font-semibold">
              Streak
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className={`font-[family-name:var(--font-bebas)] ${bigNum} tracking-[0.01em] text-[#f4ead5] leading-none`}>
              {data.longestStreak}
            </div>
            <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.2em] uppercase text-white/70">
              Longest
            </div>
          </div>
        </div>
      </div>

      {/* CONTRIBUTION GRAPH — GitHub light mode, white card, pixel-identical */}
      <div className={`rounded-xl bg-white border border-gray-200 ${gridPad} text-[#24292f]`}>
        <div className="flex items-baseline justify-between mb-2">
          <div className={`${compact ? "text-[12px]" : "text-[15px]"} font-semibold text-[#24292f]`}>
            {data.totalContributions.toLocaleString()} contributions in the last year
          </div>
          {!compact && (
            <a
              href={`https://github.com/${data.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#57606a] hover:text-[#0969da] hover:underline"
            >
              @{data.username}
            </a>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div
              className={`relative h-3 ${compact ? "ml-[24px]" : "ml-[30px]"}`}
              style={{ width: `${data.weeks.length * (cellSize + cellGap)}px` }}
            >
              {monthLabels.map((m) => (
                <div
                  key={`${m.weekIndex}-${m.label}`}
                  className={`absolute ${compact ? "text-[9px]" : "text-[11px]"} text-[#57606a]`}
                  style={{ left: `${m.weekIndex * (cellSize + cellGap)}px`, top: 0 }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex mt-1" style={{ gap: `${cellGap}px` }}>
              {/* Day labels column */}
              <div className="flex flex-col" style={{ gap: `${cellGap}px`, marginRight: "4px" }}>
                {DAY_LABELS.map((d, i) => (
                  <div
                    key={i}
                    className={`${compact ? "text-[9px]" : "text-[11px]"} text-[#57606a] text-right pr-1`}
                    style={{ width: "20px", height: `${cellSize}px`, lineHeight: `${cellSize}px` }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {data.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${cellGap}px` }}>
                  {Array.from({ length: 7 }).map((_, di) => {
                    const day = week.days.find((d) => d.weekday === di);
                    if (!day) {
                      return <div key={di} style={{ width: `${cellSize}px`, height: `${cellSize}px` }} />;
                    }
                    return (
                      <div
                        key={di}
                        className="rounded-[2px]"
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          backgroundColor: day.color,
                          outline: day.count === 0 ? "1px solid rgba(27,31,36,0.06)" : "none",
                          outlineOffset: "-1px",
                        }}
                        title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer: Less/More legend only (skip link in compact) */}
            <div className={`flex items-center ${compact ? "justify-end" : "justify-between"} mt-2`}>
              {!compact && (
                <a
                  href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-[#0969da] hover:underline"
                >
                  Learn how we count contributions
                </a>
              )}
              <div className={`flex items-center gap-1 ${compact ? "text-[9px]" : "text-[11px]"} text-[#57606a]`}>
                <span>Less</span>
                {LIGHT_LEGEND.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-[2px]"
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      backgroundColor: c,
                      outline: i === 0 ? "1px solid rgba(27,31,36,0.06)" : "none",
                      outlineOffset: "-1px",
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
