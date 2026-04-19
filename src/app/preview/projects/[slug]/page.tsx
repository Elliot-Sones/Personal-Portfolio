"use client";

import Link from "next/link";
import { use } from "react";

const caseStudies: Record<string, {
  title: string;
  subtitle: string;
  label: string;
  meta: { label: string; value: string }[];
  sections: { heading: string; body: string[] }[];
}> = {
  "rl-soccer": {
    title: "Teaching an Agent to Play Soccer.",
    subtitle:
      "A PPO agent trained to play soccer from a custom 2D environment — the one you can play against in the hero on the home page.",
    label: "Case Study · Reinforcement Learning",
    meta: [
      { label: "Stack", value: "PyTorch · Gymnasium · Canvas" },
      { label: "Training", value: "2.3M steps · 14 hours" },
      { label: "Source", value: "GitHub ↗" },
      { label: "Live demo", value: "Play on home ↗" },
    ],
    sections: [
      {
        heading: "The Problem",
        body: [
          "Most RL tutorials stop at CartPole. I wanted something I could actually watch — an agent that has to learn spatial reasoning, timing, and long-horizon credit assignment. Soccer felt right: simple enough to simulate, hard enough to mean something when it works.",
        ],
      },
      {
        heading: "The Environment",
        body: [
          "Built a 2D pitch in Canvas with ball physics, goal posts, and a simple opponent. Observation space is 84-dim: positions, velocities, ball state, distances to goals. Action space is continuous — movement + kick intensity.",
        ],
      },
      {
        heading: "Reward Shaping (Why It Kept Failing)",
        body: [
          "First reward: +1 for scoring, 0 otherwise. The agent never learned — the sparse signal meant thousands of episodes with no gradient.",
          "Fix: a three-stage curriculum. First reward touching the ball. Then reward moving the ball toward the goal. Then reward scoring. Each stage unlocks when the prior one converges.",
        ],
      },
      {
        heading: "What I Learned",
        body: [
          "Reward shaping matters more than algorithm choice at this scale. What took the agent from dribbling randomly to scoring on purpose was staring at episode recordings for an hour and realizing it wasn't even aiming — added a cosine-angle term and the curve climbed the next day.",
        ],
      },
    ],
  },
};

const fallback = {
  title: "Project Case Study.",
  subtitle: "Full writeup coming soon. For now, explore the source on GitHub.",
  label: "Case Study",
  meta: [{ label: "Status", value: "Writeup in progress" }],
  sections: [] as { heading: string; body: string[] }[],
};

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const cs = caseStudies[slug] ?? fallback;

  return (
    <div className="relative isolate min-h-screen text-[#f4ead5] font-[family-name:var(--font-jbmono)]">
      <div className="bg-[#fbbf24]/10 border-b border-[#fbbf24]/30 text-[#fbbf24] text-[11px] tracking-[0.25em] uppercase text-center py-2.5">
        Preview · Sub-page · /preview/projects/{slug}
      </div>

      <header className="fixed top-2 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-[#0a1410]/80 backdrop-blur-xl border border-white/[0.06]">
          <div className="flex items-center gap-4">
            <Link href="/preview" className="text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-[#00e87b] transition">
              ← Home
            </Link>
            <div className="w-px h-4 bg-white/15" />
            <div className="font-[family-name:var(--font-bebas)] text-lg tracking-[0.18em] text-[#f4ead5]">
              ELLIOT SONES
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#00e87b]/10 border border-[#00e87b]/30 text-[10px] tracking-[0.15em] uppercase text-[#00e87b]">
            <span className="w-1.5 h-1.5 bg-[#00e87b] rounded-full" />
            <span>{slug.toUpperCase()}</span>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20">
        <section className="py-12">
          <div className="max-w-3xl">
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3 mb-6">
              <span className="w-7 h-px bg-[#00e87b]" />
              {cs.label}
            </div>
            <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-[0.01em] leading-[0.9] mb-6">
              {cs.title}
            </h1>
            <p className="font-sans text-lg sm:text-xl leading-relaxed text-white/75 mb-10">
              {cs.subtitle}
            </p>
            <div className="flex flex-wrap gap-8 py-5 border-y border-white/10">
              {cs.meta.map((m) => (
                <div key={m.label}>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-white/50">{m.label}</div>
                  <div className="text-sm text-[#f4ead5] mt-1 font-sans">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="aspect-video rounded-xl border border-white/10 bg-gradient-to-br from-[#00e87b]/5 to-[#0a1410]/80 flex items-center justify-center text-[11px] tracking-[0.25em] uppercase text-white/40 my-10">
          [ Screenshot or embedded demo ]
        </div>

        {cs.sections.length > 0 && (
          <article className="max-w-3xl mx-auto font-sans">
            {cs.sections.map((sec) => (
              <div key={sec.heading}>
                <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-[0.02em] text-[#f4ead5] mt-12 mb-4">
                  {sec.heading}
                </h2>
                {sec.body.map((p, i) => (
                  <p key={i} className="text-lg leading-[1.75] text-white/75 mb-4">
                    {p}
                  </p>
                ))}
              </div>
            ))}

            {slug === "rl-soccer" && (
              <div className="my-10 p-6 rounded-xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl">
                <div className="text-[11px] tracking-[0.25em] uppercase text-white/50 mb-3">
                  Reward Curve · 2.3M Steps
                </div>
                <svg viewBox="0 0 800 250" className="w-full h-auto">
                  <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(244,234,213,0.1)" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(244,234,213,0.05)" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(244,234,213,0.05)" />
                  <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(244,234,213,0.05)" />
                  <path
                    d="M0,200 C100,195 200,190 300,198 S400,150 500,100 S650,60 800,40"
                    stroke="#00e87b"
                    strokeWidth="2.5"
                    fill="none"
                    style={{ filter: "drop-shadow(0 0 6px rgba(0,232,123,0.5))" }}
                  />
                  <circle cx="300" cy="198" r="4" fill="#fbbf24" />
                  <text x="310" y="195" fill="rgba(244,234,213,0.7)" fontSize="11" fontFamily="monospace">
                    curriculum stage 2 unlocks
                  </text>
                </svg>
              </div>
            )}

            <div className="flex flex-wrap gap-3 my-10">
              <Link
                href="/preview"
                className="px-6 py-3 rounded-md bg-[#00e87b] text-[#0a1410] text-[11px] tracking-[0.25em] uppercase font-bold hover:brightness-110 transition"
              >
                Play on home ↗
              </Link>
              <a
                href="https://github.com/Elliot-Sones"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-md border border-[#00e87b] text-[#00e87b] text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-[#00e87b]/10 transition"
              >
                View on GitHub ↗
              </a>
            </div>
          </article>
        )}

        <section className="mt-16 pt-8 border-t border-white/10">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#00e87b] mb-6">More projects</div>
          <div className="grid sm:grid-cols-3 gap-4">
            {["transformers", "rl-fighting-agent", "neural-networks-fundamentals"]
              .filter((s) => s !== slug)
              .slice(0, 3)
              .map((s) => (
                <Link
                  key={s}
                  href={`/preview/projects/${s}`}
                  className="p-5 rounded-xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl hover:border-[#00e87b]/30 hover:-translate-y-1 transition"
                >
                  <div className="aspect-video mb-4 rounded-lg bg-gradient-to-br from-[#00e87b]/5 to-[#0a1410]/80" />
                  <div className="font-[family-name:var(--font-bebas)] text-lg tracking-[0.02em] text-[#f4ead5] capitalize">
                    {s.replace(/-/g, " ")}
                  </div>
                  <div className="text-[11px] tracking-[0.25em] uppercase text-[#00e87b] mt-3">
                    Read case study →
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
