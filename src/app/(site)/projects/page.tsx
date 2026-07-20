import Link from "next/link";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getAllMeta, type ProjectFrontmatter } from "@/lib/mdx";
import { moreRepos } from "@/lib/site-data";

export const metadata = { title: "Projects — Elliot Sones" };

export default async function ProjectsPage() {
  const projects = await getAllMeta<ProjectFrontmatter>("projects");
  projects.sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <SectionHeader title="Projects — deep dives, not an archive" />
        <div className="mt-4">
          {projects.length === 0 && (
            <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
              Case studies are being written.
            </p>
          )}
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group flex items-baseline gap-4 border-t border-line py-4"
            >
              <span className="flex-1 min-w-0">
                <span className="font-[family-name:var(--font-fraunces)] text-[19px] font-medium text-ink u-draw">
                  {p.title}
                </span>
                <span className="block mt-1 font-[family-name:var(--font-jbmono)] text-[11px] leading-relaxed text-mute">
                  {p.hook}
                </span>
              </span>
              <span className="hidden sm:flex gap-1.5">
                {p.badges.map((b) => (
                  <span key={b} className="badge badge-plain">{b}</span>
                ))}
              </span>
              <span className="font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
                {p.year}
              </span>
              <span className="text-faint opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="More on GitHub" />
        <div className="mt-2">
          {moreRepos.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-3 border-t border-line py-3"
            >
              <span className="shrink-0 font-[family-name:var(--font-jbmono)] text-[12px] font-medium text-ink u-draw">
                {r.name}
              </span>
              <span className="min-w-0 flex-1 font-[family-name:var(--font-jbmono)] text-[10.5px] leading-relaxed text-mute">
                {r.description}
              </span>
              <span className="badge badge-plain hidden sm:inline-block">{r.language}</span>
              <span className="text-faint opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
