"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { Nav, PageFooter } from "../../_components/Nav";
import { certificates } from "../../_lib/data";

export default function CertificateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const c = certificates.find((x) => x.slug === slug);

  if (!c) {
    return (
      <div className="relative isolate min-h-screen text-[#f4ead5]">
        <Nav />
        <main className="mx-auto max-w-4xl px-8 pt-40 pb-16 text-center">
          <p className="font-[family-name:var(--font-jbmono)] text-sm tracking-[0.2em] uppercase text-white/50">
            Certificate not found.
          </p>
          <Link href="/preview/certificates" className="inline-block mt-6 text-[#fbbf24]">
            ← Back to certificates
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
          href="/preview/certificates"
          className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 hover:text-[#fbbf24] transition mb-6 inline-block"
        >
          ← All certificates
        </Link>

        <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#fbbf24] flex items-center gap-3 mb-4">
          <span className="w-7 h-px bg-[#fbbf24]" />
          Certificate · {c.date}
        </div>
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-[0.01em] leading-[0.9] mb-5">
          {c.title}.
        </h1>
        <p className="font-[family-name:var(--font-jbmono)] text-sm tracking-[0.15em] uppercase text-white/60 mb-8">
          {c.issuer}
        </p>

        <div className="rounded-xl overflow-hidden border border-[#fbbf24]/20 bg-[#0a1410]/60 backdrop-blur-xl mb-10">
          <Image src={c.image} alt={c.title} width={1400} height={1000} className="w-full h-auto object-contain" />
        </div>

        <p className="text-lg leading-relaxed text-white/75 mb-8 max-w-3xl">{c.description}</p>

        <div className="flex flex-wrap gap-2 mb-10">
          {c.skills.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-md font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.15em] uppercase text-[#fbbf24] border border-[#fbbf24]/30"
            >
              {s}
            </span>
          ))}
        </div>

        <a
          href={c.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded-md bg-[#fbbf24] text-[#0a1410] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase font-bold hover:brightness-110 transition"
        >
          Verify on Coursera ↗
        </a>
      </main>
      <PageFooter />
    </div>
  );
}
