import Link from "next/link";
import { mfsIntro, mfsModels } from "@/lib/ml-from-scratch";

export const metadata = {
  title: "Machine Learning, from scratch · Elliot Sones",
  description: mfsIntro.description,
};

export default function MlFromScratchPage() {
  return (
    <div className="reveal" style={{ "--reveal-i": 0 } as React.CSSProperties}>
      <h1 className="page-hed text-[clamp(30px,4vw,44px)]">
        {mfsIntro.title}
        <span className="text-ember">.</span>
      </h1>
      <p className="mt-3 font-[family-name:var(--font-fraunces)] text-[16px] italic text-mute">
        From neurons to transformers: building every major architecture from scratch.
      </p>

      <div className="prose-serif mt-6 max-w-[620px]">
        <p>
          Frameworks hide exactly the parts you should understand. So I built the
          parts: every model on this page is implemented from first principles,
          with no high-level ML wrappers, so you can see exactly how each
          algorithm works.
        </p>
        <p className="mt-3">
          Each part is a full write-up of what I built, how it works, and what
          went wrong along the way, with the real trained model embedded on the
          page so you can try it yourself.
        </p>
      </div>

      <div className="mt-9">
        <div className="site-h">The series</div>
        <div className="mt-2">
          {mfsModels.map((m) => (
            <Link
              key={m.slug}
              href={`/learning/ml-from-scratch/${m.slug}`}
              className="group flex items-center gap-5 border-t border-line py-4"
            >
              <div className="hidden h-20 w-32 shrink-0 overflow-hidden rounded-[4px] border border-line bg-raised p-1 sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.gif}
                  alt=""
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="u-draw font-[family-name:var(--font-fraunces)] text-[clamp(18px,2.2vw,22px)] font-medium leading-tight text-ink">
                  {m.name}
                </span>
                <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[10.5px] leading-relaxed text-inksoft">
                  {m.task}
                </div>
              </div>
              <span className="badge badge-ship">{m.accuracy}</span>
              <span className="arrow-nudge text-ember opacity-0 group-hover:opacity-100">
                →
              </span>
            </Link>
          ))}
        </div>
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
