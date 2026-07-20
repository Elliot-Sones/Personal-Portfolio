import { notFound } from "next/navigation";
import { getMdx, getSlugs, type PostFrontmatter } from "@/lib/mdx";

export function generateStaticParams() {
  return getSlugs("learning").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getMdx<PostFrontmatter>("learning", slug);
  return { title: post ? `${post.frontmatter.title} — Elliot Sones` : "Learning" };
}

export default async function LearningPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getMdx<PostFrontmatter>("learning", slug);
  if (!post) notFound();

  const { frontmatter: p, content, readingTime } = post;

  return (
    <article className="max-w-[900px]">
      <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.2em] text-ember">
        {p.tag}
      </div>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
        {p.title}
      </h1>
      <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[9.5px] text-faint">
        {new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}{" "}
        · {readingTime} min read
      </div>
      <hr className="my-6 border-line" />
      {content}
    </article>
  );
}
