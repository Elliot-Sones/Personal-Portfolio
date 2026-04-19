"use client";

import Image from "next/image";
import Link from "next/link";
import { Nav, PageHead, PageFooter } from "../_components/Nav";
import { hackathons } from "../_lib/data";

export default function ExperiencePage() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-16">
        <PageHead
          number="02"
          label="Experience"
          title="Work & Hackathons."
          tagline="Competitions won, projects shipped, things learned by building."
        />

        <div className="flex flex-col gap-4">
          {hackathons.map((h) => (
            <Link
              key={h.slug}
              href={`/preview/experience/${h.slug}`}
              className={`grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-6 items-start p-6 rounded-r-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 hover:border-white/15 transition group ${
                h.outcome ? "border-l-[3px] border-l-[#fbbf24]" : "border-l-[3px] border-l-[#00e87b]"
              }`}
            >
              <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-white/50 pt-1">
                {h.date}
              </div>
              <div>
                <div className="font-[family-name:var(--font-bebas)] text-2xl tracking-[0.02em] text-[#f4ead5] mb-1 group-hover:text-[#00e87b] transition">
                  {h.name}
                </div>
                {h.project && (
                  <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.15em] uppercase text-white/50 mb-3">
                    {h.project}
                  </div>
                )}
                {h.outcome && (
                  <div
                    className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-[#fbbf24] font-semibold mb-3"
                    style={{ textShadow: "0 0 12px rgba(251, 191, 36, 0.35)" }}
                  >
                    ★ {h.outcome}
                  </div>
                )}
                <p className="text-sm leading-relaxed text-white/70 max-w-2xl">{h.description}</p>
              </div>
              {h.image && (
                <div className="w-full md:w-48 aspect-[3/2] overflow-hidden rounded-lg border border-white/5">
                  <Image
                    src={h.image}
                    alt={h.name}
                    width={192}
                    height={128}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
