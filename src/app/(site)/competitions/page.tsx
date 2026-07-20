import { SectionHeader } from "@/components/site/SectionHeader";
import { competitions } from "@/lib/site-data";

export const metadata = { title: "Competitions — Elliot Sones" };

export default function CompetitionsPage() {
  return (
    <div>
      <SectionHeader title="Competitions — hackathons & data challenges" />
      <div className="mt-4">
        {competitions.map((c) => (
          <div key={c.slug} className="border-t border-line py-5">
            <div className="flex gap-4">
              {c.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.logo}
                  alt={`${c.name} logo`}
                  className="h-12 w-12 shrink-0 rounded-[6px] border border-line object-contain p-1"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-[family-name:var(--font-fraunces)] text-[19px] font-medium text-ink">
                    {c.project}
                  </span>
                  {c.outcome && <span className="badge badge-live">{c.outcome}</span>}
                  <span className="ml-auto font-[family-name:var(--font-jbmono)] text-[10px] text-faint">
                    {c.date}
                  </span>
                </div>
                <div className="mt-0.5 font-[family-name:var(--font-jbmono)] text-[10.5px] uppercase tracking-[0.14em] text-mute">
                  {c.name}
                </div>
                <p className="mt-2 max-w-[640px] font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.7] text-inksoft">
                  {c.description}
                </p>
                <div className="mt-2.5 flex gap-5 font-[family-name:var(--font-jbmono)] text-[11px]">
                  {c.git && (
                    <a href={c.git} target="_blank" rel="noopener noreferrer" className="text-ember u-draw">
                      Code ↗
                    </a>
                  )}
                  {c.link && (
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-ember u-draw">
                      Link ↗
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
