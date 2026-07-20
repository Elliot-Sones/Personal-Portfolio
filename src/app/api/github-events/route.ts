import { NextResponse } from "next/server";
import { getRecentCommits } from "@/lib/github";

export async function GET() {
  const commits = await getRecentCommits();
  return NextResponse.json({ commits });
}
