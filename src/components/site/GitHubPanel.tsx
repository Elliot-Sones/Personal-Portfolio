import {
  getGithubActivity,
  type ContributionWeek,
  type GithubActivity,
} from "@/lib/github";

function StreakStats({ activity }: { activity: GithubActivity }) {
  const stats = [
    { num: activity.totalContributions, label: "contributions / yr", ember: false },
    { num: activity.currentStreak, label: "day streak", ember: true },
    { num: activity.longestStreak, label: "longest streak", ember: false },
  ];
  return (
    <div className="flex gap-12">
      {stats.map((s) => (
        <div key={s.label}>
          <div className={`stat-num text-[32px] leading-none ${s.ember ? "text-ember" : ""}`}>
            {s.num.toLocaleString("en-US")}
          </div>
          <div className="mt-1.5 font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.16em] text-mute">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function levelFor(count: number): string {
  if (count === 0) return "bg-gh0";
  if (count <= 2) return "bg-gh1";
  if (count <= 5) return "bg-gh2";
  if (count <= 9) return "bg-gh3";
  return "bg-gh4";
}

function formatDay(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ContributionCalendar({ weeks }: { weeks: ContributionWeek[] }) {
  const recent = weeks.slice(-52);
  return (
    <div>
      <div className="grid h-[88px] grid-flow-col grid-rows-7 gap-[3px]">
        {recent.flatMap((week, wi) =>
          Array.from({ length: 7 }).map((_, di) => {
            const day = week.days.find((d) => d.weekday === di);
            if (!day) return <div key={`${wi}-${di}`} />;
            return (
              <div key={`${wi}-${di}`} className="group relative">
                <div
                  className={`h-full w-full rounded-[2px] transition-transform group-hover:scale-110 group-hover:ring-1 group-hover:ring-ink/40 ${levelFor(day.count)}`}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-ink px-2 py-1 font-[family-name:var(--font-jbmono)] text-[9px] text-paper shadow-md group-hover:block group-first:left-0 group-first:translate-x-0 group-last:left-auto group-last:right-0 group-last:translate-x-0">
                  {day.count} contribution{day.count === 1 ? "" : "s"} · {formatDay(day.date)}
                </div>
              </div>
            );
          }),
        )}
      </div>
      <div className="mt-2 flex justify-between font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
        <span>1 year ago</span>
        <span>today</span>
      </div>
    </div>
  );
}

export async function GitHubPanel() {
  const activity = await getGithubActivity();

  if (!activity) {
    return (
      <p className="mt-4 font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
        GitHub data unavailable right now.
      </p>
    );
  }

  return (
    <div className="mt-5 flex flex-col gap-6">
      <StreakStats activity={activity} />
      <ContributionCalendar weeks={activity.weeks} />
    </div>
  );
}
