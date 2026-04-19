"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav, PageHead, PageFooter } from "../_components/Nav";
import { GithubActivity } from "../_components/GithubActivity";
import { fallbackProjects, focuses, type Project } from "../_lib/data";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    fetch("/api/pinned-repos")
      .then((r) => r.json())
      .then((d) => {
        if (d.projects?.length) {
          const withSlugs = d.projects.map((p: Project) => ({
            ...p,
            slug:
              p.repo?.split("/")[1]?.toLowerCase().replace(/_/g, "-") ||
              p.title.toLowerCase().replace(/\s+/g, "-"),
          }));
          setProjects(withSlugs);
        }
      })
      .catch(() => {});
  }, []);

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
        {/* GitHub activity */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3">
              <span className="w-7 h-px bg-[#00e87b]" />
              Live on GitHub
            </div>
            <a
              href="https://github.com/Elliot-Sones"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-[#00e87b] transition"
            >
              @Elliot-Sones ↗
            </a>
          </div>
          <GithubActivity />
        </section>

        <PageHead
          number="03"
          label="Projects"
          title="Personal Projects."
          tagline="Deep learning, RL, transformers — built from scratch."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <Link
              key={p.title}
              href={`/preview/projects/${p.slug || p.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative rounded-md overflow-hidden border border-[#f4ead5]/10 bg-[#0a1410]/70 backdrop-blur-md hover:border-[#00e87b]/40 hover:-translate-y-0.5 transition-all"
            >
              {/* subtle corner crosshairs */}
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-l border-t border-[#f4ead5]/25 group-hover:border-[#00e87b] transition z-10" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-r border-t border-[#f4ead5]/25 group-hover:border-[#00e87b] transition z-10" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-l border-b border-[#f4ead5]/25 group-hover:border-[#00e87b] transition z-10" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-r border-b border-[#f4ead5]/25 group-hover:border-[#00e87b] transition z-10" />

              {/* index badge */}
              <div className="absolute top-3 right-3 z-10 font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.25em] uppercase text-[#f4ead5]/50">
                {String(i + 1).padStart(2, "0")} / pinned
              </div>

              {/* banner */}
              <div className="relative aspect-[16/9] bg-gradient-to-br from-[#00e87b]/5 to-[#0a1410] overflow-hidden">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-bricolage)] text-5xl text-[#00e87b]/15 tracking-[-0.04em]"
                    style={{ fontVariationSettings: '"wdth" 75, "wght" 700' }}
                  >
                    {p.title.split(" ")[0]}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a1410] to-transparent" />
              </div>

              {/* body */}
              <div className="p-5">
                <h3
                  className="font-[family-name:var(--font-bricolage)] text-xl tracking-[-0.01em] text-[#f4ead5] mb-2 group-hover:text-[#00e87b] transition"
                  style={{ fontVariationSettings: '"wdth" 85, "wght" 650' }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/65 mb-4 line-clamp-3 min-h-[3.8em]">
                  {p.description || "Explore this project on GitHub for details."}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-sm font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.12em] uppercase text-white/55 bg-white/5 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-[#00e87b] inline-flex items-center gap-2">
                  Read case study
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Focus areas */}
        <div className="mt-16 pt-10 border-t border-[#f4ead5]/10">
          <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-[#f4ead5]/30" />
            Currently exploring
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {focuses.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-sm bg-[#0a1410]/60 backdrop-blur-md border border-[#f4ead5]/10 border-l-[3px] border-l-[#00e87b]"
              >
                <div
                  className="font-[family-name:var(--font-bricolage)] text-xl tracking-[-0.01em] text-[#00e87b] mb-2"
                  style={{ fontVariationSettings: '"wdth" 85, "wght" 650' }}
                >
                  {f.title}
                </div>
                <p className="text-sm leading-relaxed text-white/70">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
