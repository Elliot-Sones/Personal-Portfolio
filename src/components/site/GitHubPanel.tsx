import {
  getGithubActivity,
  getRecentCommits,
  relativeTime,
  shortDate,
  type ContributionWeek,
  type GithubActivity,
  type RecentCommit,
} from "@/lib/github";

function StreakStats({ activity }: { activity: GithubActivity }) {
  const stats = [
    {
      num: activity.totalContributions,
      label: "contributions",
      sub: "past year",
      ember: false,
    },
    {
      num: activity.currentStreak,
      label: "day streak",
      sub: activity.currentStreakStart
        ? `${shortDate(activity.currentStreakStart)} → today`
        : "resting",
      ember: true,
    },
    {
      num: activity.longestStreak,
      label: "longest streak",
      sub:
        activity.longestStreakStart && activity.longestStreakEnd
          ? `${shortDate(activity.longestStreakStart)} → ${shortDate(activity.longestStreakEnd)}`
          : "",
      ember: false,
    },
  ];

  return (
    <div className="flex flex-col divide-y divide-line">
      {stats.map((s) => (
        <div key={s.label} className="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0">
          <div
            className={`stat-num w-[104px] shrink-0 text-[30px] leading-none ${s.ember ? "text-ember" : ""}`}
          >
            {s.num.toLocaleString("en-US")}
          </div>
          <div>
            <div className="font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.14em] text-mute">
              {s.label}
            </div>
            {s.sub && (
              <div className="mt-0.5 font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
                {s.sub}
              </div>
            )}
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
    <div className="flex h-full flex-col">
      <div className="grid min-h-[110px] flex-1 grid-flow-col grid-rows-7 gap-[3px]">
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
      <div className="mt-2 flex justify-between font-[family-name:var(--font-jbmono)] text-[9.5px] text-faint">
        <span>one year ago</span>
        <span>hover a square for detail</span>
        <span>today</span>
      </div>
    </div>
  );
}

function CommitFeed({ commits }: { commits: RecentCommit[] }) {
  if (commits.length === 0) return null;
  return (
    <div className="mt-4 border-t border-line pt-1">
      {commits.map((c, i) => (
        <div
          key={`${c.repo}-${i}`}
          className="flex items-baseline gap-2 py-2 font-[family-name:var(--font-jbmono)] text-[11px] text-inksoft [&+&]:border-t [&+&]:border-line"
        >
          <span className="truncate">{c.message}</span>
          <a
            href={c.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-ember hover:underline"
          >
            {c.repo}
          </a>
          <span className="ml-auto shrink-0 text-[9.5px] text-faint">
            {relativeTime(c.pushedAt)}
          </span>
        </div>
      ))}
    </div>
  );
}

export async function GitHubPanel() {
  const [activity, commits] = await Promise.all([getGithubActivity(), getRecentCommits(3)]);

  if (!activity) {
    return (
      <div className="site-card p-5">
        <div className="mb-2 font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-mute">
          GitHub · Elliot-Sones
        </div>
        <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
          GitHub data unavailable right now.
        </p>
      </div>
    );
  }

  return (
    <div className="site-card p-5">
      <div className="mb-4 flex items-center justify-between font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-mute">
        <a
          href="https://github.com/Elliot-Sones"
          target="_blank"
          rel="noopener noreferrer"
          className="u-draw transition-colors hover:text-ember"
        >
          GitHub · {activity.username}
        </a>
        <span className="live-dot" aria-label="live" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
        <StreakStats activity={activity} />
        <ContributionCalendar weeks={activity.weeks} />
      </div>
      <CommitFeed commits={commits} />
    </div>
  );
}
