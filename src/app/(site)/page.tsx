import { AiUsagePanel } from "@/components/site/AiUsagePanel";
import { GitHubPanel } from "@/components/site/GitHubPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusList } from "@/components/site/StatusList";
import { WorkCards } from "@/components/site/WorkCards";
import { workCards, learningNow } from "@/lib/site-data";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 pt-2 md:pt-4">
      <h1
        className="display-hed reveal text-[clamp(38px,5vw,60px)]"
        style={{ "--reveal-i": 0 } as React.CSSProperties}
      >
        Elliot Sones<span className="text-ember">.</span>
      </h1>

      {/* Live strip */}
      <section className="reveal" style={{ "--reveal-i": 1 } as React.CSSProperties}>
        <SectionHeader title="Live" />
        <div className="mt-3.5 grid grid-cols-1 items-stretch gap-3.5 lg:grid-cols-2">
          <AiUsagePanel />
          <GitHubPanel />
        </div>
      </section>

      {/* Working on | Learning */}
      <div
        className="reveal grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8"
        style={{ "--reveal-i": 2 } as React.CSSProperties}
      >
        <section>
          <SectionHeader title="What I'm working on" />
          <WorkCards items={workCards} />
        </section>
        <section>
          <SectionHeader title="What I'm learning" />
          <StatusList items={learningNow} />
        </section>
      </div>
    </div>
  );
}
