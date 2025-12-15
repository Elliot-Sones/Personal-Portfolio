import { NextResponse } from "next/server";

// Define the project type
export interface PinnedRepo {
  title: string;
  description: string;
  tech: string[];
  link: string;
  repo: string;
  image: string;
}

// GraphQL query to fetch pinned repositories
const PINNED_REPOS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            openGraphImageUrl
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              nodes {
                name
              }
            }
            owner {
              login
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    const username = "Elliot-Sones";

    // GitHub GraphQL API endpoint
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: PINNED_REPOS_QUERY,
        variables: { username },
      }),
      // Cache for 1 hour to avoid rate limits
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      throw new Error(data.errors[0]?.message || "GraphQL query failed");
    }

    const pinnedItems = data.data?.user?.pinnedItems?.nodes || [];

    // Transform to our project format
    const projects: PinnedRepo[] = pinnedItems.map((repo: {
      name: string;
      description: string | null;
      url: string;
      openGraphImageUrl: string;
      repositoryTopics: { nodes: { topic: { name: string } }[] };
      languages: { nodes: { name: string }[] };
      owner: { login: string };
    }) => {
      // Get topics first, then languages as fallback for tech tags
      const topics = repo.repositoryTopics?.nodes?.map((t) => t.topic.name) || [];
      const languages = repo.languages?.nodes?.map((l) => l.name) || [];
      const tech = topics.length > 0 ? topics.slice(0, 4) : languages.slice(0, 4);

      return {
        title: repo.name
          .replace(/-/g, " ")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()), // Convert to title case
        description: repo.description || "No description available",
        tech,
        link: repo.url,
        repo: `${repo.owner.login}/${repo.name}`,
        image: repo.openGraphImageUrl || "",
      };
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching pinned repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch pinned repositories" },
      { status: 500 }
    );
  }
}
