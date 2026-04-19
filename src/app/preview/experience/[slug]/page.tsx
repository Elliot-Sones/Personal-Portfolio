"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { Nav, PageFooter } from "../../_components/Nav";
import { hackathons } from "../../_lib/data";

export default function ExperienceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const h = hackathons.find((x) => x.slug === slug);

  if (!h) {
    return (
      <div className="relative isolate min-h-screen text-[#f4ead5]">
        <Nav />
        <main className="mx-auto max-w-4xl px-8 pt-40 pb-16 text-center">
          <p className="font-[family-name:var(--font-jbmono)] text-sm tracking-[0.2em] uppercase text-white/50">
            Experience not found.
          </p>
          <Link href="/preview/experience" className="inline-block mt-6 text-[#00e87b]">
            ← Back to experience
          </Link>
        </main>
        <PageFooter />
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-16">
        <Link
          href="/preview/experience"
          className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 hover:text-[#00e87b] transition mb-6 inline-block"
        >
          ← All experience
        </Link>

        <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3 mb-4">
          <span className="w-7 h-px bg-[#00e87b]" />
          Experience · {h.date}
        </div>
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-7xl tracking-[0.01em] leading-[0.9] mb-5">
          {h.name}.
        </h1>
        <p className="font-[family-name:var(--font-jbmono)] text-sm tracking-[0.15em] uppercase text-white/60 mb-6">
          {h.project}
        </p>

        {h.outcome && (
          <div className="inline-block px-4 py-2 rounded-md bg-[#fbbf24]/10 border border-[#fbbf24]/30 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-[#fbbf24] font-semibold mb-8" style={{ textShadow: "0 0 12px rgba(251,191,36,0.35)" }}>
            ★ {h.outcome}
          </div>
        )}

        {h.image && (
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl mb-10">
            <Image src={h.image} alt={h.name} width={1200} height={675} className="w-full h-full object-cover" />
          </div>
        )}

        <p className="text-lg leading-relaxed text-white/75 mb-10 max-w-3xl">{h.description}</p>

        <div className="flex flex-wrap gap-3 mb-12">
          {h.git && (
            <a
              href={h.git}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-md border border-[#00e87b] text-[#00e87b] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-[#00e87b]/10 transition"
            >
              View on GitHub ↗
            </a>
          )}
          {h.link && (
            <a
              href={h.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-md bg-[#00e87b] text-[#0a1410] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase font-bold hover:brightness-110 transition"
            >
              View project ↗
            </a>
          )}
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
