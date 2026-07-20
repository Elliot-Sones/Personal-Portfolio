import { NextResponse } from "next/server";
import { getGithubActivity } from "@/lib/github";

export type { ContributionDay, ContributionWeek, GithubActivity } from "@/lib/github";

export async function GET() {
  const activity = await getGithubActivity();
  if (!activity) {
    return NextResponse.json({ error: "Failed to fetch GitHub activity" }, { status: 500 });
  }
  return NextResponse.json(activity);
}
