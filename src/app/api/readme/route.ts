import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
        return NextResponse.json(
            { error: "Missing owner or repo parameter" },
            { status: 400 }
        );
    }

    // Try main branch first, then master
    const branches = ["main", "master"];
    let readmeContent = null;
    let error = null;

    for (const branch of branches) {
        try {
            const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
            const response = await fetch(url, {
                next: { revalidate: 3600 }, // Cache for 1 hour
            });

            if (response.ok) {
                readmeContent = await response.text();
                break;
            }
        } catch (e) {
            error = e;
        }
    }

    if (!readmeContent) {
        return NextResponse.json(
            { error: "Could not fetch README", details: error?.toString() },
            { status: 404 }
        );
    }

    return NextResponse.json({
        content: readmeContent,
        owner,
        repo,
    });
}
