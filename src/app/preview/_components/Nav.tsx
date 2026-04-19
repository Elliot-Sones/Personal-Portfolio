"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pages } from "../_lib/data";

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-[#0a1410]/85 backdrop-blur-xl border border-white/[0.06]">
          <Link href="/preview" className="font-[family-name:var(--font-bebas)] text-lg tracking-[0.18em] text-[#f4ead5] hover:text-[#00e87b] transition">
            ELLIOT SONES
          </Link>
          <div className="hidden md:flex items-center gap-6 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase">
            {pages.map((p) => {
              const active = pathname === `/preview/${p.slug}` || pathname.startsWith(`/preview/${p.slug}/`);
              return (
                <Link
                  key={p.slug}
                  href={`/preview/${p.slug}`}
                  className={`transition ${active ? "text-[#00e87b]" : "text-white/55 hover:text-[#f4ead5]"}`}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#00e87b]/10 border border-[#00e87b]/30 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.15em] uppercase text-[#00e87b]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00e87b] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00e87b]" />
            </span>
            <span>LIVE</span>
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
    <div className="pb-10 mb-10 border-b border-white/10">
      <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3">
        <span className="w-7 h-px bg-[#00e87b]" />
        {number} / {label}
      </div>
      <h1 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-7xl tracking-[0.01em] text-[#f4ead5] mt-4 leading-[0.9]">
        {title}
      </h1>
      {tagline && (
        <p className="mt-5 text-lg text-white/70 max-w-2xl leading-relaxed">{tagline}</p>
      )}
    </div>
  );
}

export function PageFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-8 py-10 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-white/30 border-t border-white/5 flex items-center justify-between">
      <Link href="/preview" className="hover:text-[#00e87b] transition">← Back to home</Link>
      <span>© 2026 Elliot Sones · Preview</span>
    </footer>
  );
}
