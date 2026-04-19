"use client";

import RLSoccerGame from "@/components/RLSoccerGame";
import { Nav } from "./_components/Nav";
import { Crosshairs } from "./_components/Crosshairs";
import { SocialIcon } from "./_components/SocialIcon";
import { socials } from "./_lib/data";

export default function PreviewLanding() {
  return (
    <div className="relative isolate h-screen overflow-hidden text-[#f4ead5]">
      {/* Very subtle scanlines over everything */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(244,234,213,1) 0, rgba(244,234,213,1) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <Nav />

      <main className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14 pt-24 pb-6 h-screen flex flex-col justify-center">
        <section className="grid grid-cols-12 gap-6 md:gap-10 items-start">

          {/* LEFT COLUMN ─ Editorial hero */}
          <div className="col-span-12 md:col-span-7 relative pl-4 md:pl-6 py-4">
            {/* vertical hairline */}
            <span aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-[#f4ead5]/20" />

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-7">
              <span className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#00e87b]/90">
                Feature · 001
              </span>
              <span className="h-px w-10 bg-[#f4ead5]/20" />
              <span className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#f4ead5]/45">
                Broadcast &nbsp;·&nbsp; Spring 2026
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-[family-name:var(--font-bricolage)] text-[#f4ead5] leading-[0.86] tracking-[-0.03em] mb-6"
              style={{
                fontSize: "clamp(4rem, 10vw, 8.5rem)",
                fontVariationSettings: '"wdth" 75, "wght" 700',
                fontFeatureSettings: '"ss01"',
              }}
            >
              Elliot<br />Sones<span className="text-[#00e87b]">.</span>
            </h1>

            {/* Italic tagline */}
            <p className="font-[family-name:var(--font-fraunces)] italic text-[#f4ead5]/80 text-xl sm:text-2xl leading-[1.35] max-w-[28rem] mb-8"
              style={{ fontVariationSettings: '"opsz" 72, "SOFT" 100' }}
            >
              Building intelligent agents<span className="text-[#00e87b]">—</span>and the infra that lets them play.
            </p>

            {/* Vitals stat block */}
            <div className="grid grid-cols-4 gap-0 border border-[#f4ead5]/15 rounded-sm bg-[#0a1410]/40 backdrop-blur-md mb-8 max-w-[38rem]">
              {[
                { label: "Position", value: "ML Engineer" },
                { label: "Club", value: "TMU · '26" },
                { label: "Focus", value: "RL · Transformers" },
                { label: "Form", value: "▮▮▮▮▯", accent: true },
              ].map((v, i) => (
                <div
                  key={v.label}
                  className={`px-3 py-3 ${i > 0 ? "border-l border-[#f4ead5]/10" : ""}`}
                >
                  <div className="font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.25em] uppercase text-[#f4ead5]/40">
                    {v.label}
                  </div>
                  <div
                    className={`mt-1.5 font-[family-name:var(--font-jbmono)] text-[12px] tracking-[0.06em] ${v.accent ? "text-[#00e87b]" : "text-[#f4ead5]"}`}
                  >
                    {v.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links — bracket style */}
            <div className="flex flex-wrap gap-x-1 gap-y-1.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group relative inline-flex items-center gap-2 px-3 py-1.5 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.22em] uppercase text-[#f4ead5]/70 hover:text-[#00e87b] transition-colors"
                >
                  {/* bracket corners */}
                  <span className="absolute left-0 top-0 w-2 h-2 border-l border-t border-[#f4ead5]/30 group-hover:border-[#00e87b] transition-colors" />
                  <span className="absolute right-0 top-0 w-2 h-2 border-r border-t border-[#f4ead5]/30 group-hover:border-[#00e87b] transition-colors" />
                  <span className="absolute left-0 bottom-0 w-2 h-2 border-l border-b border-[#f4ead5]/30 group-hover:border-[#00e87b] transition-colors" />
                  <span className="absolute right-0 bottom-0 w-2 h-2 border-r border-b border-[#f4ead5]/30 group-hover:border-[#00e87b] transition-colors" />
                  <SocialIcon name={s.label} className="w-3 h-3" />
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN ─ RL Soccer broadcast frame */}
          <div className="col-span-12 md:col-span-5 relative">
            <div className="relative p-3 bg-[#0a1410]/60 backdrop-blur-md border border-[#f4ead5]/10 rounded-sm">
              <Crosshairs size={10} color="rgba(0, 232, 123, 0.5)" />

              {/* Broadcast header */}
              <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b border-[#f4ead5]/10">
                <div className="flex items-center gap-2 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#00e87b] opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00e87b]" />
                  </span>
                  <span className="text-[#00e87b]">Live Match</span>
                  <span className="text-[#f4ead5]/30">//</span>
                  <span className="text-[#f4ead5]/60">RL-Soccer</span>
                </div>
                <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.15em] uppercase text-[#f4ead5]/40">
                  CH.01 · SOCCER-RL-V2
                </div>
              </div>

              {/* The game */}
              <RLSoccerGame />

              {/* Footer caption */}
              <div className="flex items-center justify-between px-1 pt-2 mt-2 border-t border-[#f4ead5]/10 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.2em] uppercase text-[#f4ead5]/40">
                <span><span className="text-[#00e87b]">●</span> Agent</span>
                <span>PPO · self-play · 2.3M steps</span>
                <span>Play against it ↗</span>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
