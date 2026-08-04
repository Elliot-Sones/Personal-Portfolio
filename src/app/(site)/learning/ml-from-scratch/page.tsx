import Link from "next/link";
import { mfsIntro, mfsModels } from "@/lib/ml-from-scratch";

export const metadata = {
  title: "Machine Learning, from scratch · Elliot Sones",
  description: mfsIntro.description,
};

export default function MlFromScratchPage() {
  return (
    <div className="reveal" style={{ "--reveal-i": 0 } as React.CSSProperties}>
      <Link
        href="/learning"
        className="font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-ember"
      >
        ← Learning blogs
      </Link>
      <h1 className="page-hed mt-4 text-[clamp(28px,3.6vw,40px)]">
        {mfsIntro.title}
        <span className="text-ember">.</span>
      </h1>
      <p className="prose-serif mt-4 max-w-[620px]">{mfsIntro.description}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mfsModels.map((m, i) => (
          <Link
            key={m.slug}
            href={`/learning/ml-from-scratch/${m.slug}`}
            className="group overflow-hidden rounded-[6px] border border-line bg-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-[2px] hover:border-ember hover:shadow-[0_3px_0_0_var(--color-line)]"
          >
            <div className="border-b border-line bg-raised p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.gif}
                alt={`${m.name} demo`}
                className="h-44 w-full rounded-[4px] object-contain"
                loading={i < 2 ? "eager" : "lazy"}
              />
            </div>
            <div className="p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-[family-name:var(--font-fraunces)] text-[18px] font-medium text-ink">
                  <span className="u-draw">{m.name}</span>
                </span>
                <span className="badge badge-ship">{m.accuracy}</span>
              </div>
              <div className="mt-1.5 font-[family-name:var(--font-jbmono)] text-[10.5px] leading-relaxed text-inksoft">
                {m.task}
              </div>
              <div className="mt-2.5 font-[family-name:var(--font-jbmono)] text-[10px] text-ember">
                Read + try it live <span className="arrow-nudge">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex gap-6 border-t border-line pt-4 font-[family-name:var(--font-jbmono)] text-[10.5px]">
        <a
          href={mfsIntro.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="group text-ember"
        >
          <span className="u-draw">Neural_Networks_Fundamentals</span>{" "}
          <span className="arrow-nudge">↗</span>
        </a>
        <a
          href={mfsIntro.transformersRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="group text-inksoft transition-colors hover:text-ember"
        >
          <span className="u-draw">Transformer deep-dive repo</span>{" "}
          <span className="arrow-nudge">↗</span>
        </a>
      </div>
    </div>
  );
}
