"use client";

import { useEffect, useState } from "react";
import RLSoccerGame from "@/components/RLSoccerGame";
import { Ticker } from "./_components/Ticker";
import { WindowFrame } from "./_components/WindowFrame";
import { SocialIcon } from "./_components/SocialIcon";
import { socials } from "./_lib/data";

const WINDOW_IDS = ["profile", "vitals", "rl-soccer"] as const;
type WindowId = (typeof WINDOW_IDS)[number];

export default function PreviewLanding() {
  const [order, setOrder] = useState<WindowId[]>([...WINDOW_IDS]);
  const [resetKey, setResetKey] = useState(0);
  const [hint, setHint] = useState(true);

  const bringForward = (id: string) => {
    setOrder((prev) => [...prev.filter((x) => x !== id), id as WindowId]);
  };

  const resetLayout = () => {
    WINDOW_IDS.forEach((id) => {
      try {
        localStorage.removeItem(`preview-window:v3:${id}`);
      } catch {
        /* ignore */
      }
    });
    setResetKey((k) => k + 1);
  };

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const zFor = (id: string) => {
    const idx = order.indexOf(id as WindowId);
    return idx === -1 ? 1 : 10 + idx;
  };

  return (
    <div className="relative isolate h-screen overflow-hidden text-[#f4ead5]">
      {/* Scanline overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(244,234,213,1) 0, rgba(244,234,213,1) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <Ticker />

      {/* Reset button, bottom-right */}
      <button
        onClick={resetLayout}
        className="fixed bottom-4 right-4 z-[55] font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.22em] uppercase text-[#f4ead5]/50 hover:text-[#00e87b] transition px-2.5 py-1.5 border border-[#f4ead5]/15 hover:border-[#00e87b]/50 rounded-sm bg-[#0a1410]/60 backdrop-blur-md"
      >
        ↺ Reset Layout
      </button>

      {/* Desktop canvas — starts below ticker */}
      <div id="desktop-canvas" className="fixed inset-0 top-[30px] overflow-hidden">
        {/* Drag hint */}
        <div
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-3 z-[5] flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#f4ead5]/15 bg-[#0a1410]/80 backdrop-blur-md font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#f4ead5]/60 transition-opacity duration-1000 ${hint ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-[#00e87b]">◢</span>
          <span>Drag the title bars · Resize from corners · Layout saves</span>
        </div>

        {/* PROFILE WINDOW — big, top-left (where hero always was) */}
        <WindowFrame
          key={`profile-${resetKey}`}
          id="profile"
          title="profile"
          subtitle="elliot-sones"
          defaultState={{ x: 24, y: 56, width: 660, height: 520 }}
          minWidth={420}
          minHeight={360}
          zIndex={zFor("profile")}
          onFocus={bringForward}
          bodyClassName="p-7"
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#00e87b]/90">
                Feature · 001
              </span>
              <span className="h-px flex-1 bg-[#f4ead5]/15" />
              <span className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#f4ead5]/40">
                Spring 2026
              </span>
            </div>

            <h1
              className="font-[family-name:var(--font-bricolage)] text-[#f4ead5] leading-[0.86] tracking-[-0.03em] mb-4 whitespace-nowrap"
              style={{
                fontSize: "clamp(3rem, 6.5vw, 6rem)",
                fontVariationSettings: '"wdth" 75, "wght" 700',
              }}
            >
              Elliot Sones<span className="text-[#00e87b]">.</span>
            </h1>

            <p
              className="font-[family-name:var(--font-fraunces)] italic text-[#f4ead5]/80 text-xl leading-[1.35] mb-5"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Building intelligent agents<span className="text-[#00e87b]">—</span>and the infra that lets them play.
            </p>

            <p className="text-sm leading-relaxed text-[#f4ead5]/60 mb-7">
              Computer Science student at Toronto Metropolitan University building intelligent agents and deep learning systems. Focused on reinforcement learning, transformer architectures, and applied AI.
            </p>

            <div className="flex flex-wrap gap-x-1 gap-y-1.5 mt-auto">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group relative inline-flex items-center gap-2 px-2.5 py-1.5 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.22em] uppercase text-[#f4ead5]/70 hover:text-[#00e87b] transition-colors"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <span className="absolute left-0 top-0 w-1.5 h-1.5 border-l border-t border-[#f4ead5]/30 group-hover:border-[#00e87b] transition-colors" />
                  <span className="absolute right-0 top-0 w-1.5 h-1.5 border-r border-t border-[#f4ead5]/30 group-hover:border-[#00e87b] transition-colors" />
                  <span className="absolute left-0 bottom-0 w-1.5 h-1.5 border-l border-b border-[#f4ead5]/30 group-hover:border-[#00e87b] transition-colors" />
                  <span className="absolute right-0 bottom-0 w-1.5 h-1.5 border-r border-b border-[#f4ead5]/30 group-hover:border-[#00e87b] transition-colors" />
                  <SocialIcon name={s.label} className="w-3 h-3" />
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </WindowFrame>

        {/* VITALS WINDOW — under profile */}
        <WindowFrame
          key={`vitals-${resetKey}`}
          id="vitals"
          title="vitals"
          subtitle="player-card"
          defaultState={{ x: 24, y: 600, width: 660, height: 150 }}
          minWidth={420}
          minHeight={120}
          zIndex={zFor("vitals")}
          onFocus={bringForward}
          bodyClassName="p-0"
          noScroll
        >
          <div className="h-full grid grid-cols-4 divide-x divide-[#f4ead5]/08">
            {[
              { label: "Position", value: "ML Engineer" },
              { label: "Club", value: "TMU · '26" },
              { label: "Focus", value: "RL · Transformers" },
              { label: "Form", value: "▮▮▮▮▯", accent: true },
            ].map((v) => (
              <div
                key={v.label}
                className="px-4 py-4 flex flex-col justify-center"
              >
                <div className="font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.3em] uppercase text-[#f4ead5]/40">
                  {v.label}
                </div>
                <div
                  className={`mt-2 font-[family-name:var(--font-jbmono)] text-[13px] tracking-[0.05em] ${v.accent ? "text-[#00e87b]" : "text-[#f4ead5]"}`}
                >
                  {v.value}
                </div>
              </div>
            ))}
          </div>
        </WindowFrame>

        {/* RL SOCCER WINDOW — right side, full height */}
        <WindowFrame
          key={`rl-soccer-${resetKey}`}
          id="rl-soccer"
          title="rl-soccer"
          subtitle="ch.01 · soccer-rl-v2"
          live
          defaultState={{ x: 700, y: 56, width: 700, height: 694 }}
          minWidth={460}
          minHeight={420}
          zIndex={zFor("rl-soccer")}
          onFocus={bringForward}
          bodyClassName="p-0"
          noScroll
        >
          <div
            className="w-full h-full"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <RLSoccerGame />
          </div>
        </WindowFrame>
      </div>
    </div>
  );
}
