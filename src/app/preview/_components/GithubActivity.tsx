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
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2.3fr)] gap-5">
      {/* STREAK CARD — stays Stadium Nights dark */}
      <div className="rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 p-6">
        <div className="grid grid-cols-3 gap-2 text-center h-full items-center">
          <div className="flex flex-col items-center justify-center py-2">
            <div className="font-[family-name:var(--font-bebas)] text-5xl tracking-[0.01em] text-[#f4ead5] leading-none">
              {data.totalContributions.toLocaleString()}
            </div>
            <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/70">
              Total
            </div>
            <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.1em] uppercase text-white/40">
              {formatDate(data.startDate)} — {formatDate(data.endDate)}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-white/10 py-2">
            <div
              className="relative w-[92px] h-[92px] rounded-full flex items-center justify-center"
              style={{
                border: "3px solid #00e87b",
                boxShadow: "0 0 24px rgba(0,232,123,0.35), inset 0 0 16px rgba(0,232,123,0.1)",
              }}
            >
              <span className="absolute -top-4 text-lg">⚽</span>
              <span className="font-[family-name:var(--font-bebas)] text-4xl text-[#f4ead5] leading-none">
                {data.currentStreak}
              </span>
            </div>
            <div className="mt-3 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-[#00e87b] font-semibold">
              Current Streak
            </div>
            <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.1em] uppercase text-white/40">
              {data.currentStreakStart
                ? `${formatDate(data.currentStreakStart)} — ${formatDate(data.currentStreakEnd)}`
                : "—"}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <div className="font-[family-name:var(--font-bebas)] text-5xl tracking-[0.01em] text-[#f4ead5] leading-none">
              {data.longestStreak}
            </div>
            <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/70">
              Longest
            </div>
            <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.1em] uppercase text-white/40">
              {data.longestStreakStart
                ? `${formatDate(data.longestStreakStart)} — ${formatDate(data.longestStreakEnd)}`
                : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* CONTRIBUTION GRAPH — GitHub light mode, white card, pixel-identical */}
      <div className="rounded-xl bg-white border border-gray-200 p-5 text-[#24292f]">
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-[15px] font-semibold text-[#24292f]">
            {data.totalContributions.toLocaleString()} contributions in the last year
          </div>
          <a
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[#57606a] hover:text-[#0969da] hover:underline"
          >
            @{data.username}
          </a>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="relative h-4 ml-[30px]" style={{ width: `${data.weeks.length * 13}px` }}>
              {monthLabels.map((m) => (
                <div
                  key={`${m.weekIndex}-${m.label}`}
                  className="absolute text-[11px] text-[#57606a]"
                  style={{ left: `${m.weekIndex * 13}px`, top: 0 }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px] mt-1">
              {/* Day labels column */}
              <div className="flex flex-col gap-[3px] mr-[6px]">
                {DAY_LABELS.map((d, i) => (
                  <div
                    key={i}
                    className="w-6 h-[10px] text-[11px] text-[#57606a] leading-[10px] text-right pr-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {data.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, di) => {
                    const day = week.days.find((d) => d.weekday === di);
                    if (!day) {
                      return <div key={di} className="w-[10px] h-[10px]" />;
                    }
                    return (
                      <div
                        key={di}
                        className="w-[10px] h-[10px] rounded-[2px]"
                        style={{
                          backgroundColor: day.color, // exact color GitHub's API returns
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

            {/* Footer: Learn-how link + Less/More legend */}
            <div className="flex items-center justify-between mt-4">
              <a
                href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#0969da] hover:underline"
              >
                Learn how we count contributions
              </a>
              <div className="flex items-center gap-1 text-[11px] text-[#57606a]">
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
      </div>
    </div>
  );
}
