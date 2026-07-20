import { notFound } from "next/navigation";
import { getMdx, getSlugs, type ProjectFrontmatter } from "@/lib/mdx";

export function generateStaticParams() {
  return getSlugs("projects").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getMdx<ProjectFrontmatter>("projects", slug);
  return { title: project ? `${project.frontmatter.title} — Elliot Sones` : "Projects" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getMdx<ProjectFrontmatter>("projects", slug);
  if (!project) notFound();

  const { frontmatter: p, content } = project;

  return (
    <article className="max-w-[900px]">
      <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.2em] text-ember">
        Case study · {p.year}
      </div>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
        {p.title}
      </h1>
      <p className="mt-2 font-[family-name:var(--font-fraunces)] italic text-[15px] text-mute">
        {p.hook}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {p.badges.map((b) => (
          <span key={b} className="badge badge-ship">{b}</span>
        ))}
        {p.tech.map((t) => (
          <span key={t} className="badge badge-plain">{t}</span>
        ))}
      </div>
      <div className="mt-3 flex gap-5 font-[family-name:var(--font-jbmono)] text-[10px]">
        {p.repo && (
          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-ember u-draw">
            Code ↗
          </a>
        )}
        {p.demo && (
          <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-ember u-draw">
            Live ↗
          </a>
        )}
      </div>
      <hr className="my-6 border-line" />
      {content}
    </article>
  );
}
