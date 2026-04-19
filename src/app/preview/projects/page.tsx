"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav, PageHead, PageFooter } from "../_components/Nav";
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
            slug: p.repo?.split("/")[1]?.toLowerCase().replace(/_/g, "-") || p.title.toLowerCase().replace(/\s+/g, "-"),
          }));
          setProjects(withSlugs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-16">
        <PageHead number="03" label="Projects" title="Personal Projects." tagline="Deep learning, RL, transformers — built from scratch." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Link
              key={p.title}
              href={`/preview/projects/${p.slug || p.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group rounded-xl overflow-hidden border border-white/5 bg-[#0a1410]/60 backdrop-blur-xl hover:border-[#00e87b]/30 hover:-translate-y-1 transition"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-[#00e87b]/5 to-[#0a1410]/80 flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <Image src={p.image} alt={p.title} width={400} height={225} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/30">{p.repo}</div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.02em] text-[#f4ead5] mb-2 group-hover:text-[#00e87b] transition">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/65 mb-4 line-clamp-3 min-h-[3.8em]">
                  {p.description || "Explore this project on GitHub for details."}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.1em] uppercase text-white/50 bg-white/5 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-[#00e87b]">
                  Read case study →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5">
            Currently exploring
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {focuses.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-r-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 border-l-[3px] border-l-[#00e87b]"
              >
                <div className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.03em] text-[#00e87b] mb-2">
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
