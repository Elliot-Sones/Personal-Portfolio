import Link from "next/link";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getAllMeta, type PostFrontmatter } from "@/lib/mdx";

export const metadata = { title: "Learning Blogs · Elliot Sones" };

export default async function LearningPage() {
  const posts = await getAllMeta<PostFrontmatter>("learning");
  posts.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="reveal" style={{ "--reveal-i": 0 } as React.CSSProperties}>
      <SectionHeader title="Learning blogs" />
      <h1 className="page-hed mt-4 text-[clamp(28px,3.6vw,40px)]">
        Notes from training things.
      </h1>
      <div className="mt-6">
        {posts.length === 0 && (
          <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
            First essays are being written.
          </p>
        )}
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/learning/${p.slug}`}
            className="group flex items-baseline gap-4 border-t border-line py-5"
          >
            <span className="min-w-0 flex-1">
              <span className="u-draw font-[family-name:var(--font-fraunces)] text-[clamp(20px,2.3vw,24px)] font-medium leading-tight text-ink">
                {p.title}
              </span>
              <span className="mt-1.5 block font-[family-name:var(--font-fraunces)] text-[13.5px] leading-[1.6] text-inksoft">
                {p.description}
              </span>
            </span>
            <span className="badge badge-plain hidden sm:inline-block">{p.tag}</span>
            <span className="font-[family-name:var(--font-jbmono)] text-[10px] tabular-nums text-faint">
              {new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="arrow-nudge text-ember opacity-0 group-hover:opacity-100">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
