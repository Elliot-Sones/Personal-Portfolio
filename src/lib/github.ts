const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

export interface ContributionDay {
  date: string;
  count: number;
  color: string;
  weekday: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface GithubActivity {
  username: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  currentStreakStart: string | null;
  currentStreakEnd: string | null;
  longestStreakStart: string | null;
  longestStreakEnd: string | null;
  weeks: ContributionWeek[];
  startDate: string;
  endDate: string;
}

export interface RecentCommit {
  message: string;
  repo: string;
  repoUrl: string;
  pushedAt: string;
}

const USERNAME = "Elliot-Sones";

export async function getGithubActivity(): Promise<GithubActivity | null> {
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username: USERNAME },
      }),
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data.errors) return null;

    const cal = data.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;

    type RawDay = { contributionCount: number; date: string; color: string; weekday: number };
    type RawWeek = { contributionDays: RawDay[] };

    const allDays: ContributionDay[] = (cal.weeks as RawWeek[]).flatMap((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        color: d.color,
        weekday: d.weekday,
      })),
    );

    const today = new Date().toISOString().slice(0, 10);
    let currentStreak = 0;
    let currentStreakStart: string | null = null;
    let currentStreakEnd: string | null = null;
    let longestStreak = 0;
    let longestStreakStart: string | null = null;
    let longestStreakEnd: string | null = null;
    let runLen = 0;
    let runStart: string | null = null;

    for (const d of allDays) {
      if (d.count > 0) {
        if (runLen === 0) runStart = d.date;
        runLen += 1;
        if (runLen > longestStreak) {
          longestStreak = runLen;
          longestStreakStart = runStart;
          longestStreakEnd = d.date;
        }
      } else if (d.date !== today) {
        runLen = 0;
        runStart = null;
      }
    }

    for (let i = allDays.length - 1; i >= 0; i--) {
      const d = allDays[i];
      if (d.date === today && d.count === 0) continue;
      if (d.count > 0) {
        if (currentStreakEnd === null) currentStreakEnd = d.date;
        currentStreak += 1;
        currentStreakStart = d.date;
      } else {
        break;
      }
    }

    return {
      username: USERNAME,
      totalContributions: cal.totalContributions,
      currentStreak,
      longestStreak,
      currentStreakStart,
      currentStreakEnd,
      longestStreakStart,
      longestStreakEnd,
      weeks: (cal.weeks as RawWeek[]).map((w) => ({
        days: w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          color: d.color,
          weekday: d.weekday,
        })),
      })),
      startDate: allDays[0]?.date ?? "",
      endDate: allDays[allDays.length - 1]?.date ?? "",
    };
  } catch {
    return null;
  }
}

export async function getRecentCommits(limit = 4): Promise<RecentCommit[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "elliot-portfolio",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/events/public?per_page=30`,
      { headers, next: { revalidate: 300 } },
    );
    if (!res.ok) return [];

    const events = (await res.json()) as Array<{
      type: string;
      repo: { name: string };
      created_at: string;
      payload?: { commits?: Array<{ message: string }> };
    }>;

    const commits: RecentCommit[] = [];
    for (const e of events) {
      if (e.type !== "PushEvent" || !e.payload?.commits) continue;
      for (const c of e.payload.commits) {
        commits.push({
          message: c.message.split("\n")[0],
          repo: e.repo.name.split("/")[1] ?? e.repo.name,
          repoUrl: `https://github.com/${e.repo.name}`,
          pushedAt: e.created_at,
        });
        if (commits.length >= limit) return commits;
      }
    }
    return commits;
  } catch {
    return [];
  }
}

export function relativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 86400 * 30) return `${Math.floor(seconds / 86400)}d`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function shortDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
