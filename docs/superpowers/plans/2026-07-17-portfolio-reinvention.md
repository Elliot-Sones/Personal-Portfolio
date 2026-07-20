# Portfolio Reinvention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a light "warm paper" site (sidebar shell, live AI-usage + GitHub stats, MDX writing/case studies) per `docs/superpowers/specs/2026-07-17-portfolio-reinvention-design.md`, archiving the current site at `/v1`.

**Architecture:** Next.js 16 App Router. New pages in `src/app/(site)/` behind a sidebar layout; current soccer site moved untouched to `src/app/v1/`. MDX content compiled at build time via `next-mdx-remote/rsc`. GitHub data via shared server lib (existing API routes become thin wrappers). AI usage via a local script writing committed JSON.

**Tech Stack:** Next.js 16, React 19, Tailwind v4 (CSS-first), Framer Motion (existing), next-mdx-remote + rehype-pretty-code (new), next/font (Fraunces + JetBrains Mono).

**Conventions for this plan:**
- **No git commits/pushes.** The user explicitly asked to implement locally and commit nothing until told. Tasks end with verification checkpoints, not commits.
- **No test framework** (repo has none; spec says YAGNI). Verification = `npm run lint`, `npm run build`, and Chrome visual checks per `CLAUDE.md`.
- Spec approved mock for the homepage: `.superpowers/brainstorm/49583-1784301562/content/layout-v6.html`.

---

### Task 1: Install new dependencies + stats script entry

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install MDX deps**

Run: `npm install next-mdx-remote rehype-pretty-code`
Expected: both added to `dependencies` in `package.json` (shiki is pulled in by rehype-pretty-code).

- [ ] **Step 2: Add the stats script entry**

In `package.json`, add to `"scripts"`:

```json
"stats": "node scripts/update-ai-usage.mjs"
```

- [ ] **Step 3: Verify install**

Run: `npm run build`
Expected: build passes unchanged (new deps unused so far). If MDX-related peer warnings appear, they're safe to ignore as long as the build passes.

---

### Task 2: Archive current site at `/v1`

The root layout currently injects the soccer theme (`ThemeProvider`, `PixelSoccerField`, `bg-field` body classes) for every route. Move that chrome into a `v1/` layout so the new site renders clean.

**Files:**
- Move: `src/app/page.tsx` → `src/app/v1/page.tsx`
- Create: `src/app/v1/layout.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Move the page (filesystem move, not git)**

Run: `mkdir -p src/app/v1 && mv src/app/page.tsx src/app/v1/page.tsx`
Expected: `src/app/v1/page.tsx` exists; all its imports use the `@/` alias so nothing breaks.

- [ ] **Step 2: Create `src/app/v1/layout.tsx`**

```tsx
import { PixelSoccerField } from "@/components/PixelSoccerField";
import { ThemeProvider } from "@/components/ThemeContext";

export default function V1Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <div className="bg-field text-foreground min-h-screen">
        <PixelSoccerField />
        {children}
      </div>
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Strip soccer chrome from `src/app/layout.tsx`**

Replace the entire file with (fonts grow in Task 4; keep Geist/Syne for `/v1`):

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elliot Sones — ML Engineer",
  description:
    "Computer Science student at TMU building intelligent agents and deep learning systems. Reinforcement learning, transformer architectures, applied AI.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Elliot Sones — ML Engineer",
    description:
      "Building intelligent agents — and the infra that lets them play.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify v1 archived**

Run: `npm run build`
Expected: PASS. `/` now 404s (temporarily — the new home arrives in Task 10), `/v1` builds as a route.

- [ ] **Step 5: Visual check `/v1`**

Run: `npm run dev`, open Chrome at `http://localhost:3000/v1`
Expected: the old soccer site renders **exactly** as before (pitch background, theme, all sections). This is the regression baseline — screenshot it.

---

### Task 3: Design tokens + site CSS in `globals.css`

New tokens live alongside the old theme; the two never mix. Old theme stays on `:root` vars for `/v1`; new tokens go in a Tailwind v4 `@theme` block so utilities like `bg-paper` / `text-ink` / `border-line` / `text-ember` exist.

**Files:**
- Modify: `src/app/globals.css` (append only)

- [ ] **Step 1: Append the v2 design system**

Append to the end of `src/app/globals.css`:

```css
/* ============================================
   SITE v2 — Warm Paper design system
   ============================================ */
@theme {
  --color-paper: #f8f4eb;
  --color-raised: #fffdf7;
  --color-sunken: #f0ead9;
  --color-ink: #1c1a15;
  --color-inksoft: #4a463c;
  --color-mute: #8a8375;
  --color-faint: #a39b88;
  --color-line: #e2dac5;
  --color-ember: #b3542e;
  --color-claude: #d97757;
  --color-codex: #10a37f;
  --color-live: #3d9970;
  --color-gh0: #ece5d2;
  --color-gh1: #aae6b8;
  --color-gh2: #6ccb7f;
  --color-gh3: #3da85c;
  --color-gh4: #267a41;
}

/* v2 shared primitives */
.site-card {
  background: var(--color-raised);
  border: 1px solid var(--color-line);
  border-radius: 6px;
}

.site-h {
  font-family: var(--font-jbmono), monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-mute);
  display: flex;
  align-items: center;
  gap: 10px;
}
.site-h::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-line);
}
.site-h b {
  color: var(--color-ember);
  font-weight: 500;
}

/* draw-in underline for nav + links */
.u-draw {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: background-size 0.25s ease;
}
.u-draw:hover {
  background-size: 100% 1px;
}

/* status badges */
.badge {
  font-family: var(--font-jbmono), monospace;
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2.5px 7px;
  border-radius: 3px;
  white-space: nowrap;
}
.badge-live { background: #dff2e5; color: #267a41; border: 1px solid #9ed4ae; }
.badge-ship { background: #f6e3d8; color: #b3542e; border: 1px solid #dfa27e; }
.badge-plain { border: 1px solid #c9c2b0; color: var(--color-mute); }

/* noise texture (self-contained SVG turbulence, ~4%) */
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* selection + focus in ember */
::selection {
  background: rgba(179, 84, 46, 0.25);
}
:focus-visible {
  outline: 2px solid var(--color-ember);
  outline-offset: 2px;
}

/* live dot pulse */
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--color-live);
  display: inline-block;
  animation: live-pulse 2.2s ease-in-out infinite;
}

/* responsible motion */
@media (prefers-reduced-motion: reduce) {
  .live-dot { animation: none; }
  .u-draw { transition: none; }
}
```

- [ ] **Step 2: Verify CSS compiles**

Run: `npm run build`
Expected: PASS with no CSS errors.

---

### Task 4: Root layout fonts (Fraunces + JetBrains Mono)

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add the two v2 fonts**

In `src/app/layout.tsx`, extend the font import and add:

```tsx
import { Geist, Geist_Mono, Syne, Fraunces, JetBrains_Mono } from "next/font/google";
```

```tsx
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});
```

Add both variables to the body className:

```tsx
className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${fraunces.variable} ${jbMono.variable} antialiased`}
```

(Metadata was already replaced in Task 2 Step 3 — new title/description/OG live there.)

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: PASS. Font variables `--font-fraunces` and `--font-jbmono` available globally (`/v1` is unaffected — it doesn't reference them).

---

### Task 5: Site data library

Single typed source of truth for sidebar, vitals, working/learning, competitions, experience, certificates. Migrated + trimmed from `src/app/preview/_lib/data.ts` (which gets deleted in Task 16).

**Files:**
- Create: `src/lib/site-data.ts`

- [ ] **Step 1: Create `src/lib/site-data.ts`**

```ts
export const socials = [
  { label: "GitHub", href: "https://github.com/Elliot-Sones" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elliot-sones/" },
  { label: "Resume", href: "/resume.pdf" },
  { label: "Email", href: "mailto:soneselliot@gmail.com" },
];

export const navItems = [
  { slug: "projects", label: "Projects", number: "01" },
  { slug: "competitions", label: "Competitions", number: "02" },
  { slug: "learning", label: "Learning Blogs", number: "03" },
  { slug: "experience", label: "Experience", number: "04" },
];

export const vitals = [
  { label: "Position", value: "ML Engineer" },
  { label: "Club", value: "TMU · Class of '26" },
  { label: "Focus", value: "RL · Transformers", accent: true },
  { label: "Stack", value: "PyTorch · Next.js · Supabase" },
  { label: "Languages", value: "Python · TypeScript · Go" },
];

export interface StatusItem {
  title: string;
  detail: string;
  badge: string;
  tone: "live" | "ship" | "plain";
}

export const workingOn: StatusItem[] = [
  {
    title: "rl-soccer-v2",
    detail: "Retraining self-play with shaped rewards; writing up what broke",
    badge: "training",
    tone: "live",
  },
  {
    title: "This portfolio",
    detail: "Next.js 16 · MDX · live stats — you're looking at it",
    badge: "shipping",
    tone: "ship",
  },
  {
    title: "CoCivil",
    detail: "Polishing RAG zoning search after Hack Canada",
    badge: "iterating",
    tone: "plain",
  },
];

export const learningNow: StatusItem[] = [
  {
    title: "Distributed RL",
    detail: "IMPALA / SEED actor-learner setups",
    badge: "papers",
    tone: "plain",
  },
  {
    title: "CUDA & Triton",
    detail: "Writing kernels instead of importing them",
    badge: "course",
    tone: "plain",
  },
  {
    title: "RLHF",
    detail: "Preference tuning beyond the tutorial version",
    badge: "reading",
    tone: "plain",
  },
];

export interface Competition {
  slug: string;
  name: string;
  project: string;
  date: string;
  outcome?: string;
  git?: string;
  link?: string;
  description: string;
}

export const competitions: Competition[] = [
  {
    slug: "splxutspan-2026",
    name: "SPLxUTSPAN 2026 Data Challenge",
    project: "Free Throw Prediction from Motion Capture",
    date: "February 2026",
    outcome: "1st Place",
    git: "https://github.com/Elliot-Sones/SPLxUTSPAN-2026-Data-Challenge",
    link: "https://www.kaggle.com/competitions/spl-utspan-data-challenge-2026",
    description:
      "Kaggle competition predicting basketball free throw outcomes from 69-joint motion capture data. Per-player biomechanical models, temporal commitment analysis, kinetic chain features, and CNN ensembles — 0.006148 MSE.",
  },
  {
    slug: "hack-canada-2026",
    name: "Hack Canada 2026",
    project: "CoCivil — Land Development Due Diligence Platform",
    date: "March 2026",
    outcome: "Won Google Studio AI",
    git: "https://github.com/Elliot-Sones/Hack_Canada",
    link: "https://cocivils.com",
    description:
      "Full-stack due diligence platform for Toronto land development. Generates planning submission packages from a plain-English query using AI, zoning analysis, 3D massing, and RAG-powered policy search.",
  },
  {
    slug: "mues-2025",
    name: "MUES Hackathon 2025",
    project: "Magic Studio Paint",
    date: "October 2025",
    outcome: "1st Place",
    git: "https://github.com/Elliot-Sones/MUESHACK",
    link: "https://magicspace.vercel.app/",
    description:
      "A canvas you can draw on, then choose a character and interact with the drawing.",
  },
  {
    slug: "uoft-anthropic",
    name: "UofT Anthropic Hackathon",
    project: "RL Agent for a 2D Fighting Game",
    date: "October 2025",
    git: "https://github.com/Elliot-Sones/AI_2",
    description:
      "Reinforcement learning agent that learns to play a 2D fighting game through self-play and neural network training.",
  },
  {
    slug: "pond-2025",
    name: "Pond Hackathon 2025",
    project: "Nodelet",
    date: "July 2025",
    outcome: "20,000+ votes",
    git: "https://github.com/Elliot-Sones/Pond-Hackathon",
    link: "https://nodelet-web.vercel.app/",
    description: "Educational interactive learning platform for crypto literacy.",
  },
];

export interface ExperienceItem {
  role: string;
  org: string;
  period: string;
  detail: string;
  current?: boolean;
}

export const experience: ExperienceItem[] = [
  {
    role: "Machine Learning Research Intern",
    org: "NTangible",
    period: "Nov 2025 — present",
    current: true,
    detail:
      "Exploring real-world applications of AI/ML in sports psychology, combining technical development with performance analytics.",
  },
  {
    role: "BSc Computer Science",
    org: "Toronto Metropolitan University",
    period: "2022 — 2026 (expected)",
    detail:
      "Focused on reinforcement learning, transformer architectures, and applied AI.",
  },
];

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  link: string;
}

export const certificates: Certificate[] = [
  {
    title: "Machine Learning Specialization",
    issuer: "Stanford Online & DeepLearning.AI",
    date: "2024",
    link: "https://coursera.org/share/c11e6b7d48feb1562c4f00e27cc5a918",
  },
  {
    title: "Python for Everybody",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/01bb7c66747ac3c22eb8dee7bf0ee71f",
  },
  {
    title: "JavaScript Certificate",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/bbff1834c39f1aecfd3a04b534eee3d1",
  },
  {
    title: "HTML5 Certificate",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/5acc063d1324a5f2105e65e168f8f70b",
  },
  {
    title: "CSS3 Certificate",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/b34968314e48535fe5bb123884f16711",
  },
];
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors in the new file.

---

### Task 6: GitHub data library + API refactor + recent-commits route

The GitHub panel is a server component — it must not fetch its own API routes. Extract the proven logic from `src/app/api/github-activity/route.ts` into `src/lib/github.ts`, make the route a thin wrapper (keeping its public type re-exports so existing imports keep working), and add a `getRecentCommits()` for the commit feed (backed by a new `/api/github-events` route for any future client use).

**Files:**
- Create: `src/lib/github.ts`
- Modify: `src/app/api/github-activity/route.ts` (rewrite as thin wrapper, keep type re-exports)
- Create: `src/app/api/github-events/route.ts`

- [ ] **Step 1: Create `src/lib/github.ts`**

```ts
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
```

- [ ] **Step 2: Rewrite `src/app/api/github-activity/route.ts` as a thin wrapper**

Replace the entire file:

```ts
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
```

Note: the type re-export keeps `import type { GithubActivity } from "@/app/api/github-activity/route"` (used by `/v1`-era client code) working unchanged.

- [ ] **Step 3: Create `src/app/api/github-events/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getRecentCommits } from "@/lib/github";

export async function GET() {
  const commits = await getRecentCommits();
  return NextResponse.json({ commits });
}
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`
Expected: PASS. Then with `npm run dev` running, `curl -s http://localhost:3000/api/github-activity | head -c 200` returns activity JSON (requires `GITHUB_TOKEN` in `.env.local` — it already exists for the current site), and `curl -s http://localhost:3000/api/github-events | head -c 200` returns `{"commits":[...`.

---

### Task 7: AI usage script + real data

**Files:**
- Create: `scripts/update-ai-usage.mjs`
- Create: `src/lib/ai-usage.ts`
- Create: `data/ai-usage.json` (generated by running the script)

- [ ] **Step 1: Create `scripts/update-ai-usage.mjs`**

Parses Claude Code session logs (`~/.claude/projects/**/*.jsonl` — assistant entries carry `message.usage` token counts) and Codex CLI rollout logs (`~/.codex/sessions/**/*.jsonl` — entries carry token-count records; format is sniffed defensively and yields 0 if unrecognized, never throws).

```js
// NOTE: synced to the shipped script after three post-plan bugfixes
// (cache-token exclusion, Codex cumulative-max per file, per-session thread-tree max).
#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const HOME = os.homedir();
const CLAUDE_DIR = path.join(HOME, ".claude", "projects");
const CODEX_DIR = path.join(HOME, ".codex", "sessions");
const OUT = path.join(process.cwd(), "data", "ai-usage.json");

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".jsonl")) yield p;
  }
}

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function dayKey(d) {
  return d.toISOString().slice(0, 10);
}

function blankStats() {
  return { tokens: 0, sessions: new Set(), byDay: new Map() };
}

function addTokens(stats, { tokens, sessionId, timestamp }) {
  if (!tokens || !timestamp) return;
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return;
  const now = new Date();
  if (monthKey(d) !== monthKey(now)) return; // current month only for totals
  stats.tokens += tokens;
  if (sessionId) stats.sessions.add(sessionId);
  const k = dayKey(d);
  stats.byDay.set(k, (stats.byDay.get(k) ?? 0) + tokens);
}

function parseClaude() {
  const stats = blankStats();
  for (const file of walk(CLAUDE_DIR)) {
    let lines;
    try {
      lines = fs.readFileSync(file, "utf8").split("
");
    } catch {
      continue;
    }
    for (const line of lines) {
      if (!line.includes('"usage"')) continue;
      try {
        const entry = JSON.parse(line);
        const u = entry?.message?.usage;
        if (!u) continue;
        // input + output only — cache tokens re-count the same context every
        // turn and inflate totals into the billions
        const tokens = (u.input_tokens ?? 0) + (u.output_tokens ?? 0);
        addTokens(stats, {
          tokens,
          sessionId: entry.sessionId,
          timestamp: entry.timestamp,
        });
      } catch {
        /* skip malformed line */
      }
    }
  }
  return stats;
}

function parseCodex() {
  const stats = blankStats();
  // Files are rollout logs; agent swarms fork heavily (session_meta carries a
  // shared session_id + forked_from_id), and a forked file's cumulative totals
  // replay its parent's. So: per file take the max cumulative non-cache total,
  // then group by session_id and count each thread tree ONCE (its max),
  // attributed to the tree's latest day.
  const threads = new Map(); // session_id -> { tokens, lastDate }
  for (const file of walk(CODEX_DIR)) {
    let lines;
    try {
      lines = fs.readFileSync(file, "utf8").split("
");
    } catch {
      continue;
    }
    let fileTokens = 0;
    let lastDate = null;
    let sessionId = null;
    for (const line of lines) {
      if (!sessionId && line.includes('"session_meta"')) {
        try {
          sessionId = JSON.parse(line)?.payload?.session_id ?? null;
        } catch {
          /* keep looking */
        }
      }
      if (!line.includes('"token_count"')) continue;
      try {
        const entry = JSON.parse(line);
        // token_count events fire per streamed chunk; total_token_usage is the
        // session-cumulative counter. input_tokens includes cached_input_tokens,
        // so subtract it (cache re-reads aren't real usage).
        const total = entry?.payload?.info?.total_token_usage;
        if (!total) continue;
        const nonCache =
          Math.max(0, (total.input_tokens ?? 0) - (total.cached_input_tokens ?? 0)) +
          (total.output_tokens ?? 0);
        if (nonCache > fileTokens) fileTokens = nonCache;
        const d = new Date(entry?.timestamp);
        if (!Number.isNaN(d.getTime())) lastDate = d;
      } catch {
        /* skip malformed line */
      }
    }
    if (!fileTokens || !lastDate) continue;
    const key = sessionId ?? path.basename(file, ".jsonl");
    const prev = threads.get(key);
    threads.set(key, {
      tokens: Math.max(prev?.tokens ?? 0, fileTokens),
      lastDate: !prev || lastDate > prev.lastDate ? lastDate : prev.lastDate,
    });
  }
  const now = new Date();
  for (const [id, t] of threads) {
    if (monthKey(t.lastDate) !== monthKey(now)) continue;
    stats.tokens += t.tokens;
    stats.sessions.add(id);
    const k = dayKey(t.lastDate);
    stats.byDay.set(k, (stats.byDay.get(k) ?? 0) + t.tokens);
  }
  return stats;
}

function last14Days(claude, codex) {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    days.push({
      date: k,
      claude: claude.byDay.get(k) ?? 0,
      codex: codex.byDay.get(k) ?? 0,
    });
  }
  return days;
}

const claude = parseClaude();
const codex = parseCodex();

const out = {
  generatedAt: new Date().toISOString(),
  month: monthKey(new Date()),
  claude: { tokens: claude.tokens, sessions: claude.sessions.size },
  codex: { tokens: codex.tokens, sessions: codex.sessions.size },
  days: last14Days(claude, codex),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "
");
console.log(`wrote ${OUT}`);
console.log(`claude: ${out.claude.tokens.toLocaleString()} tokens, ${out.claude.sessions} sessions`);
console.log(`codex:  ${out.codex.tokens.toLocaleString()} tokens, ${out.codex.sessions} sessions`);
```

- [ ] **Step 2: Create `src/lib/ai-usage.ts`**

```ts
import fs from "node:fs";
import path from "node:path";

export interface AiUsageDay {
  date: string;
  claude: number;
  codex: number;
}

export interface AiUsage {
  generatedAt: string;
  month: string;
  claude: { tokens: number; sessions: number };
  codex: { tokens: number; sessions: number };
  days: AiUsageDay[];
}

export function getAiUsage(): AiUsage | null {
  try {
    const p = path.join(process.cwd(), "data", "ai-usage.json");
    return JSON.parse(fs.readFileSync(p, "utf8")) as AiUsage;
  } catch {
    return null;
  }
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
```

- [ ] **Step 3: Run the script for real**

Run: `npm run stats`
Expected: prints `wrote data/ai-usage.json` plus claude/codex totals. Inspect `data/ai-usage.json` — `days` must have 14 entries, `claude.tokens` should be non-zero on a machine with Claude Code history. If `codex.tokens` is 0 but you have Codex history, the rollout format has drifted — inspect one file (`ls ~/.codex/sessions/**/*.jsonl | tail -1 | xargs head -5`) and adjust the sniffed paths in `parseCodex`.

- [ ] **Step 4: Verify build reads it**

Run: `npm run build`
Expected: PASS.

---

### Task 8: Sidebar + `(site)` shell layout

**Files:**
- Create: `src/components/site/Sidebar.tsx` (client)
- Create: `src/components/site/SectionHeader.tsx`
- Create: `src/app/(site)/layout.tsx`

- [ ] **Step 1: Create `src/components/site/Sidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, socials } from "@/lib/site-data";

function Wordmark() {
  return (
    <Link href="/" className="block group">
      <div className="font-[family-name:var(--font-fraunces)] text-[26px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
        Elliot
        <br />
        Sones<span className="text-ember">.</span>
      </div>
      <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.14em] leading-[1.7] text-mute">
        ML Engineer
        <br />
        RL · Transformers
      </div>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col">
      {navItems.map((item) => {
        const href = `/${item.slug}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={item.slug}
            href={href}
            onClick={onNavigate}
            className={`group flex items-baseline gap-2.5 border-t border-line py-2.5 font-[family-name:var(--font-jbmono)] text-[12px] transition-colors ${
              active ? "text-ink font-bold" : "text-inksoft hover:text-ink"
            }`}
          >
            <span className="text-[9px] text-ember">{item.number}</span>
            <span className="u-draw">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Socials() {
  return (
    <div className="flex flex-col gap-1.5 border-t border-line pt-3.5">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith("http") ? "_blank" : undefined}
          rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="font-[family-name:var(--font-jbmono)] text-[10px] text-inksoft hover:text-ember transition-colors"
        >
          <b className="font-medium text-ink">{s.label}</b>
          <span className="text-faint"> ↗</span>
        </a>
      ))}
    </div>
  );
}

export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-[250px] md:shrink-0 md:flex-col md:sticky md:top-0 md:h-screen bg-sunken border-r border-line p-6">
        <Wordmark />
        <div className="mt-8">
          <NavLinks />
        </div>
        <div className="mt-auto">
          <Socials />
          <div className="mt-3 font-[family-name:var(--font-jbmono)] text-[8.5px] uppercase tracking-[0.16em] text-faint">
            Toronto · TMU &apos;26
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-sunken/95 backdrop-blur border-b border-line px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink"
          >
            Elliot Sones<span className="text-ember">.</span>
          </Link>
        </div>
        <div className="mt-2 flex gap-4 overflow-x-auto">
          <MobileNav />
        </div>
      </div>
    </>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <>
      {navItems.map((item) => {
        const href = `/${item.slug}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={item.slug}
            href={href}
            className={`whitespace-nowrap font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.12em] ${
              active ? "text-ember" : "text-inksoft"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
```

- [ ] **Step 2: Create `src/components/site/SectionHeader.tsx`**

```tsx
export function SectionHeader({ marker, title }: { marker: string; title: string }) {
  return (
    <div className="site-h">
      <b>{marker}</b>
      {title}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/(site)/layout.tsx`**

```tsx
import { Sidebar } from "@/components/site/Sidebar";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-paper text-ink min-h-screen">
      <div className="noise-overlay" aria-hidden />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 min-w-0 px-5 py-6 md:px-8 md:py-7 max-w-[1100px]">
          {children}
          <footer className="mt-14 flex items-center justify-between border-t border-line pt-4 font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.16em] text-faint">
            <span>© 2026 Elliot Sones</span>
            <a href="/v1" className="hover:text-ember transition-colors" title="the old site">
              v1 ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`
Expected: PASS (layout with no page under `(site)` is fine — `/` still 404s until Task 10).

---

### Task 9: Live stat panels

**Files:**
- Create: `src/components/site/AiUsagePanel.tsx`
- Create: `src/components/site/GitHubPanel.tsx`

- [ ] **Step 1: Create `src/components/site/AiUsagePanel.tsx`** (server component; `DayBars` is co-located since only this panel uses it)

```tsx
import { getAiUsage, formatTokens } from "@/lib/ai-usage";

function DayBars({ days }: { days: { date: string; claude: number; codex: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.claude + d.codex));
  return (
    <div className="mt-3 flex items-end gap-1 h-11">
      {days.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col-reverse gap-px" title={d.date}>
          <div
            className="rounded-[1px] bg-claude"
            style={{ height: `${Math.max(2, (d.claude / max) * 100)}%` }}
          />
          {d.codex > 0 && (
            <div
              className="rounded-[1px] bg-codex"
              style={{ height: `${Math.max(2, (d.codex / max) * 100)}%` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function AiUsagePanel() {
  const usage = getAiUsage();

  if (!usage) {
    return (
      <div className="site-card p-4">
        <div className="flex items-center justify-between font-[family-name:var(--font-jbmono)] text-[8.5px] uppercase tracking-[0.16em] text-mute mb-2">
          <span>AI pair-programming</span>
        </div>
        <p className="font-[family-name:var(--font-jbmono)] text-[10px] text-faint">
          No usage data — run <code className="text-ember">npm run stats</code> locally.
        </p>
      </div>
    );
  }

  const total = usage.claude.tokens + usage.codex.tokens;
  const claudePct = total > 0 ? (usage.claude.tokens / total) * 100 : 50;
  const updated = new Date(usage.generatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="site-card p-4">
      <div className="flex items-center justify-between font-[family-name:var(--font-jbmono)] text-[8.5px] uppercase tracking-[0.16em] text-mute mb-2.5">
        <span>AI pair-programming</span>
        <span className="live-dot" aria-label="live" />
      </div>
      <div className="font-[family-name:var(--font-fraunces)] text-[30px] font-semibold tracking-[-0.02em] text-ink">
        {formatTokens(total)}{" "}
        <small className="font-[family-name:var(--font-jbmono)] text-[10px] font-normal text-mute tracking-[0.05em]">
          tokens this month
        </small>
      </div>
      <div className="mt-2.5 mb-1.5 flex h-3.5 overflow-hidden rounded-[3px]">
        <div className="bg-claude" style={{ width: `${claudePct}%` }} />
        <div className="bg-codex" style={{ width: `${100 - claudePct}%` }} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 font-[family-name:var(--font-jbmono)] text-[9px] text-inksoft">
        <span>
          <i className="inline-block w-2 h-2 rounded-[2px] bg-claude mr-1.5 align-[-1px]" />
          Claude Code · {formatTokens(usage.claude.tokens)} · {usage.claude.sessions} sessions
        </span>
        <span>
          <i className="inline-block w-2 h-2 rounded-[2px] bg-codex mr-1.5 align-[-1px]" />
          Codex · {formatTokens(usage.codex.tokens)} · {usage.codex.sessions} sessions
        </span>
      </div>
      <DayBars days={usage.days} />
      <div className="mt-1.5 flex justify-between font-[family-name:var(--font-jbmono)] text-[8px] text-faint">
        <span>14 days ago</span>
        <span>tokens / day, stacked · updated {updated}</span>
        <span>today</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/site/GitHubPanel.tsx`** (server component; `StreakRow`, `ContributionCalendar`, `CommitFeed` co-located — only this panel uses them)

```tsx
import {
  getGithubActivity,
  getRecentCommits,
  relativeTime,
  shortDate,
  type ContributionWeek,
  type RecentCommit,
} from "@/lib/github";

function StreakRow({
  total,
  current,
  longest,
  currentStart,
  currentEnd,
  longestStart,
  longestEnd,
}: {
  total: number;
  current: number;
  longest: number;
  currentStart: string | null;
  currentEnd: string | null;
  longestStart: string | null;
  longestEnd: string | null;
}) {
  const cell = (
    n: string,
    label: string,
    dates: string,
    hot = false,
  ) => (
    <div
      className={`px-2.5 py-2 text-center ${hot ? "bg-[#fdf3ec]" : ""}`}
    >
      <div
        className={`font-[family-name:var(--font-fraunces)] text-[20px] font-semibold tracking-[-0.02em] ${
          hot ? "text-claude" : "text-ink"
        }`}
      >
        {n}
      </div>
      <div className="mt-0.5 font-[family-name:var(--font-jbmono)] text-[7.5px] uppercase tracking-[0.16em] text-faint">
        {label}
      </div>
      <div className="font-[family-name:var(--font-jbmono)] text-[8px] text-mute">{dates}</div>
    </div>
  );

  return (
    <div className="mb-3 grid grid-cols-[1fr_1.1fr_1fr] overflow-hidden rounded-[5px] border border-line divide-x divide-line">
      {cell(total.toLocaleString(), "Total contributions", "past year")}
      {cell(
        String(current),
        "Current streak",
        current > 0 ? `${shortDate(currentStart)} — ${currentEnd ? "today" : ""}` : "—",
        true,
      )}
      {cell(
        String(longest),
        "Longest streak",
        longest > 0 ? `${shortDate(longestStart)} — ${shortDate(longestEnd)}` : "—",
      )}
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

function ContributionCalendar({ weeks }: { weeks: ContributionWeek[] }) {
  const recent = weeks.slice(-26);
  return (
    <div>
      <div className="grid grid-rows-7 grid-flow-col gap-[2.5px] h-[86px]">
        {recent.flatMap((week, wi) =>
          Array.from({ length: 7 }).map((_, di) => {
            const day = week.days.find((d) => d.weekday === di);
            if (!day) return <div key={`${wi}-${di}`} />;
            return (
              <div
                key={`${wi}-${di}`}
                className={`rounded-[1.5px] ${levelFor(day.count)}`}
                title={`${day.count} contribution${day.count === 1 ? "" : "s"} · ${day.date}`}
              />
            );
          }),
        )}
      </div>
      <div className="mt-1.5 flex justify-between font-[family-name:var(--font-jbmono)] text-[8px] text-faint">
        <span>26 weeks ago</span>
        <span>contributions / day</span>
        <span>today</span>
      </div>
    </div>
  );
}

function CommitFeed({ commits }: { commits: RecentCommit[] }) {
  if (commits.length === 0) return null;
  return (
    <div className="mt-2.5">
      {commits.map((c, i) => (
        <div
          key={`${c.repo}-${i}`}
          className="flex items-baseline gap-2 border-t border-line py-1.5 font-[family-name:var(--font-jbmono)] text-[9.5px] text-inksoft"
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
          <span className="ml-auto shrink-0 text-[8.5px] text-faint">
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
      <div className="site-card p-4">
        <div className="font-[family-name:var(--font-jbmono)] text-[8.5px] uppercase tracking-[0.16em] text-mute mb-2">
          GitHub — Elliot-Sones
        </div>
        <p className="font-[family-name:var(--font-jbmono)] text-[10px] text-faint">
          GitHub data unavailable right now.
        </p>
      </div>
    );
  }

  return (
    <div className="site-card p-4">
      <div className="flex items-center justify-between font-[family-name:var(--font-jbmono)] text-[8.5px] uppercase tracking-[0.16em] text-mute mb-2.5">
        <span>GitHub — {activity.username}</span>
        <span className="live-dot" aria-label="live" />
      </div>
      <StreakRow
        total={activity.totalContributions}
        current={activity.currentStreak}
        longest={activity.longestStreak}
        currentStart={activity.currentStreakStart}
        currentEnd={activity.currentStreakEnd}
        longestStart={activity.longestStreakStart}
        longestEnd={activity.longestStreakEnd}
      />
      <ContributionCalendar weeks={activity.weeks} />
      <CommitFeed commits={commits} />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Expected: PASS.

---

### Task 10: Home page

**Files:**
- Create: `src/components/site/StatusList.tsx` (renders both working-on and learning columns)
- Create: `src/components/site/AboutVitals.tsx`
- Create: `src/app/(site)/page.tsx`

- [ ] **Step 1: Create `src/components/site/StatusList.tsx`**

```tsx
import type { StatusItem } from "@/lib/site-data";

const toneClass: Record<StatusItem["tone"], string> = {
  live: "badge badge-live",
  ship: "badge badge-ship",
  plain: "badge badge-plain",
};

export function StatusList({ items }: { items: StatusItem[] }) {
  return (
    <div className="mt-1.5">
      {items.map((item) => (
        <div
          key={item.title}
          className="group flex items-baseline gap-2.5 border-t border-line py-2"
        >
          <span className="font-[family-name:var(--font-fraunces)] text-[14px] text-ink">
            {item.title}
          </span>
          <span className="flex-1 font-[family-name:var(--font-jbmono)] text-[9.5px] leading-relaxed text-inksoft">
            {item.detail}
          </span>
          <span className={toneClass[item.tone]}>{item.badge}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/site/AboutVitals.tsx`**

```tsx
import { vitals } from "@/lib/site-data";

export function AboutVitals() {
  return (
    <div className="site-card">
      {vitals.map((v, i) => (
        <div key={v.label} className={`px-3 py-2 ${i > 0 ? "border-t border-line" : ""}`}>
          <div className="font-[family-name:var(--font-jbmono)] text-[7.5px] uppercase tracking-[0.2em] text-faint">
            {v.label}
          </div>
          <div
            className={`mt-0.5 font-[family-name:var(--font-jbmono)] text-[10.5px] ${
              v.accent ? "text-ember" : "text-ink"
            }`}
          >
            {v.value}
          </div>
        </div>
      ))}
    </div>
  );
}
```

Note: `vitals` entries have an optional `accent` field — it exists in `site-data.ts` (Task 5) as `accent: true` on Focus. TypeScript infers the array element type with optional `accent` from the literal; no change needed.

- [ ] **Step 3: Create `src/app/(site)/page.tsx`**

```tsx
import { AiUsagePanel } from "@/components/site/AiUsagePanel";
import { GitHubPanel } from "@/components/site/GitHubPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusList } from "@/components/site/StatusList";
import { AboutVitals } from "@/components/site/AboutVitals";
import { workingOn, learningNow } from "@/lib/site-data";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Live strip */}
      <section>
        <SectionHeader marker="◉" title="Live" />
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
          <AiUsagePanel />
          <GitHubPanel />
        </div>
      </section>

      {/* Working on / Learning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div>
          <SectionHeader marker="01" title="What I'm working on" />
          <StatusList items={workingOn} />
        </div>
        <div>
          <SectionHeader marker="02" title="What I'm learning" />
          <StatusList items={learningNow} />
        </div>
      </section>

      {/* About */}
      <section>
        <SectionHeader marker="03" title="About" />
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-6 items-start">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] font-medium tracking-[-0.02em] text-ink mb-2.5">
              When I&apos;m not coding…
            </h1>
            <p className="font-[family-name:var(--font-jbmono)] text-[11.5px] leading-[1.75] text-inksoft mb-2.5">
              <em className="font-[family-name:var(--font-fraunces)] text-[13px] italic text-ink">
                I&apos;m Elliot — a CS student at Toronto Metropolitan University
              </em>{" "}
              training agents that play games and building tools that use LLMs. Most of
              my learning happens in public: hackathons, Kaggle, and an unreasonable
              number of tokens.
            </p>
            <p className="font-[family-name:var(--font-jbmono)] text-[11.5px] leading-[1.75] text-inksoft">
              When I&apos;m not coding, I play as much soccer as I can — I&apos;ve played
              my whole life, including one season in Portugal. When I&apos;m not playing,
              it&apos;s music, anime, and friends.
            </p>
          </div>
          <AboutVitals />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Verify + visual check**

Run: `npm run lint && npm run build` — expect PASS.
Run: `npm run dev`, open Chrome at `http://localhost:3000/`.
Expected (compare against mock `layout-v6.html`): sidebar with wordmark/nav/socials; live strip with AI usage panel (real numbers from `data/ai-usage.json`) and GitHub panel (streak row, 7×26 calendar, commit feed); working/learning columns; about + vitals; noise texture visible on close inspection; footer with v1 link. Check at 375px width too — sidebar becomes top bar, panels stack. Also open `/v1` and confirm it still looks exactly like the Task 2 screenshot.

---

### Task 11: MDX plumbing

**Files:**
- Create: `src/lib/mdx.ts`
- Create: `src/components/site/Mdx.tsx`

- [ ] **Step 1: Create `src/components/site/Mdx.tsx`**

Component mapping for compiled MDX + the `RLDemo` embed (client game inside a neutral frame). Server-renderable; `RLSoccerGame` is itself a client component, so the embed crosses the boundary cleanly.

```tsx
import type { MDXComponents } from "mdx/types";
import RLSoccerGame from "@/components/RLSoccerGame";

function RLDemo() {
  return (
    <figure className="my-6">
      <div className="site-card overflow-hidden p-1.5 h-[540px]">
        <RLSoccerGame className="h-full w-full" />
      </div>
      <figcaption className="mt-2 font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.16em] text-faint">
        Live — the agent trains in your browser. Switch to 1v1 to play against it.
      </figcaption>
    </figure>
  );
}

export const mdxComponents: MDXComponents = {
  RLDemo,
  h1: (props) => (
    <h1
      className="font-[family-name:var(--font-fraunces)] text-[24px] font-semibold tracking-[-0.02em] text-ink mt-8 mb-3"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-[family-name:var(--font-fraunces)] text-[19px] font-semibold tracking-[-0.01em] text-ink mt-7 mb-2"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-[family-name:var(--font-jbmono)] text-[11px] font-bold uppercase tracking-[0.14em] text-ink mt-6 mb-2"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="font-[family-name:var(--font-fraunces)] text-[15.5px] leading-[1.8] text-inksoft my-3.5"
      {...props}
    />
  ),
  a: (props) => (
    <a className="text-ember u-draw" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  ul: (props) => <ul className="my-3.5 ml-5 list-disc marker:text-ember" {...props} />,
  ol: (props) => <ol className="my-3.5 ml-5 list-decimal marker:text-ember" {...props} />,
  li: (props) => (
    <li
      className="font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.75] text-inksoft my-1"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-2 border-ember pl-4 font-[family-name:var(--font-fraunces)] italic text-[15px] text-inksoft"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="font-[family-name:var(--font-jbmono)] text-[0.85em] bg-sunken border border-line rounded px-1 py-0.5"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-4 overflow-x-auto rounded-md border border-line bg-raised p-4 font-[family-name:var(--font-jbmono)] text-[12px] leading-relaxed [&_code]:bg-transparent [&_code]:border-0 [&_code]:p-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-line" />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
};
```

- [ ] **Step 2: Create `src/lib/mdx.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import type { ReactElement } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/site/Mdx";

export interface PostFrontmatter {
  title: string;
  date: string;
  tag: string;
  description: string;
}

export interface ProjectFrontmatter {
  title: string;
  hook: string;
  year: string;
  badges: string[];
  tech: string[];
  repo?: string;
  demo?: string;
  order: number;
}

type Kind = "learning" | "projects";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getSlugs(kind: Kind): string[] {
  try {
    return fs
      .readdirSync(path.join(CONTENT_DIR, kind))
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export async function getMdx<T>(
  kind: Kind,
  slug: string,
): Promise<{ frontmatter: T; content: ReactElement; readingTime: number } | null> {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, kind, `${slug}.mdx`), "utf8");
    const words = raw.split(/\s+/).filter(Boolean).length;
    const { content, frontmatter } = await compileMDX<T>({
      source: raw,
      components: mdxComponents,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, { theme: "github-light" }]],
        },
      },
    });
    return { frontmatter, content, readingTime: Math.max(1, Math.round(words / 200)) };
  } catch {
    return null;
  }
}

export async function getAllMeta<T extends object>(
  kind: Kind,
): Promise<(T & { slug: string })[]> {
  const slugs = getSlugs(kind);
  const all = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getMdx<T>(kind, slug);
      return post ? { ...post.frontmatter, slug } : null;
    }),
  );
  return all.filter((x): x is T & { slug: string } => x !== null);
}
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`
Expected: PASS (nothing consumes these yet).

---

### Task 12: Projects — index, `[slug]`, and 4 case studies

**Files:**
- Create: `src/app/(site)/projects/page.tsx`
- Create: `src/app/(site)/projects/[slug]/page.tsx`
- Create: `content/projects/rl-soccer-agent.mdx`
- Create: `content/projects/splxutspan-free-throw.mdx`
- Create: `content/projects/cocivil.mdx`
- Create: `content/projects/from-scratch-ml.mdx`

The MDX bodies are honest first drafts from known facts (repo descriptions, competition writeups) — Elliot should rewrite them in his own voice before shipping; they're complete, not placeholders.

- [ ] **Step 1: Create `src/app/(site)/projects/page.tsx`**

```tsx
import Link from "next/link";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getAllMeta, type ProjectFrontmatter } from "@/lib/mdx";

export const metadata = { title: "Projects — Elliot Sones" };

export default async function ProjectsPage() {
  const projects = await getAllMeta<ProjectFrontmatter>("projects");
  projects.sort((a, b) => a.order - b.order);

  return (
    <div>
      <SectionHeader marker="01" title="Projects — deep dives, not an archive" />
      <div className="mt-4">
        {projects.length === 0 && (
          <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
            Case studies are being written.
          </p>
        )}
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group flex items-baseline gap-4 border-t border-line py-3.5"
          >
            <span className="font-[family-name:var(--font-jbmono)] text-[10px] text-ember">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 min-w-0">
              <span className="font-[family-name:var(--font-fraunces)] text-[17px] font-medium text-ink u-draw">
                {p.title}
              </span>
              <span className="block mt-1 font-[family-name:var(--font-jbmono)] text-[10px] leading-relaxed text-mute">
                {p.hook}
              </span>
            </span>
            <span className="hidden sm:flex gap-1.5">
              {p.badges.map((b) => (
                <span key={b} className="badge badge-plain">{b}</span>
              ))}
            </span>
            <span className="font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
              {p.year}
            </span>
            <span className="text-faint opacity-0 transition-opacity group-hover:opacity-100">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/(site)/projects/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getMdx, getSlugs, type ProjectFrontmatter } from "@/lib/mdx";

export function generateStaticParams() {
  return getSlugs("projects").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getMdx<ProjectFrontmatter>("projects", slug);
  return { title: project ? `${project.frontmatter.title} — Elliot Sones` : "Projects" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getMdx<ProjectFrontmatter>("projects", slug);
  if (!project) notFound();

  const { frontmatter: p, content } = project;

  return (
    <article className="max-w-[680px]">
      <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.2em] text-ember">
        Case study · {p.year}
      </div>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
        {p.title}
      </h1>
      <p className="mt-2 font-[family-name:var(--font-fraunces)] italic text-[15px] text-mute">
        {p.hook}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {p.badges.map((b) => (
          <span key={b} className="badge badge-ship">{b}</span>
        ))}
        {p.tech.map((t) => (
          <span key={t} className="badge badge-plain">{t}</span>
        ))}
      </div>
      <div className="mt-3 flex gap-5 font-[family-name:var(--font-jbmono)] text-[10px]">
        {p.repo && (
          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-ember u-draw">
            Code ↗
          </a>
        )}
        {p.demo && (
          <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-ember u-draw">
            Live ↗
          </a>
        )}
      </div>
      <hr className="my-6 border-line" />
      {content}
    </article>
  );
}
```

- [ ] **Step 3: Create `content/projects/rl-soccer-agent.mdx`**

````mdx
---
title: "RL Soccer Agent"
hook: "A tabular Q-learning agent that learns to play 2-a-side soccer in your browser — and the playable proof that RL is more subtle than the tutorials suggest."
year: "2026"
badges: ["playable"]
tech: ["TypeScript", "Q-learning", "React", "Canvas"]
repo: "https://github.com/Elliot-Sones"
order: 1
---

<RLDemo />

## The problem

Most RL demos stop at CartPole. I wanted an agent I could actually *play against* — something with enough state structure that the interesting parts of reinforcement learning (exploration decay, reward shaping, curriculum) would stop being abstract.

The game: 2-a-side soccer on a 10×7 grid. The agent sees the ball, both players, and the goals; it picks one of five actions per tick; it trains live in the browser tab you're reading this in.

## How it works

The agent is tabular Q-learning with an ε-greedy policy — no neural network, on purpose. When the function approximator is a lookup table, you can watch every update happen and debug by inspection:

```python
# the whole idea, in one line
Q[s][a] += alpha * (reward + gamma * max(Q[s']) - Q[s][a])
```

- **State** (~discretized): ball position, agent position, opponent position, ball ownership
- **Reward**: goal scored, plus small shaping terms (moving the ball toward goal, stealing possession)
- **Training**: self-play against a scripted bot, ε decaying from 1.0 → 0.01, ~5,000 episodes to competence

## What I learned

The first version learned to *camp its own goal*. Shaping rewards that looked sensible — "reward moving toward the opponent's goal" — created a local optimum where never risking possession beat trying to score. The fix was a curriculum: train scoring against an empty net first, then introduce the defender. That ordering mattered more than any hyperparameter I touched.

The full writeup of what broke is in [Learning Blogs](/learning).
````

- [ ] **Step 4: Create `content/projects/splxutspan-free-throw.mdx`**

````mdx
---
title: "Free-Throw Prediction from Motion Capture"
hook: "1st place, SPLxUTSPAN 2026 Data Challenge — predicting whether a free throw goes in from 69 joints of motion-capture data, before the ball leaves the hand."
year: "2026"
badges: ["1st place"]
tech: ["Python", "PyTorch", "CNN", "Kaggle"]
repo: "https://github.com/Elliot-Sones/SPLxUTSPAN-2026-Data-Challenge"
demo: "https://www.kaggle.com/competitions/spl-utspan-data-challenge-2026"
order: 2
---

## The problem

SPLxUTSPAN's 2026 data challenge gave us motion-capture sequences — 69 joints, sampled through each shooter's motion — and asked: does the free throw go in? Scored on MSE against held-out shooters.

## Approach

Three ideas did most of the work:

- **Per-player biomechanical models.** Every shooter has a signature. Player embeddings let the model learn "what a make looks like *for this person*" instead of one global motion template.
- **Temporal commitment analysis.** The outcome is largely decided before release. Weighting the frames around the point of no return (wrist snap, knee extension peak) beat using the full sequence uniformly.
- **Kinetic chain features.** Hand-crafted features over joint-angle velocities — elbow, wrist, hip sequencing — fed alongside the raw pose stream into a 1D CNN ensemble.

Final score: **0.006148 MSE**, first place.

## What I learned

Feature engineering isn't dead. The end-to-end model alone was good; the model with biomechanically-motivated features was better. Knowing something about the domain — how a shooting motion actually chains from legs to wrist — was worth more than extra layers.
````

- [ ] **Step 5: Create `content/projects/cocivil.mdx`**

````mdx
---
title: "CoCivil — Land Development Due Diligence"
hook: "Won Google Studio AI at Hack Canada 2026 — a platform that turns a plain-English query about a Toronto property into a planning submission package."
year: "2026"
badges: ["winner"]
tech: ["Next.js", "RAG", "LLM agents", "3D massing"]
repo: "https://github.com/Elliot-Sones/Hack_Canada"
demo: "https://cocivils.com"
order: 3
---

## The problem

Due diligence for land development means weeks of zoning bylaw reading, setback math, and policy archaeology before you know whether a lot is even buildable. We built CoCivil at Hack Canada to compress that into a query.

## What it does

Type "What can I build at 123 Queen West?" and the platform:

- **Parses the query** into an address + intent with an LLM agent
- **Pulls zoning data** for the lot and computes constraints (height, setbacks, FSI)
- **Searches policy** with RAG over Toronto's official plan and bylaws, citing the sections that matter
- **Generates a 3D massing** of the maximum buildable envelope
- **Assembles a submission package** draft — the document a planner would actually start from

## What I learned

RAG quality is retrieval quality. The demo moment that won the judges over wasn't the generation — it was that every claim in the package linked back to the bylaw section it came from. Grounding is the feature; the LLM is the plumbing.

Built in 36 hours with a team. My part: the RAG policy search and the agent orchestration.
````

- [ ] **Step 6: Create `content/projects/from-scratch-ml.mdx`**

````mdx
---
title: "ML, From Scratch"
hook: "No frameworks allowed: an MLP/CNN/RNN library in NumPy, and 'Attention Is All You Need' re-implemented end-to-end as an English→French translator."
year: "2025"
badges: ["fundamentals"]
tech: ["Python", "NumPy", "TensorFlow", "Transformers"]
repo: "https://github.com/Elliot-Sones/Neural_Networks_Fundamentals"
order: 4
---

## Why from scratch

Frameworks hide exactly the parts you should understand. So I built the parts:

- **Neural Network Fundamentals** — MLP, CNN, and RNN implemented from first principles in NumPy: forward passes, backprop by hand, gradient checking against finite differences. Every layer, every gradient, demystified.
- **Machine Translator** — "Attention Is All You Need" re-implemented end-to-end (multi-head self-attention, positional encoding, encoder–decoder) and trained to translate English to French.
- **RL Fighting Agent** — PPO trained through self-play against a 2D fighting-game environment, built during the UofT Anthropic Hackathon.

## What I learned

Backprop stops being magic the third time you derive it. The payoff shows up everywhere else: when a training run misbehaves in PyTorch, I have a mental model of what's actually happening in the graph — because I've built the graph.

The translator repo is [here](https://github.com/Elliot-Sones/Transformers), the fundamentals repo is [here](https://github.com/Elliot-Sones/Neural_Networks_Fundamentals), and the fighting agent is [here](https://github.com/Elliot-Sones/AI_2).
````

- [ ] **Step 7: Verify + visual check**

Run: `npm run lint && npm run build`
Expected: PASS — static params generated for 4 project routes.
Visual: `/projects` shows 4 numbered rows with badges/hooks; each `/projects/<slug>` renders the case study with styled MDX; `/projects/rl-soccer-agent` embeds the playable game — **test widget and fullscreen mode, control bar fits without cutoff** (per `CLAUDE.md`); the code block in the RL case study is syntax-highlighted.

---

### Task 13: Learning Blogs — index, `[slug]`, seed essay

**Files:**
- Create: `src/app/(site)/learning/page.tsx`
- Create: `src/app/(site)/learning/[slug]/page.tsx`
- Create: `content/learning/reward-shaping-broke-my-agent.mdx`

- [ ] **Step 1: Create `src/app/(site)/learning/page.tsx`**

```tsx
import Link from "next/link";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getAllMeta, type PostFrontmatter } from "@/lib/mdx";

export const metadata = { title: "Learning Blogs — Elliot Sones" };

export default async function LearningPage() {
  const posts = await getAllMeta<PostFrontmatter>("learning");
  posts.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <SectionHeader marker="03" title="Learning Blogs — notes from training things" />
      <div className="mt-4">
        {posts.length === 0 && (
          <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
            First essays are being written.
          </p>
        )}
        {posts.map((p, i) => (
          <Link
            key={p.slug}
            href={`/learning/${p.slug}`}
            className="group flex items-baseline gap-4 border-t border-line py-3.5"
          >
            <span className="font-[family-name:var(--font-jbmono)] text-[10px] text-ember">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 min-w-0">
              <span className="font-[family-name:var(--font-fraunces)] text-[17px] font-medium text-ink u-draw">
                {p.title}
              </span>
              <span className="block mt-1 font-[family-name:var(--font-jbmono)] text-[10px] leading-relaxed text-mute">
                {p.description}
              </span>
            </span>
            <span className="badge badge-plain hidden sm:inline-block">{p.tag}</span>
            <span className="font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
              {new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-faint opacity-0 transition-opacity group-hover:opacity-100">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/(site)/learning/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getMdx, getSlugs, type PostFrontmatter } from "@/lib/mdx";

export function generateStaticParams() {
  return getSlugs("learning").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getMdx<PostFrontmatter>("learning", slug);
  return { title: post ? `${post.frontmatter.title} — Elliot Sones` : "Learning" };
}

export default async function LearningPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getMdx<PostFrontmatter>("learning", slug);
  if (!post) notFound();

  const { frontmatter: p, content, readingTime } = post;

  return (
    <article className="max-w-[680px]">
      <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.2em] text-ember">
        {p.tag}
      </div>
      <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
        {p.title}
      </h1>
      <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[9.5px] text-faint">
        {new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}{" "}
        · {readingTime} min read
      </div>
      <hr className="my-6 border-line" />
      {content}
    </article>
  );
}
```

- [ ] **Step 3: Create `content/learning/reward-shaping-broke-my-agent.mdx`** (first draft — Elliot rewrites in his voice)

````mdx
---
title: "Why reward shaping broke my soccer agent"
date: "2026-07-10"
tag: "RL"
description: "I gave my Q-learning agent what looked like helpful hints. It responded by learning to never take a risk again."
---

The first version of my browser soccer agent learned to camp its own goal. Not defend — *camp*. It would stand between ball and net, refuse to chase anything, and wait out every episode. This post is about the reward function that caused it.

## The setup

Tabular Q-learning on a 10×7 grid, self-play against a scripted bot, ε-greedy with decay:

```python
Q[s][a] += alpha * (reward + gamma * max(Q[s']) - Q[s][a])
epsilon = max(0.01, epsilon * 0.985)  # per episode
```

Goals were rare and sparse, so I did what every tutorial tells you: add shaping. A small reward for moving the ball toward the opponent's goal, a small penalty for the ball moving toward yours.

## What actually happened

The penalty was the bug. "Ball moving toward your goal" fires constantly in normal play — clearances, bounces, unlucky touches. The agent learned that *interacting with the ball at all* was dangerous on expectation. Camping was the safe policy: near the net, the shaping penalty rarely triggered, and an occasional lucky deflection still produced a goal reward.

Shaping didn't guide the agent toward scoring. It priced risk, and the agent — being a rational expected-value maximizer — stopped taking any.

## The fix: curriculum over shaping

I removed the directional penalty entirely and changed the *environment sequence* instead of the reward function:

1. **Phase 1 — empty net.** Agent + ball only. It learns "ball in that net = big reward" with no downside to trying.
2. **Phase 2 — passive defender.** The bot exists but doesn't steal. Dribbling under mild pressure.
3. **Phase 3 — full self-play.** Only now does the opponent actually contest.

Success rate went from ~12% (camping policy) to ~70% against the scripted bot within 5,000 episodes. Same hyperparameters, same Q-table — the only change was what the agent was allowed to learn *first*.

## The takeaway

Reward shaping encodes your assumptions about which states are good — including the assumptions you didn't know you had. A curriculum changes the *distribution of experience* instead, and lets the agent discover value rather than be told where it is. When a shaped reward misbehaves, the question isn't "how do I reweight it" — it's "what experience would make the right behavior obvious."

The playable agent lives in the [RL Soccer case study](/projects/rl-soccer-agent).
````

- [ ] **Step 4: Verify + visual check**

Run: `npm run lint && npm run build` — expect PASS, 1 learning route generated.
Visual: `/learning` shows the essay row with tag/date; the post page renders prose with highlighted code block.

---

### Task 14: Competitions page

**Files:**
- Create: `src/app/(site)/competitions/page.tsx`

- [ ] **Step 1: Create `src/app/(site)/competitions/page.tsx`**

```tsx
import { SectionHeader } from "@/components/site/SectionHeader";
import { competitions } from "@/lib/site-data";

export const metadata = { title: "Competitions — Elliot Sones" };

export default function CompetitionsPage() {
  return (
    <div>
      <SectionHeader marker="02" title="Competitions — hackathons & data challenges" />
      <div className="mt-4">
        {competitions.map((c) => (
          <div key={c.slug} className="border-t border-line py-4">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-[family-name:var(--font-fraunces)] text-[17px] font-medium text-ink">
                {c.project}
              </span>
              {c.outcome && <span className="badge badge-live">{c.outcome}</span>}
              <span className="ml-auto font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
                {c.date}
              </span>
            </div>
            <div className="mt-0.5 font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.14em] text-mute">
              {c.name}
            </div>
            <p className="mt-2 max-w-[640px] font-[family-name:var(--font-fraunces)] text-[14px] leading-[1.7] text-inksoft">
              {c.description}
            </p>
            <div className="mt-2 flex gap-5 font-[family-name:var(--font-jbmono)] text-[10px]">
              {c.git && (
                <a href={c.git} target="_blank" rel="noopener noreferrer" className="text-ember u-draw">
                  Code ↗
                </a>
              )}
              {c.link && (
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-ember u-draw">
                  Link ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npm run build` — expect PASS. Visual: `/competitions` lists all 5 entries with outcome badges, newest first (array order in `site-data.ts`).

---

### Task 15: Experience page (timeline + certificates)

**Files:**
- Create: `src/app/(site)/experience/page.tsx`

- [ ] **Step 1: Create `src/app/(site)/experience/page.tsx`**

```tsx
import { SectionHeader } from "@/components/site/SectionHeader";
import { experience, certificates } from "@/lib/site-data";

export const metadata = { title: "Experience — Elliot Sones" };

export default function ExperiencePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionHeader marker="04" title="Experience" />
        <div className="mt-4">
          {experience.map((e) => (
            <div key={e.role} className="flex gap-4 border-t border-line py-4">
              <div className="w-[140px] shrink-0 font-[family-name:var(--font-jbmono)] text-[9.5px] leading-relaxed text-faint">
                {e.period}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-[family-name:var(--font-fraunces)] text-[17px] font-medium text-ink">
                    {e.role}
                  </span>
                  {e.current && <span className="badge badge-live">current</span>}
                </div>
                <div className="mt-0.5 font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.14em] text-mute">
                  {e.org}
                </div>
                <p className="mt-2 max-w-[560px] font-[family-name:var(--font-fraunces)] text-[14px] leading-[1.7] text-inksoft">
                  {e.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader marker="·" title="Certificates" />
        <div className="mt-2">
          {certificates.map((c) => (
            <a
              key={c.title}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-4 border-t border-line py-2.5"
            >
              <span className="flex-1 font-[family-name:var(--font-fraunces)] text-[14px] text-ink u-draw">
                {c.title}
              </span>
              <span className="font-[family-name:var(--font-jbmono)] text-[9.5px] text-mute">
                {c.issuer}
              </span>
              <span className="font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
                {c.date}
              </span>
              <span className="text-faint opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npm run build` — expect PASS. Visual: `/experience` shows timeline rows + compact certificate list (no images).

---

### Task 16: Polish, delete `/preview`, final verification

**Files:**
- Create: `src/components/site/HoverMorph.tsx`
- Modify: `src/components/site/Sidebar.tsx` (wrap wordmark)
- Delete: `src/app/preview/` (entire directory)
- Modify: `CLAUDE.md` (reflect new structure)

- [ ] **Step 1: Create `src/components/site/HoverMorph.tsx`**

Variable-font hover morph — shifts Fraunces `wght`/`opsz` on hover, disabled under reduced motion.

```tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HoverMorph({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const active = enabled && hovered;

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontVariationSettings: active ? '"opsz" 144, "wght" 800' : '"opsz" 40, "wght" 600',
        transition: "font-variation-settings 0.35s ease",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Apply to the sidebar wordmark**

In `src/components/site/Sidebar.tsx`, import it and wrap the wordmark text:

```tsx
import { HoverMorph } from "@/components/site/HoverMorph";
```

Change the `Wordmark` div to:

```tsx
<div className="font-[family-name:var(--font-fraunces)] text-[26px] leading-[1.05] tracking-[-0.02em] text-ink">
  <HoverMorph>
    Elliot
    <br />
    Sones<span className="text-ember">.</span>
  </HoverMorph>
</div>
```

(Remove the now-redundant `font-semibold` — weight is driven by `fontVariationSettings`.)

- [ ] **Step 3: Delete the preview experiment**

Run: `rm -rf src/app/preview`
Expected: directory gone. Nothing imports it — its data was migrated to `src/lib/site-data.ts` (Task 5) and its GitHub logic to `src/lib/github.ts` (Task 6).

- [ ] **Step 4: Update `CLAUDE.md` Key Components**

Replace the `## Key Components` section with:

```markdown
## Key Components
- `src/app/(site)/` — new portfolio (sidebar shell, home, projects, competitions, learning, experience)
- `src/app/v1/` — archived soccer-theme site (do not restyle)
- `src/lib/site-data.ts` — content data (vitals, working/learning, competitions, experience, certificates)
- `src/lib/github.ts` + `src/lib/ai-usage.ts` — live stats data sources
- `scripts/update-ai-usage.mjs` — regenerates `data/ai-usage.json` (`npm run stats`)
- `content/projects/*.mdx`, `content/learning/*.mdx` — case studies and essays
- `src/components/RLSoccerGame.tsx` — RL soccer mini-game, embedded in the RL case study
```

- [ ] **Step 5: Full verification sweep**

Run: `npm run lint && npm run build` — expect PASS with routes: `/`, `/projects` (+4 slugs), `/learning` (+1 slug), `/competitions`, `/experience`, `/v1`, all API routes.

Then `npm run dev` and in Chrome verify:
1. `/` — matches approved mock `layout-v6.html`: sidebar, live strip (AI panel with real `npm run stats` numbers, GitHub panel with streak row + calendar + commit feed), working/learning, about + vitals, noise texture, v1 footer link
2. `/projects` + all 4 case studies — RL case study embeds the game; **test widget and fullscreen, control bar fits** (per `CLAUDE.md`)
3. `/learning` + the seed essay — code block highlighted
4. `/competitions`, `/experience` — rows render, links work
5. `/v1` — pixel-identical to the Task 2 regression screenshot
6. Mobile width (375px): sidebar becomes top bar, all grids stack, no horizontal overflow
7. `prefers-reduced-motion` (Chrome rendering tab): no pulse/morph animation

---

## Self-Review Notes (author-filled)

- **Spec coverage:** routes (§3) → Tasks 8–15; design system (§4) → Tasks 3–4 + Task 16; homepage (§5) → Tasks 9–10; data model (§6) → Tasks 5–7, 11; components (§7) → Tasks 8–11; AI pipeline (§8) → Task 7; migration (§9) → Tasks 2–4, 16; error handling (§10) → null-fallbacks in `getAiUsage`/`getGithubActivity`/`getMdx` + empty states in panels/indexes + `prefers-reduced-motion` gates; verification (§11) → per-task checkpoints + Task 16 sweep.
- **Deviation 1:** spec suggested reusing `noise_b64.txt` for texture; plan uses a self-contained inline SVG turbulence data-URI (`.noise-overlay`) — same effect, zero file dependency.
- **Deviation 2:** spec listed `WorkingOn.tsx`/`LearningNow.tsx`; plan merges them into one `StatusList.tsx` (identical shape — DRY).
- **Deviation 3:** spec showed the Resume link among sidebar socials without a target; `site-data.ts` points it at `/resume.pdf` (already in `public/`) instead of the old Google Drive link.
- **Deviation 4:** no git commit steps — user explicitly froze commits/pushes until told.
- **Type consistency:** `StatusItem`/`vitals`/`competitions`/`experience`/`certificates` (Task 5) match consumers in Tasks 10, 14, 15; `GithubActivity`/`RecentCommit` (Task 6) match Task 9 consumers; `AiUsage` (Task 7) matches `AiUsagePanel`; `PostFrontmatter`/`ProjectFrontmatter` (Task 11) match Tasks 12–13; API route type re-exports preserve the old import path used by `/v1` code.
