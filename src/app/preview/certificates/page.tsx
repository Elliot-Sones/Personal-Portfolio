"use client";

import Image from "next/image";
import Link from "next/link";
import { Nav, PageHead, PageFooter } from "../_components/Nav";
import { certificates } from "../_lib/data";

export default function CertificatesPage() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-16">
        <PageHead
          number="05"
          label="Certificates"
          title="Credentials."
          tagline="Stanford · DeepLearning.AI · University of Michigan."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((c) => (
            <Link
              key={c.slug}
              href={`/preview/certificates/${c.slug}`}
              className="group rounded-xl overflow-hidden border border-[#fbbf24]/15 bg-[#0a1410]/60 backdrop-blur-xl hover:border-[#fbbf24]/40 hover:-translate-y-1 transition"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-[#fbbf24]/8 to-[#0a1410]/80 overflow-hidden">
                <Image src={c.image} alt={c.title} width={400} height={300} className="w-full h-full object-cover object-top group-hover:scale-105 transition" />
              </div>
              <div className="p-5">
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.02em] text-[#f4ead5] leading-tight mb-1.5 line-clamp-2 group-hover:text-[#fbbf24] transition">
                  {c.title}
                </h3>
                <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.18em] uppercase text-white/50 mb-3">
                  {c.issuer} · {c.date}
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.1em] uppercase text-[#fbbf24] border border-[#fbbf24]/25">
                      {s}
                    </span>
                  ))}
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
