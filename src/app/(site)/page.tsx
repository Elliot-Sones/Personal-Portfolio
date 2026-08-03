import { AiUsagePanel } from "@/components/site/AiUsagePanel";
import { GitHubPanel } from "@/components/site/GitHubPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusList } from "@/components/site/StatusList";
import { WorkCards } from "@/components/site/WorkCards";
import { workCards, learningNow } from "@/lib/site-data";

function Hero() {
  return (
    <section className="pt-2 md:pt-6">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.22em] text-mute">
          Field notes from a machine-learning engineer
        </span>
        <span className="hidden shrink-0 font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-faint sm:block">
          Toronto · TMU &apos;29
        </span>
      </div>
      <h1 className="display-hed mt-5 text-[clamp(46px,6.5vw,80px)]">
        Elliot Sones<span className="text-ember">.</span>
      </h1>
      <p className="prose-serif mt-6 max-w-[520px]">
        I train models from scratch: reinforcement learning, transformers, and
        lately the GPU kernels underneath them. Right now I&apos;m at Trajekt
        Sports and NTangible, and building SelfLearners.
      </p>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="reveal" style={{ "--reveal-i": 0 } as React.CSSProperties}>
        <Hero />
      </div>

      {/* Working on */}
      <section className="reveal" style={{ "--reveal-i": 1 } as React.CSSProperties}>
        <SectionHeader title="What I'm working on" />
        <WorkCards items={workCards} />
      </section>

      {/* Live strip */}
      <section className="reveal" style={{ "--reveal-i": 2 } as React.CSSProperties}>
        <SectionHeader title="Live" />
        <div className="mt-3.5 grid grid-cols-1 items-stretch gap-3.5 lg:grid-cols-2">
          <AiUsagePanel />
          <GitHubPanel />
        </div>
      </section>

      {/* Learning */}
      <section className="reveal" style={{ "--reveal-i": 3 } as React.CSSProperties}>
        <SectionHeader title="What I'm learning" />
        <StatusList items={learningNow} />
      </section>
    </div>
  );
}
