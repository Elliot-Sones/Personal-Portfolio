"use client";

import { useEffect, useState } from "react";

export function Ticker() {
  const [time, setTime] = useState<string>("");
  const [commits, setCommits] = useState<number | null>(null);

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-activity")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || d?.error) return;
        const today = new Date().toISOString().slice(0, 10);
        const weeks: { days: { date: string; count: number }[] }[] = d.weeks ?? [];
        let todayCount = 0;
        for (const w of weeks) for (const day of w.days) if (day.date === today) todayCount = day.count;
        setCommits(todayCount);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] border-b border-[#f4ead5]/10 bg-[#0a1410]/90 backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] flex items-center justify-between px-4 sm:px-8 py-1.5 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-[#f4ead5]/70">
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00e87b] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00e87b]" />
            </span>
            <span className="text-[#00e87b]">On Air</span>
          </span>
          <span className="hidden sm:inline opacity-40">//</span>
          <span className="hidden sm:inline">Transmitting · Toronto · Ontario</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {commits !== null && (
            <>
              <span>
                <span className="opacity-40 mr-2">Commits/24h</span>
                <span className="text-[#f4ead5]">{String(commits).padStart(3, "0")}</span>
              </span>
              <span className="hidden sm:inline opacity-40">//</span>
            </>
          )}
          <span className="hidden sm:inline">
            <span className="opacity-40 mr-2">Signal</span>
            <span className="text-[#f4ead5]">▂▃▅▇</span>
          </span>
          <span className="hidden sm:inline opacity-40">//</span>
          <span className="tabular-nums text-[#f4ead5]">{time || "00:00:00"}</span>
        </div>
      </div>
    </div>
  );
}
