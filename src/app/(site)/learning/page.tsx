import Link from "next/link";
import { getAllMeta, type PostFrontmatter } from "@/lib/mdx";
import { mfsIntro, mfsModels } from "@/lib/ml-from-scratch";

export const metadata = { title: "Learning Blogs · Elliot Sones" };

function SeriesCard() {
  return (
    <Link
      href="/learning/ml-from-scratch"
      className="group mt-6 block overflow-hidden rounded-[6px] border border-line bg-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-[2px] hover:border-ember hover:shadow-[0_3px_0_0_var(--color-line)]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">
        <div className="border-b border-line bg-raised p-3 sm:border-b-0 sm:border-r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ml-from-scratch/mlp-demo.gif"
            alt="MLP digit classifier demo"
            className="h-full max-h-44 w-full rounded-[4px] object-contain"
          />
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
            <span className="font-[family-name:var(--font-fraunces)] text-[clamp(20px,2.3vw,24px)] font-medium leading-tight text-ink">
              <span className="u-draw">{mfsIntro.title}</span>
            </span>
            <span className="badge badge-ship">series · {mfsModels.length} parts</span>
          </div>
          <p className="mt-2 max-w-[520px] font-[family-name:var(--font-fraunces)] text-[13.5px] leading-[1.6] text-inksoft">
            {mfsIntro.description}
          </p>
          <div className="mt-3 font-[family-name:var(--font-jbmono)] text-[10px] text-ember">
            {mfsModels.map((m) => m.short).join(" · ")}{" "}
            <span className="arrow-nudge">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function LearningPage() {
  const posts = await getAllMeta<PostFrontmatter>("learning");
  posts.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="reveal" style={{ "--reveal-i": 0 } as React.CSSProperties}>
      <h1 className="page-hed text-[clamp(28px,3.6vw,40px)]">
        Learning blogs<span className="text-ember">.</span>
      </h1>
      <SeriesCard />
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
