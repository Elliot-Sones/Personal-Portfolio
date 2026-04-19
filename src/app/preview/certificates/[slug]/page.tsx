"use client";

import Link from "next/link";
import { use } from "react";
import { Nav, PageFooter } from "../../_components/Nav";
import { certificates } from "../../_lib/data";

export default function CertificateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const c = certificates.find((x) => x.slug === slug);

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

      <main className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16">
        {!c ? (
          <div className="text-center pt-20">
            <p className="font-[family-name:var(--font-jbmono)] text-sm tracking-[0.2em] uppercase text-white/50">
              Certificate not found.
            </p>
            <Link href="/preview/certificates" className="inline-block mt-6 text-[#fbbf24]">
              ← Back to certificates
            </Link>
          </div>
        ) : (
          <>
            <Link
              href="/preview/certificates"
              className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 hover:text-[#fbbf24] transition mb-8 inline-block"
            >
              ← All certificates
            </Link>

            <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#fbbf24] flex items-center gap-3 mb-4">
              <span className="w-7 h-px bg-[#fbbf24]" />
              Certificate · {c.date}
            </div>
            <h1
              className="font-[family-name:var(--font-bricolage)] leading-[0.92] tracking-[-0.03em] text-[#f4ead5] mb-5"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontVariationSettings: '"wdth" 82, "wght" 700',
              }}
            >
              {c.title}
              <span className="text-[#fbbf24]">.</span>
            </h1>
            <p className="font-[family-name:var(--font-fraunces)] italic text-lg text-[#f4ead5]/75 mb-10" style={{ fontVariationSettings: '"opsz" 72' }}>
              {c.issuer}
            </p>

            <div className="rounded-md overflow-hidden border border-[#fbbf24]/25 bg-[#f4ead5] p-3 mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-auto object-contain"
              />
            </div>

            <p className="text-lg leading-[1.7] text-[#f4ead5]/75 mb-8 max-w-3xl">{c.description}</p>

            <div className="flex flex-wrap gap-2 mb-10">
              {c.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-sm font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.15em] uppercase text-[#fbbf24] border border-[#fbbf24]/30"
                >
                  {s}
                </span>
              ))}
            </div>

            <a
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 rounded-sm bg-[#fbbf24] text-[#0a1410] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase font-bold hover:brightness-110 transition"
            >
              Verify on Coursera ↗
            </a>
          </>
        )}
      </main>
      <PageFooter />
    </div>
  );
}
