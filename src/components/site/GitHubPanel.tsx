import {
  getGithubActivity,
  getRecentCommits,
  relativeTime,
  type ContributionWeek,
  type RecentCommit,
} from "@/lib/github";

function StreakCard() {
  return (
    <a
      href="https://github.com/Elliot-Sones"
      target="_blank"
      rel="noopener noreferrer"
      className="mx-auto mb-3 block w-full max-w-[495px] overflow-hidden rounded-[6px] border border-line"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://streak-stats.demolab.com?user=Elliot-Sones&theme=dark&hide_border=true"
        alt="Elliot's GitHub streak stats — total contributions, current streak, longest streak"
        className="block w-full"
        loading="lazy"
      />
    </a>
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
  const recent = weeks.slice(-26);
  return (
    <div>
      <div className="grid grid-rows-7 grid-flow-col gap-[3px] h-[104px]">
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
      <div className="mt-1.5 flex justify-between font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
        <span>26 weeks ago</span>
        <span>hover a square for detail</span>
        <span>today</span>
      </div>
    </div>
  );
}

function CommitFeed({ commits }: { commits: RecentCommit[] }) {
  if (commits.length === 0) return null;
  return (
    <div className="mt-3">
      {commits.map((c, i) => (
        <div
          key={`${c.repo}-${i}`}
          className="flex items-baseline gap-2 border-t border-line py-2 font-[family-name:var(--font-jbmono)] text-[11px] text-inksoft"
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
        <div className="font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-mute mb-2">
          GitHub — Elliot-Sones
        </div>
        <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
          GitHub data unavailable right now.
        </p>
      </div>
    );
  }

  return (
    <div className="site-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-mute mb-3">
        <span>GitHub — {activity.username}</span>
        <span className="live-dot" aria-label="live" />
      </div>
      <StreakCard />
      <ContributionCalendar weeks={activity.weeks} />
      <CommitFeed commits={commits} />
    </div>
  );
}
