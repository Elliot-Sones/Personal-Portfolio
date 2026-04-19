"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pages } from "../_lib/data";
import { Ticker } from "./Ticker";

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      <Ticker />
      <header className="fixed top-[28px] left-0 right-0 z-50 px-4 sm:px-8">
        <nav className="mx-auto max-w-[1600px] flex items-center justify-between gap-4 py-4 border-b border-[#f4ead5]/10">
          <Link
            href="/preview"
            className="flex items-baseline gap-3 group"
          >
            <span className="font-[family-name:var(--font-bricolage)] text-xl font-light tracking-[-0.01em] text-[#f4ead5] group-hover:text-[#00e87b] transition"
              style={{ fontVariationSettings: '"wdth" 75, "wght" 600' }}
            >
              Elliot Sones
            </span>
            <span className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#f4ead5]/40">
              /prt-26
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.22em] uppercase">
            {pages.map((p, i) => {
              const active =
                pathname === `/preview/${p.slug}` ||
                pathname.startsWith(`/preview/${p.slug}/`);
              return (
                <Link
                  key={p.slug}
                  href={`/preview/${p.slug}`}
                  className={`group flex items-baseline gap-1.5 transition ${active ? "text-[#00e87b]" : "text-[#f4ead5]/55 hover:text-[#f4ead5]"}`}
                >
                  <span className={`text-[9px] ${active ? "text-[#00e87b]/70" : "text-[#f4ead5]/30"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{p.label}</span>
                  {active && <span className="text-[#00e87b]">●</span>}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
}

export function PageHead({
  number,
  label,
  title,
  tagline,
}: {
  number: string;
  label: string;
  title: string;
  tagline?: string;
}) {
  return (
    <div className="pb-10 mb-10 border-b border-[#f4ead5]/10">
      <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3">
        <span className="w-7 h-px bg-[#00e87b]" />
        {number} / {label}
      </div>
      <h1
        className="font-[family-name:var(--font-bricolage)] text-5xl sm:text-7xl tracking-[-0.02em] text-[#f4ead5] mt-4 leading-[0.9]"
        style={{ fontVariationSettings: '"wdth" 80, "wght" 700' }}
      >
        {title}
      </h1>
      {tagline && (
        <p className="mt-5 font-[family-name:var(--font-fraunces)] italic text-lg text-[#f4ead5]/65 max-w-2xl leading-relaxed">
          {tagline}
        </p>
      )}
    </div>
  );
}

export function PageFooter() {
  return (
    <footer className="mx-auto max-w-[1600px] px-8 py-10 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#f4ead5]/30 border-t border-[#f4ead5]/10 flex items-center justify-between">
      <Link href="/preview" className="hover:text-[#00e87b] transition">← Back to home</Link>
      <span>© 2026 Elliot Sones · end of transmission</span>
    </footer>
  );
}
