"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RLSoccerGame from "@/components/RLSoccerGame";
import { Nav, PageFooter } from "./_components/Nav";
import { pages, socials } from "./_lib/data";

const descriptions: Record<string, string> = {
  about: "Soccer, anime, music, Portugal, and the rest of me.",
  experience: "Hackathons, internships, and the work behind the wins.",
  projects: "Deep learning, RL, transformers — built from scratch.",
  github: "Streaks, commits, and live activity.",
  certificates: "Stanford · DeepLearning.AI · U. Michigan.",
  contact: "Reach out. I read everything.",
};

export default function PreviewLanding() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-16">
        {/* HERO */}
        <section className="grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3 mb-6">
              <span className="w-7 h-px bg-[#00e87b]" />
              RL · ML · APPLIED AI
            </div>
            <h1 className="font-[family-name:var(--font-bebas)] text-7xl sm:text-8xl tracking-[0.01em] text-[#f4ead5] leading-[0.88] mb-5">
              Elliot<br />Sones.
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
          </motion.div>

          <div className="hidden md:block">
            <div className="rounded-2xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl p-4">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/50">
                <span>RL Soccer · Live</span>
                <span className="text-[#00e87b]">Interactive</span>
              </div>
              <RLSoccerGame />
            </div>
          </div>
        </section>

        {/* SECTION CARDS */}
        <section className="py-10 border-t border-white/10">
          <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-white/50 mb-8">
            Explore
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((p) => (
              <Link
                key={p.slug}
                href={`/preview/${p.slug}`}
                className="group p-7 rounded-xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl hover:border-[#00e87b]/40 hover:-translate-y-1 transition"
              >
                <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-white/40 mb-2">
                  {p.number}
                </div>
                <div className="font-[family-name:var(--font-bebas)] text-3xl tracking-[0.03em] text-[#f4ead5] group-hover:text-[#00e87b] transition mb-3">
                  {p.label}.
                </div>
                <p className="text-sm leading-relaxed text-white/60 mb-5 min-h-[3em]">
                  {descriptions[p.slug]}
                </p>
                <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-[#00e87b] group-hover:translate-x-1 transition">
                  Enter →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
