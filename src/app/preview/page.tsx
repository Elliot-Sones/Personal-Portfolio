"use client";

import { useEffect, useState } from "react";
import RLSoccerGame from "@/components/RLSoccerGame";
import { Nav } from "./_components/Nav";
import { WindowFrame } from "./_components/WindowFrame";
import { SocialIcon } from "./_components/SocialIcon";
import { GithubActivity } from "./_components/GithubActivity";
import { socials } from "./_lib/data";

const WINDOW_IDS = ["profile", "rl-soccer", "github", "vitals"] as const;
type WindowId = (typeof WINDOW_IDS)[number];

export default function PreviewLanding() {
  const [focus, setFocus] = useState<WindowId>("profile");
  const [order, setOrder] = useState<WindowId[]>([...WINDOW_IDS]);
  const [resetKey, setResetKey] = useState(0);
  const [hint, setHint] = useState(true);

  const bringForward = (id: string) => {
    setFocus(id as WindowId);
    setOrder((prev) => [...prev.filter((x) => x !== id), id as WindowId]);
  };

  const resetLayout = () => {
    WINDOW_IDS.forEach((id) => {
      try {
        localStorage.removeItem(`preview-window:v2:${id}`);
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

      <Nav />

      {/* Toolbar */}
      <div className="fixed top-[68px] right-4 sm:right-8 z-[55] flex items-center gap-3">
        <button
          onClick={resetLayout}
          className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.22em] uppercase text-[#f4ead5]/55 hover:text-[#00e87b] transition px-2 py-1 border border-[#f4ead5]/15 hover:border-[#00e87b]/60 rounded-sm"
        >
          ↺ Reset Layout
        </button>
      </div>

      {/* Desktop canvas */}
      <div
        id="desktop-canvas"
        className="fixed inset-0 top-[96px] overflow-hidden"
      >
        {/* Drag hint — fades after a few seconds */}
        <div
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-4 z-[5] flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#f4ead5]/15 bg-[#0a1410]/80 backdrop-blur-md font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#f4ead5]/60 transition-opacity duration-1000 ${hint ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-[#00e87b]">◢</span>
          <span>Drag windows · Resize corners · Layout saves</span>
        </div>

        <WindowFrame
          key={`profile-${resetKey}`}
          id="profile"
          title="profile"
          subtitle="about"
          defaultState={{ x: 24, y: 12, width: 500, height: 490 }}
          minWidth={360}
          minHeight={320}
          zIndex={zFor("profile")}
          onFocus={bringForward}
          bodyClassName="p-6"
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
              className="font-[family-name:var(--font-bricolage)] text-[#f4ead5] leading-[0.88] tracking-[-0.03em] mb-4"
              style={{
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                fontVariationSettings: '"wdth" 75, "wght" 700',
              }}
            >
              Elliot Sones<span className="text-[#00e87b]">.</span>
            </h1>

            <p
              className="font-[family-name:var(--font-fraunces)] italic text-[#f4ead5]/80 text-lg leading-[1.4] mb-5"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Building intelligent agents
              <span className="text-[#00e87b]">—</span>and the infra that lets them play.
            </p>

            <p className="text-sm leading-relaxed text-[#f4ead5]/60 mb-6">
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

        <WindowFrame
          key={`rl-soccer-${resetKey}`}
          id="rl-soccer"
          title="rl-soccer"
          subtitle="ch.01 · soccer-rl-v2"
          live
          defaultState={{ x: 540, y: 12, width: 620, height: 490 }}
          minWidth={420}
          minHeight={380}
          zIndex={zFor("rl-soccer")}
          onFocus={bringForward}
          noScroll
          bodyClassName="p-0"
        >
          <div
            className="w-full h-full"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <RLSoccerGame />
          </div>
        </WindowFrame>

        <WindowFrame
          key={`github-${resetKey}`}
          id="github"
          title="github-activity"
          subtitle="building in public"
          defaultState={{ x: 24, y: 516, width: 1152, height: 220 }}
          minWidth={540}
          minHeight={200}
          zIndex={zFor("github")}
          onFocus={bringForward}
          bodyClassName="p-4"
          noScroll
        >
          <div
            className="h-full"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GithubActivity />
          </div>
        </WindowFrame>

        <WindowFrame
          key={`vitals-${resetKey}`}
          id="vitals"
          title="vitals"
          subtitle="player-card"
          defaultState={{ x: 1176, y: 12, width: 220, height: 490 }}
          minWidth={220}
          minHeight={280}
          zIndex={zFor("vitals")}
          onFocus={bringForward}
          bodyClassName="p-0"
        >
          <div className="h-full flex flex-col">
            {[
              { label: "Position", value: "ML Engineer", mono: true },
              { label: "Club", value: "TMU · '26", mono: true },
              { label: "Focus", value: "Reinforcement Learning · Transformers", mono: false },
              { label: "Form", value: "▮▮▮▮▯", accent: true, mono: true },
              { label: "Languages", value: "Python · TypeScript · Go", mono: true },
              { label: "Stack", value: "PyTorch · Next.js · Supabase", mono: true },
            ].map((v, i) => (
              <div
                key={v.label}
                className={`px-4 py-3 flex-1 flex flex-col justify-center ${i > 0 ? "border-t border-[#f4ead5]/08" : ""}`}
              >
                <div className="font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.3em] uppercase text-[#f4ead5]/40">
                  {v.label}
                </div>
                <div
                  className={`mt-1 ${v.mono ? "font-[family-name:var(--font-jbmono)] text-[12px]" : "font-[family-name:var(--font-bricolage)] text-base"} tracking-[0.02em] ${v.accent ? "text-[#00e87b]" : "text-[#f4ead5]"}`}
                >
                  {v.value}
                </div>
              </div>
            ))}
          </div>
        </WindowFrame>
      </div>
    </div>
  );
}
