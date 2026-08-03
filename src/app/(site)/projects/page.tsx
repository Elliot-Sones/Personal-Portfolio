import Link from "next/link";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getAllMeta, type ProjectFrontmatter } from "@/lib/mdx";
import { moreRepos } from "@/lib/site-data";

export const metadata = { title: "Projects · Elliot Sones" };

export default async function ProjectsPage() {
  const projects = await getAllMeta<ProjectFrontmatter>("projects");
  projects.sort((a, b) => a.order - b.order);

  return (
    <div className="reveal flex flex-col gap-12" style={{ "--reveal-i": 0 } as React.CSSProperties}>
      <div>
        <SectionHeader title="Projects" />
        <h1 className="page-hed mt-4 text-[clamp(28px,3.6vw,40px)]">
          Deep dives, not an archive.
        </h1>
        <div className="mt-6">
          {projects.length === 0 && (
            <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
              Case studies are being written.
            </p>
          )}
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group flex items-baseline gap-4 border-t border-line py-5"
            >
              <span className="index-num w-7 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="u-draw font-[family-name:var(--font-fraunces)] text-[clamp(20px,2.3vw,24px)] font-medium leading-tight text-ink">
                  {p.title}
                </span>
                <span className="mt-1.5 block font-[family-name:var(--font-fraunces)] text-[13.5px] leading-[1.6] text-inksoft">
                  {p.hook}
                </span>
              </span>
              <span className="hidden gap-1.5 sm:flex">
                {p.badges.map((b) => (
                  <span key={b} className="badge badge-plain">{b}</span>
                ))}
              </span>
              <span className="font-[family-name:var(--font-jbmono)] text-[10px] tabular-nums text-faint">
                {p.year}
              </span>
              <span className="arrow-nudge text-ember opacity-0 group-hover:opacity-100">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="More on GitHub" />
        <div className="mt-2.5">
          {moreRepos.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-3 border-t border-line py-3.5"
            >
              <span className="u-draw shrink-0 font-[family-name:var(--font-jbmono)] text-[12.5px] font-medium text-ink">
                {r.name}
              </span>
              <span className="min-w-0 flex-1 font-[family-name:var(--font-fraunces)] text-[13px] leading-[1.6] text-inksoft">
                {r.description}
              </span>
              <span className="badge badge-plain hidden sm:inline-block">{r.language}</span>
              <span className="arrow-nudge text-ember opacity-0 group-hover:opacity-100">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
