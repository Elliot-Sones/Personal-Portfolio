"use client";

import { motion } from "framer-motion";
import RLSoccerGame from "@/components/RLSoccerGame";
import { Nav } from "./_components/Nav";
import { GithubActivity } from "./_components/GithubActivity";
import { socials } from "./_lib/data";

export default function PreviewLanding() {
  return (
    <div className="relative isolate h-screen overflow-hidden text-[#f4ead5] flex flex-col">
      <Nav />

      <main className="flex-1 min-h-0 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-6">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 min-h-0">

          {/* LEFT COLUMN: Hero (top) + GitHub (bottom) */}
          <div className="flex flex-col gap-5 min-h-0">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3 mb-3">
                <span className="w-7 h-px bg-[#00e87b]" />
                RL · ML · APPLIED AI
              </div>
              <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-[0.01em] text-[#f4ead5] leading-[0.88] mb-3">
                Elliot Sones.
              </h1>
              <div
                className="font-[family-name:var(--font-jbmono)] text-[13px] tracking-[0.2em] uppercase text-[#00e87b] mb-4"
                style={{ textShadow: "0 0 20px rgba(0, 232, 123, 0.35)" }}
              >
                ML Engineer &amp; CS Student · TMU
              </div>
              <p className="text-sm leading-relaxed text-white/70 max-w-xl mb-5">
                Building intelligent agents and deep learning systems. Focused on reinforcement learning, transformer architectures, and applied AI.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="px-3 py-1 rounded-full border border-white/15 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-[#00e87b] hover:border-[#00e87b]/60 hover:bg-[#00e87b]/5 transition"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* GitHub — fills remaining space */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-1 min-h-0"
            >
              <GithubActivity />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: RL soccer game, full height */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex flex-col rounded-2xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl p-4 min-h-0"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/50 flex-shrink-0">
              <span>RL Soccer · Live</span>
              <span className="text-[#00e87b]">Interactive</span>
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <RLSoccerGame />
            </div>
          </motion.div>

          {/* Mobile-only: RL game collapsed */}
          <div className="lg:hidden rounded-2xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl p-3">
            <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">
              RL Soccer · scroll down on home unavailable in single-view
            </div>
            <RLSoccerGame />
          </div>
        </div>
      </main>
    </div>
  );
}
