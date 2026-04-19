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

export function GithubActivity() {
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

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-3 w-full">
      {/* STREAK CARD — matches streak-stats.demolab.com dark theme */}
      <div className="rounded-xl bg-[#151515] border border-[#2a2a2a] p-5">
        <div className="grid grid-cols-3 gap-3 text-center h-full items-center">
          {/* Total contributions */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white leading-none">
              {data.totalContributions.toLocaleString()}
            </div>
            <div className="mt-2 text-[11px] text-white/90">Total Contributions</div>
            <div className="mt-1 text-[9px] text-white/50">
              {formatDate(data.startDate)} - Present
            </div>
          </div>

          {/* Current streak */}
          <div className="flex flex-col items-center justify-center border-x border-white/10">
            <div className="relative flex items-center justify-center w-[76px] h-[76px]">
              <svg
                viewBox="0 0 76 76"
                className="absolute inset-0 w-full h-full"
                fill="none"
              >
                <circle cx="38" cy="38" r="34" stroke="#FB8C00" strokeWidth="3" fill="none" />
              </svg>
              <svg
                className="absolute -top-1 left-1/2 -translate-x-1/2"
                width="16"
                height="20"
                viewBox="0 0 32 40"
                fill="#FB8C00"
              >
                <path d="M16 0 C 16 10, 6 10, 6 22 C 6 32, 10 38, 16 38 C 22 38, 26 32, 26 22 C 26 14, 22 12, 22 8 C 20 12, 18 12, 18 6 C 18 2, 16 0, 16 0 Z" />
              </svg>
              <span className="relative text-3xl font-bold text-white leading-none">
                {data.currentStreak}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-[#FB8C00] font-semibold">
              Current Streak
            </div>
            <div className="mt-1 text-[9px] text-white/50">
              {data.currentStreakStart
                ? `${formatDate(data.currentStreakStart)} - ${formatDate(data.currentStreakEnd)}`
                : "—"}
            </div>
          </div>

          {/* Longest streak */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white leading-none">
              {data.longestStreak}
            </div>
            <div className="mt-2 text-[11px] text-white/90">Longest Streak</div>
            <div className="mt-1 text-[9px] text-white/50">
              {data.longestStreakStart
                ? `${formatDate(data.longestStreakStart)} - ${formatDate(data.longestStreakEnd)}`
                : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* CONTRIBUTION GRAPH — GitHub light mode, fills width responsively */}
      <div className="rounded-xl bg-white border border-gray-200 p-4 text-[#24292f] flex flex-col">
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-[13px] font-semibold text-[#24292f]">
            {data.totalContributions.toLocaleString()} contributions in the last year
          </div>
          <a
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#57606a] hover:text-[#0969da] hover:underline"
          >
            @{data.username}
          </a>
        </div>

        {/* Labels + grid use flex; weeks stretch to fill width */}
        <div className="flex gap-[4px] flex-1">
          {/* Day labels */}
          <div className="flex flex-col justify-between py-[14px] shrink-0">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="text-[10px] text-[#57606a] leading-none h-[10px]">
                {d}
              </div>
            ))}
          </div>

          {/* Weeks column — stretches */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Month labels */}
            <div className="relative h-3 mb-1">
              {monthLabels.map((m) => (
                <div
                  key={`${m.weekIndex}-${m.label}`}
                  className="absolute text-[10px] text-[#57606a]"
                  style={{
                    left: `${(m.weekIndex / data.weeks.length) * 100}%`,
                    top: 0,
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid — weeks are flex-1 so they fill; days aspect 1:1 */}
            <div className="flex gap-[3px] flex-1 min-h-0">
              {data.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px] flex-1 min-w-0">
                  {Array.from({ length: 7 }).map((_, di) => {
                    const day = week.days.find((d) => d.weekday === di);
                    if (!day) {
                      return <div key={di} className="aspect-square rounded-[2px]" />;
                    }
                    return (
                      <div
                        key={di}
                        className="aspect-square rounded-[2px] w-full"
                        style={{
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
          </div>
        </div>

        {/* Footer: Learn-how + Less/More legend */}
        <div className="flex items-center justify-between mt-3 pt-2">
          <a
            href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#0969da] hover:underline"
          >
            Learn how we count contributions
          </a>
          <div className="flex items-center gap-1 text-[10px] text-[#57606a]">
            <span>Less</span>
            {LIGHT_LEGEND.map((c, i) => (
              <div
                key={i}
                className="w-[10px] h-[10px] rounded-[2px]"
                style={{
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
  );
}
