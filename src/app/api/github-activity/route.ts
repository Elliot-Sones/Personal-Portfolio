import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    const username = "Elliot-Sones";

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username },
      }),
      next: { revalidate: 300 }, // 5 min cache
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0]?.message || "GraphQL query failed");
    }

    const cal = data.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) {
      throw new Error("No contribution calendar returned");
    }

    type RawDay = { contributionCount: number; date: string; color: string; weekday: number };
    type RawWeek = { contributionDays: RawDay[] };

    // Flatten to a chronological list of days for streak calculation
    const allDays: ContributionDay[] = (cal.weeks as RawWeek[]).flatMap((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        color: d.color,
        weekday: d.weekday,
      })),
    );

    // Compute streaks (excluding today if 0, so a blank today doesn't break the streak)
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
      } else {
        if (d.date !== today) {
          runLen = 0;
          runStart = null;
        }
      }
    }

    // Current streak = trailing run (walk backward)
    for (let i = allDays.length - 1; i >= 0; i--) {
      const d = allDays[i];
      if (d.date === today && d.count === 0) continue; // allow blank today
      if (d.count > 0) {
        if (currentStreakEnd === null) currentStreakEnd = d.date;
        currentStreak += 1;
        currentStreakStart = d.date;
      } else {
        break;
      }
    }

    const payload: GithubActivity = {
      username,
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

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching github activity:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub activity" }, { status: 500 });
  }
}
