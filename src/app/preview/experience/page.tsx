"use client";

import Image from "next/image";
import Link from "next/link";
import { Nav, PageHead, PageFooter } from "../_components/Nav";
import { hackathons } from "../_lib/data";

// Differentiate items by their flavor
type ExpKind = "win" | "internship" | "hackathon" | "big-featured";

function classify(h: (typeof hackathons)[number]): ExpKind {
  if (h.slug === "ntangible") return "internship";
  if (h.outcome && /1st|won google|won/i.test(h.outcome)) return "win";
  if (h.slug === "splxutspan-2026" || h.slug === "hack-canada-2026") return "big-featured";
  return "hackathon";
}

const MONTH_SHORT: Record<string, string> = {
  january: "JAN", february: "FEB", march: "MAR", april: "APR", may: "MAY", june: "JUN",
  july: "JUL", august: "AUG", september: "SEP", october: "OCT", november: "NOV", december: "DEC",
};

function fmtDate(date: string) {
  const [m, y] = date.split(" ");
  return { month: MONTH_SHORT[m.toLowerCase()] ?? m.slice(0, 3).toUpperCase(), year: y };
}

export default function ExperiencePage() {
  const featured = hackathons.filter((h) => classify(h) === "win" || classify(h) === "big-featured");
  const rest = hackathons.filter((h) => classify(h) === "internship" || classify(h) === "hackathon");

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

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 pt-32 sm:pt-36 pb-16">
        <PageHead
          number="02"
          label="Experience"
          title="Work & Hackathons."
          tagline="Competitions won, projects shipped, things learned by building."
        />

        {/* FEATURED — big wins get 2-col cards with prominent imagery */}
        <section className="mb-12">
          <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#fbbf24]/80 mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-[#fbbf24]" />
            Featured · wins &amp; flagships
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((h) => {
              const { month, year } = fmtDate(h.date);
              return (
                <Link
                  key={h.slug}
                  href={`/preview/experience/${h.slug}`}
                  className="group relative rounded-md overflow-hidden border border-[#fbbf24]/20 hover:border-[#fbbf24]/60 bg-[#0a1410]/70 backdrop-blur-md transition-all hover:-translate-y-0.5"
                >
                  {/* gold corner brackets */}
                  <span className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[#fbbf24]/80 z-10" />
                  <span className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[#fbbf24]/80 z-10" />
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[#fbbf24]/80 z-10" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[#fbbf24]/80 z-10" />

                  {/* banner image or gradient fallback */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#fbbf24]/10 to-[#0a1410]">
                    {h.image ? (
                      <Image
                        src={h.image}
                        alt={h.name}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#fbbf24]/20 font-[family-name:var(--font-bricolage)] text-6xl tracking-[-0.05em]" style={{ fontVariationSettings: '"wdth" 75, "wght" 700' }}>
                        {h.name.split(" ")[0]}
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a1410] to-transparent" />
                  </div>

                  {/* content */}
                  <div className="p-5 relative">
                    {/* date badge top-left absolute */}
                    <div className="absolute -top-8 left-5 px-2 py-1 bg-[#0a1410] border border-[#fbbf24]/40 rounded-sm font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-[#fbbf24]">
                      {month} {year}
                    </div>

                    <h3
                      className="font-[family-name:var(--font-bricolage)] text-2xl tracking-[-0.01em] text-[#f4ead5] mb-1 group-hover:text-[#fbbf24] transition"
                      style={{ fontVariationSettings: '"wdth" 85, "wght" 650' }}
                    >
                      {h.name}
                    </h3>
                    <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-[#f4ead5]/55 mb-3">
                      {h.project}
                    </div>

                    {h.outcome && (
                      <div
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-[#fbbf24]/10 border border-[#fbbf24]/30 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#fbbf24] font-semibold mb-3"
                        style={{ textShadow: "0 0 12px rgba(251, 191, 36, 0.4)" }}
                      >
                        ★ {h.outcome}
                      </div>
                    )}

                    <p className="text-sm leading-relaxed text-[#f4ead5]/70 line-clamp-3 mb-3">{h.description}</p>

                    <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#fbbf24]/80 group-hover:text-[#fbbf24] inline-flex items-center gap-2">
                      Read case
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* TIMELINE — smaller row items for the rest */}
        <section>
          <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#00e87b]/80 mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-[#00e87b]" />
            Timeline · internships &amp; hackathons
          </div>

          <div className="relative">
            {/* vertical rule */}
            <span aria-hidden className="absolute left-[84px] top-2 bottom-2 w-px bg-[#f4ead5]/10" />

            <div className="flex flex-col gap-3">
              {rest.map((h) => {
                const { month, year } = fmtDate(h.date);
                const kind = classify(h);
                const accent = kind === "internship" ? "#00e87b" : "#f4ead5";

                return (
                  <Link
                    key={h.slug}
                    href={`/preview/experience/${h.slug}`}
                    className="group relative flex items-stretch gap-5"
                  >
                    {/* Date column */}
                    <div className="w-[84px] shrink-0 flex flex-col items-start pt-4">
                      <div
                        className="font-[family-name:var(--font-bricolage)] text-2xl leading-none text-[#f4ead5]/90"
                        style={{ fontVariationSettings: '"wdth" 80, "wght" 650' }}
                      >
                        {month}
                      </div>
                      <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] text-[#f4ead5]/40 mt-0.5">
                        {year}
                      </div>
                    </div>

                    {/* Dot on rule */}
                    <div className="absolute left-[78px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#0a1410] bg-[#0a1410] ring-1 ring-[#f4ead5]/20 z-10 group-hover:ring-[#00e87b]/60 transition">
                      <span
                        className="absolute inset-[3px] rounded-full transition"
                        style={{ background: kind === "internship" ? accent : "transparent" }}
                      />
                    </div>

                    {/* Content row */}
                    <div
                      className="flex-1 flex items-center gap-4 py-3 pl-6 pr-4 rounded-sm border border-transparent hover:border-[#f4ead5]/10 hover:bg-[#0a1410]/50 transition ml-[14px]"
                    >
                      {/* kind badge */}
                      <div
                        className="shrink-0 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded-sm border"
                        style={{
                          color: accent,
                          borderColor: kind === "internship" ? `${accent}50` : "rgba(244,234,213,0.2)",
                          background: kind === "internship" ? `${accent}10` : "transparent",
                        }}
                      >
                        {kind === "internship" ? "Intern" : "Hackathon"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <div
                            className="font-[family-name:var(--font-bricolage)] text-lg tracking-[-0.005em] text-[#f4ead5] group-hover:text-[#00e87b] transition"
                            style={{ fontVariationSettings: '"wdth" 88, "wght" 600' }}
                          >
                            {h.name}
                          </div>
                          {h.outcome && (
                            <span className="font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.2em] uppercase text-[#fbbf24]">
                              ★ {h.outcome}
                            </span>
                          )}
                        </div>
                        <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.15em] uppercase text-[#f4ead5]/45 mt-0.5 truncate">
                          {h.project}
                        </div>
                      </div>

                      {/* thumb if image */}
                      {h.image && (
                        <div className="hidden md:block w-16 h-16 rounded-sm overflow-hidden border border-[#f4ead5]/10 shrink-0">
                          <Image
                            src={h.image}
                            alt={h.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <span className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-[#f4ead5]/30 group-hover:text-[#00e87b] transition shrink-0">
                        ↗
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <PageFooter />
    </div>
  );
}
