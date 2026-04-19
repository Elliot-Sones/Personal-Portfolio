import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const user = url.searchParams.get("user") || "Elliot-Sones";
  const theme = url.searchParams.get("theme") || "dark";
  const hideBorder = url.searchParams.get("hide_border") ?? "true";

  const upstream = `https://streak-stats.demolab.com?user=${encodeURIComponent(user)}&theme=${encodeURIComponent(theme)}&hide_border=${encodeURIComponent(hideBorder)}`;

  try {
    const res = await fetch(upstream, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return new NextResponse(`Upstream failed: ${res.status}`, { status: 502 });
    }
    const svg = await res.text();
    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return new NextResponse(`Fetch error: ${String(e)}`, { status: 502 });
  }
}
