import Link from "next/link";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getAllMeta, type PostFrontmatter } from "@/lib/mdx";

export const metadata = { title: "Learning Blogs — Elliot Sones" };

export default async function LearningPage() {
  const posts = await getAllMeta<PostFrontmatter>("learning");
  posts.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <SectionHeader title="Learning Blogs — notes from training things" />
      <div className="mt-4">
        {posts.length === 0 && (
          <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
            First essays are being written.
          </p>
        )}
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/learning/${p.slug}`}
            className="group flex items-baseline gap-4 border-t border-line py-4"
          >
            <span className="flex-1 min-w-0">
              <span className="font-[family-name:var(--font-fraunces)] text-[19px] font-medium text-ink u-draw">
                {p.title}
              </span>
              <span className="block mt-1 font-[family-name:var(--font-jbmono)] text-[11px] leading-relaxed text-mute">
                {p.description}
              </span>
            </span>
            <span className="badge badge-plain hidden sm:inline-block">{p.tag}</span>
            <span className="font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
              {new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-faint opacity-0 transition-opacity group-hover:opacity-100">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
