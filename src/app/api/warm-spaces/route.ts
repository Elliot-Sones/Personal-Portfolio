import { NextResponse } from "next/server";
import { mfsModels } from "@/lib/ml-from-scratch";

export const dynamic = "force-dynamic";

// Hugging Face free-tier Spaces sleep after 48h without requests. Vercel cron
// hits this route daily (see vercel.json), and each ping below counts as
// activity, so the demo embeds never go to sleep. A ping to a space that is
// already asleep also triggers its wake-up.
export async function GET() {
  const results = await Promise.all(
    mfsModels.map(async (m) => {
      try {
        const res = await fetch(m.embedUrl, {
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
        return { space: m.slug, status: res.status };
      } catch {
        // Timeouts still count: the request reached the space and started the
        // wake-up even if the cold boot outlasts our wait.
        return { space: m.slug, status: "pinged (no response yet)" };
      }
    }),
  );
  return NextResponse.json({ warmed: results });
}
