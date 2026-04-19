"use client";

import Link from "next/link";
import { Nav, PageHead, PageFooter } from "../_components/Nav";
import { certificates } from "../_lib/data";

export default function CertificatesPage() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      {/* scanline overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(244,234,213,1) 0, rgba(244,234,213,1) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <Nav />
      <main className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14 pt-32 sm:pt-36 pb-16">
        <PageHead
          number="05"
          label="Certificates"
          title="Credentials."
          tagline="Stanford · DeepLearning.AI · University of Michigan."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((c, i) => (
            <Link
              key={c.slug}
              href={`/preview/certificates/${c.slug}`}
              className="group relative rounded-md overflow-hidden border border-[#fbbf24]/15 bg-[#0a1410]/70 backdrop-blur-xl hover:border-[#fbbf24]/45 transition-all hover:-translate-y-0.5"
            >
              {/* index badge */}
              <div className="absolute top-3 left-3 z-10 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#fbbf24]/80 bg-[#0a1410]/80 backdrop-blur-md px-2 py-0.5 rounded-sm border border-[#fbbf24]/20">
                {String(i + 1).padStart(2, "0")} / credential
              </div>

              {/* image — plain img, object-contain on light canvas */}
              <div className="relative aspect-[4/3] bg-[#f4ead5] overflow-hidden flex items-center justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              <div className="p-5">
                <h3 className="font-[family-name:var(--font-bricolage)] text-xl tracking-[-0.01em] text-[#f4ead5] leading-tight mb-1.5 line-clamp-2 group-hover:text-[#fbbf24] transition"
                  style={{ fontVariationSettings: '"wdth" 85, "wght" 650' }}
                >
                  {c.title}
                </h3>
                <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.22em] uppercase text-white/50 mb-3">
                  {c.issuer} · {c.date}
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.12em] uppercase text-[#fbbf24] border border-[#fbbf24]/25"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#fbbf24]/80 group-hover:text-[#fbbf24] transition inline-flex items-center gap-2">
                  View credential
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
