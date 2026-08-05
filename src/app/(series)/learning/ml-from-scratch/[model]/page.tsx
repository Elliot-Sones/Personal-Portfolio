import Link from "next/link";
import { notFound } from "next/navigation";
import MlpDigitDemo from "@/components/MlpDigitDemo";
import { getMfsModel, mfsModels } from "@/lib/ml-from-scratch";
import { getMdx } from "@/lib/mdx";

export function generateStaticParams() {
  return mfsModels.map((m) => ({ model: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;
  const m = getMfsModel(model);
  if (!m) return {};
  return {
    title: `${m.name}, from scratch · Elliot Sones`,
    description: `${m.task} · ${m.accuracy}. Built from first principles, with a live demo.`,
  };
}

export default async function MfsModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;
  const m = getMfsModel(model);
  if (!m) notFound();

  const post = await getMdx<{ title: string }>("ml-from-scratch", m.slug);
  const idx = mfsModels.findIndex((x) => x.slug === m.slug);
  const prev = mfsModels[idx - 1];
  const next = mfsModels[idx + 1];

  return (
    <div className="reveal flex flex-col gap-9" style={{ "--reveal-i": 0 } as React.CSSProperties}>
      <div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="page-hed text-[clamp(26px,3.4vw,38px)]">
            {m.name}
            <span className="text-ember">.</span>
          </h1>
          <span className="badge badge-ship">{m.accuracy}</span>
        </div>
        <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[10.5px] uppercase tracking-[0.14em] text-mute">
          Part {idx + 1} of {mfsModels.length} · {m.task}
        </div>
      </div>

      {/* story */}
      <div className="max-w-[620px]">
        {m.story.map((p) => (
          <p key={p.slice(0, 24)} className="prose-serif [&+&]:mt-3">
            {p}
          </p>
        ))}
      </div>

      {/* facts */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 rounded-[6px] border border-line bg-card p-4 sm:grid-cols-2">
        {m.facts.map((f) => (
          <div key={f.label}>
            <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.18em] text-mute">
              {f.label}
            </div>
            <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[11.5px] leading-[1.65] text-inksoft">
              {f.value}
            </div>
          </div>
        ))}
      </div>

      {/* live demo */}
      <div>
        <div className="site-h">Try it live</div>
        <div className="mt-3.5 overflow-hidden rounded-[6px] border border-line bg-raised">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-2.5">
            <span className="font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.14em] text-mute">
              {m.demoNote} · the actual model, running{" "}
              {m.nativeDemo ? "right here in your browser" : "on Hugging Face"}
            </span>
            {!m.nativeDemo && (
              <a
                href={m.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group font-[family-name:var(--font-jbmono)] text-[10px] text-ember"
              >
                <span className="u-draw">Open full screen</span>{" "}
                <span className="arrow-nudge">↗</span>
              </a>
            )}
          </div>
          {m.nativeDemo ? (
            <MlpDigitDemo />
          ) : (
            <iframe
              src={m.embedUrl}
              title={`${m.name} live demo`}
              className="block h-[640px] w-full bg-white"
              loading="lazy"
              allow="clipboard-write"
            />
          )}
        </div>
      </div>

      {/* full write-up, transferred from the repo READMEs */}
      {post && (
        <div>
          <div className="site-h">How I built it</div>
          <div className="mt-2 max-w-[680px]">{post.content}</div>
        </div>
      )}

      {/* code links */}
      <div className="flex flex-wrap gap-6 font-[family-name:var(--font-jbmono)] text-[10.5px]">
        {m.code.map((c) => (
          <a
            key={c.href}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-ember"
          >
            <span className="u-draw">{c.label}</span> <span className="arrow-nudge">↗</span>
          </a>
        ))}
      </div>

      {/* prev / next */}
      <div className="flex items-baseline justify-between border-t border-line pt-4 font-[family-name:var(--font-jbmono)] text-[11px]">
        {prev ? (
          <Link href={`/learning/ml-from-scratch/${prev.slug}`} className="group text-inksoft hover:text-ember">
            ← <span className="u-draw">{prev.short}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/learning/ml-from-scratch/${next.slug}`} className="group text-inksoft hover:text-ember">
            <span className="u-draw">{next.short}</span> →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
