"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { Nav, PageFooter } from "../../_components/Nav";
import { hackathons } from "../../_lib/data";

export default function ExperienceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const h = hackathons.find((x) => x.slug === slug);

  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(244,234,213,1) 0, rgba(244,234,213,1) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <Nav />

      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16">
        {!h ? (
          <div className="text-center pt-20">
            <p className="font-[family-name:var(--font-jbmono)] text-sm tracking-[0.2em] uppercase text-white/50">
              Experience not found.
            </p>
            <Link href="/preview/experience" className="inline-block mt-6 text-[#00e87b]">
              ← Back to experience
            </Link>
          </div>
        ) : (
          <>
            <Link
              href="/preview/experience"
              className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 hover:text-[#00e87b] transition mb-8 inline-block"
            >
              ← All experience
            </Link>

            <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3 mb-4">
              <span className="w-7 h-px bg-[#00e87b]" />
              Experience · {h.date}
            </div>
            <h1
              className="font-[family-name:var(--font-bricolage)] leading-[0.9] tracking-[-0.03em] text-[#f4ead5] mb-5"
              style={{
                fontSize: "clamp(3rem, 6vw, 5rem)",
                fontVariationSettings: '"wdth" 80, "wght" 700',
              }}
            >
              {h.name}
              <span className="text-[#00e87b]">.</span>
            </h1>
            <p
              className="font-[family-name:var(--font-fraunces)] italic text-xl sm:text-2xl text-[#f4ead5]/80 leading-[1.4] max-w-3xl mb-6"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              {h.project}
            </p>

            {h.outcome && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#fbbf24]/10 border border-[#fbbf24]/40 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-[#fbbf24] font-semibold mb-8"
                style={{ textShadow: "0 0 12px rgba(251, 191, 36, 0.4)" }}
              >
                ★ {h.outcome}
              </div>
            )}

            {h.image && (
              <div className="aspect-video rounded-md overflow-hidden border border-[#f4ead5]/10 bg-[#0a1410]/60 mb-10">
                <Image
                  src={h.image}
                  alt={h.name}
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-lg leading-[1.7] text-[#f4ead5]/75 mb-10 max-w-3xl">{h.description}</p>

            <div className="flex flex-wrap gap-3 mb-12">
              {h.git && (
                <a
                  href={h.git}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-sm border border-[#00e87b] text-[#00e87b] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase hover:bg-[#00e87b]/10 transition"
                >
                  View on GitHub ↗
                </a>
              )}
              {h.link && (
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-sm bg-[#00e87b] text-[#0a1410] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase font-bold hover:brightness-110 transition"
                >
                  View project ↗
                </a>
              )}
            </div>
          </>
        )}
      </main>
      <PageFooter />
    </div>
  );
}
