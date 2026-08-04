import fs from "node:fs";
import path from "node:path";
import type { ReactElement } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/site/Mdx";

export interface PostFrontmatter {
  title: string;
  date: string;
  tag: string;
  description: string;
}

export interface ProjectFrontmatter {
  title: string;
  hook: string;
  year: string;
  badges: string[];
  tech: string[];
  repo?: string;
  demo?: string;
  order: number;
}

type Kind = "learning" | "projects" | "ml-from-scratch";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getSlugs(kind: Kind): string[] {
  try {
    return fs
      .readdirSync(path.join(CONTENT_DIR, kind))
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export async function getMdx<T>(
  kind: Kind,
  slug: string,
): Promise<{ frontmatter: T; content: ReactElement; readingTime: number } | null> {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, kind, `${slug}.mdx`), "utf8");
    const words = raw.split(/\s+/).filter(Boolean).length;
    const { content, frontmatter } = await compileMDX<T>({
      source: raw,
      components: mdxComponents,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, { theme: "github-light" }]],
        },
      },
    });
    return { frontmatter, content, readingTime: Math.max(1, Math.round(words / 200)) };
  } catch {
    return null;
  }
}

export async function getAllMeta<T extends object>(
  kind: Kind,
): Promise<(T & { slug: string })[]> {
  const slugs = getSlugs(kind);
  const all = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getMdx<T>(kind, slug);
      return post ? { ...post.frontmatter, slug } : null;
    }),
  );
  return all.filter((x): x is NonNullable<typeof x> => x !== null);
}
