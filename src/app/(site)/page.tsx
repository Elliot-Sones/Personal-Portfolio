import { AiUsagePanel } from "@/components/site/AiUsagePanel";
import { GitHubPanel } from "@/components/site/GitHubPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusList } from "@/components/site/StatusList";
import { WorkCards } from "@/components/site/WorkCards";
import { workCards, learningNow } from "@/lib/site-data";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pt-2 md:pt-4">
      {/* Working on */}
      <section className="reveal" style={{ "--reveal-i": 0 } as React.CSSProperties}>
        <SectionHeader title="What I'm working on" />
        <WorkCards items={workCards} />
      </section>

      {/* Live strip */}
      <section className="reveal" style={{ "--reveal-i": 1 } as React.CSSProperties}>
        <SectionHeader title="Live" />
        <div className="mt-3.5 flex flex-col gap-3.5">
          <AiUsagePanel />
          <GitHubPanel />
        </div>
      </section>

      {/* Learning */}
      <section className="reveal" style={{ "--reveal-i": 2 } as React.CSSProperties}>
        <SectionHeader title="What I'm learning" />
        <StatusList items={learningNow} />
      </section>
    </div>
  );
}
