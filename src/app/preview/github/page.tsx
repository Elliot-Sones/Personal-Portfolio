"use client";

import { Nav, PageHead, PageFooter } from "../_components/Nav";

export default function GithubPage() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-16">
        <PageHead number="04" label="GitHub" title="Building in public." tagline="Streaks, commits, and live activity pulled from GitHub." />

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://streak-stats.demolab.com?user=Elliot-Sones&theme=dark&hide_border=true&background=0a1410&stroke=f4ead5&ring=00e87b&fire=00e87b&currStreakLabel=00e87b&sideLabels=f4ead5&sideNums=f4ead5&currStreakNum=f4ead5&dates=f4ead5"
              alt="GitHub streak stats"
              className="w-full max-w-md"
            />
          </div>
          <div className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-stats.vercel.app/api?username=Elliot-Sones&show_icons=true&theme=dark&hide_border=true&bg_color=0a1410&title_color=00e87b&text_color=f4ead5&icon_color=00e87b"
              alt="GitHub stats"
              className="w-full max-w-md"
            />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5">
          <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 mb-4">
            Last 12 months
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ghchart.rshah.org/00e87b/Elliot-Sones"
            alt="GitHub contribution grid"
            className="w-full"
            style={{ filter: "brightness(1.1)" }}
          />
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <div className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=Elliot-Sones&layout=compact&theme=dark&hide_border=true&bg_color=0a1410&title_color=00e87b&text_color=f4ead5"
              alt="Top languages"
              className="w-full"
            />
          </div>
          <div className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 flex items-center justify-center">
            <a
              href="https://github.com/Elliot-Sones"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-bebas)] text-3xl tracking-[0.03em] text-[#f4ead5] hover:text-[#00e87b] transition"
            >
              @Elliot-Sones ↗
            </a>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
