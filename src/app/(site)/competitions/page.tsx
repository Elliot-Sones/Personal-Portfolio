import { competitions } from "@/lib/site-data";

export const metadata = { title: "Competitions · Elliot Sones" };

export default function CompetitionsPage() {
  return (
    <div className="reveal" style={{ "--reveal-i": 0 } as React.CSSProperties}>
      <h1 className="page-hed text-[clamp(28px,3.6vw,40px)]">
        Competitions<span className="text-ember">.</span>
      </h1>
      <div className="mt-6">
        {competitions.map((c) => (
          <div key={c.slug} className="border-t border-line py-6">
            <div className="flex gap-4">
              {c.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.logo}
                  alt={`${c.name} logo`}
                  className="h-12 w-12 shrink-0 rounded-[6px] border border-line bg-raised object-contain p-1"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-[family-name:var(--font-fraunces)] text-[clamp(19px,2.2vw,22px)] font-medium leading-tight text-ink">
                    {c.project}
                  </span>
                  {c.outcome && <span className="badge badge-ship">{c.outcome}</span>}
                  <span className="ml-auto font-[family-name:var(--font-jbmono)] text-[10px] tabular-nums text-faint">
                    {c.date}
                  </span>
                </div>
                <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.14em] text-mute">
                  {c.name}
                </div>
                <p className="mt-2.5 max-w-[640px] font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.7] text-inksoft">
                  {c.description}
                </p>
                <div className="mt-3 flex gap-5 font-[family-name:var(--font-jbmono)] text-[11px]">
                  {c.git && (
                    <a
                      href={c.git}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-ember"
                    >
                      <span className="u-draw">Code</span>{" "}
                      <span className="arrow-nudge">↗</span>
                    </a>
                  )}
                  {c.link && (
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-ember"
                    >
                      <span className="u-draw">Live</span>{" "}
                      <span className="arrow-nudge">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
