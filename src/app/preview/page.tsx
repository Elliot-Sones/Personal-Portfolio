"use client";

import RLSoccerGame from "@/components/RLSoccerGame";
import { Nav, PageFooter } from "./_components/Nav";
import { GithubActivity } from "./_components/GithubActivity";
import { socials } from "./_lib/data";

export default function PreviewLanding() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />

      <main className="mx-auto max-w-[1480px] px-6 sm:px-10 lg:px-16 pt-36 sm:pt-40 pb-16">
        {/* HERO */}
        <section className="grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-start pb-8">
          <div>
            <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3 mb-6">
              <span className="w-7 h-px bg-[#00e87b]" />
              RL · ML · APPLIED AI
            </div>
            <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl lg:text-8xl tracking-[0.01em] text-[#f4ead5] leading-[0.9] mb-5 whitespace-nowrap">
              Elliot Sones.
            </h1>
            <div
              className="font-[family-name:var(--font-jbmono)] text-sm tracking-[0.2em] uppercase text-[#00e87b] mb-6"
              style={{ textShadow: "0 0 20px rgba(0, 232, 123, 0.35)" }}
            >
              ML Engineer &amp; CS Student
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-white/70 max-w-xl mb-8">
              Computer Science student at Toronto Metropolitan University building intelligent agents and deep learning systems. Focused on reinforcement learning, transformer architectures, and applied AI.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="px-3.5 py-1.5 rounded-full border border-white/15 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-[#00e87b] hover:border-[#00e87b]/60 hover:bg-[#00e87b]/5 transition"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <RLSoccerGame />
          </div>
        </section>

        {/* GITHUB ACTIVITY */}
        <section className="py-16 border-t border-white/10">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3">
                <span className="w-7 h-px bg-[#00e87b]" />
                Building in public
              </div>
              <h2 className="font-[family-name:var(--font-bebas)] text-4xl sm:text-5xl tracking-[0.01em] text-[#f4ead5] mt-3 leading-none">
                Live on GitHub.
              </h2>
            </div>
            <a
              href="https://github.com/Elliot-Sones"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-[#00e87b] transition"
            >
              @Elliot-Sones ↗
            </a>
          </div>

          <GithubActivity />
        </section>

      </main>

      <PageFooter />
    </div>
  );
}
