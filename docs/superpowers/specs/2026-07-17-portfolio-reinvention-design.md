# Portfolio Reinvention — Design Spec

**Date:** 2026-07-17
**Status:** Approved (brainstorming complete, pending implementation plan)
**Visual mockups:** `.superpowers/brainstorm/49583-1784301562/content/` (`layout-v6.html` is the approved homepage)

---

## 1. Goal & Audience

Rebuild the personal portfolio (elliotsones.com) from scratch with a new concept.
The current soccer/anime-themed single page moves to `/v1`; the `/preview`
desktop-OS experiment is deleted and absorbed.

**Primary audience:** hiring managers and recruiters for **ML/AI engineering roles**.
A visitor should walk away thinking: *this person builds and explains intelligent
systems, ships constantly, and is worth an interview.*

**Secondary goals:** the site itself demonstrates front-end craft; writing and live
data make it feel alive rather than templated.

## 2. Key Decisions (locked during brainstorming)

| Decision | Choice |
|---|---|
| Scope | Fresh start — neither current soccer theme nor `/preview` desktop-OS is sacred |
| Theme | Soccer/anime **stripped** from the design; personality comes through writing voice and easter eggs |
| Content strategy | **Both** a writing section (essays) and deep project case studies |
| Case studies (4) | RL soccer agent (playable embed), SPLxUTSPAN free-throw prediction, CoCivil, from-scratch ML builds (one case study covering Neural Network Fundamentals + the Attention-is-all-you-need translator; the RL fighting agent is referenced there and in Competitions) |
| Visual direction | Light "warm paper" theme, sidebar layout — approved mock `layout-v6.html` |
| Build approach | New site built alongside, then swapped to root; old site archived at `/v1`; `/preview` deleted |
| Writing format | MDX (`@next/mdx`) so case studies embed live interactive demos |
| Signature move | Live data panels (AI usage + GitHub) + typographic craft. **One move, done well — nothing else** |

## 3. Site Map & Routes

All new pages live in a route group `app/(site)/` behind one sidebar shell.

| Route | Content |
|---|---|
| `/` | Home: live stats strip → working on / learning → about + vitals (Section 5) |
| `/projects` | Index of the 4 case studies: numbered rows, title, one-line hook, badges, year |
| `/projects/[slug]` | MDX case study: problem → approach → engineering deep-dive → embedded interactive demo → results → links. RL soccer embeds the playable game mid-page |
| `/competitions` | Hackathon record as a timeline table: SPLxUTSPAN 2026 (1st), Hack Canada 2026 (Google Studio AI), MUES 2025 (1st), Pond 2025 (20k votes), UofT Anthropic 2025. Outcomes front and center |
| `/learning` | Essay index: title, date, reading time, tag |
| `/learning/[slug]` | MDX post with code highlighting |
| `/experience` | Work timeline (NTangible ML research intern, TMU CS) + certificates as a compact sub-list (issuer, year, link — **no image gallery**) |
| `/v1` | Current soccer site, moved untouched. Tiny "v1" footer link as an easter egg |

**Sidebar (all pages):** wordmark, role line, numbered nav (01 Projects ·
02 Competitions · 03 Learning Blogs · 04 Experience), socials (GitHub, LinkedIn,
Resume, Email — Resume included because recruiters are the primary audience),
location footer (Toronto · TMU '26). Active route highlighted. On mobile it
collapses to a slim top bar.

**API routes:** all existing routes stay. `/api/github-activity` powers the GitHub
panel (already computes total contributions, current/longest streaks with dates,
and the full contribution calendar). `/api/streak-stats`, `/api/pinned-repos`,
`/api/readme` continue to serve `/v1`.

## 4. Design System

### Typography (two fonts only)
- **Fraunces** (variable serif) — headings, big numbers, essay body, wordmark
- **JetBrains Mono** — nav, labels, metadata, badges, stat captions
- Both via `next/font/google`. `/v1` keeps its existing font variables untouched.

### Palette (light "warm paper", light theme only)
| Token | Value | Use |
|---|---|---|
| `--paper` | `#f8f4eb` | page background |
| `--paper-raised` | `#fffdf7` | cards/panels |
| `--paper-sunken` | `#f0ead9` | sidebar |
| `--ink` | `#1c1a15` | primary text |
| `--ink-soft` | `#4a463c` | body text |
| `--muted` | `#8a8375` | labels/captions |
| `--faint` | `#a39b88` | timestamps |
| `--line` | `#e2dac5` | hairlines |
| `--accent` | `#b3542e` | numbers, links, highlights |
| `--claude` | `#d97757` | Claude series only |
| `--codex` | `#10a37f` | Codex series only |
| GitHub greens | `#aae6b8` `#6ccb7f` `#3da85c` `#267a41` (empty `#ece5d2`) | contribution calendar only |
| `--live` | `#3d9970` | live dot |

Brand colors appear only where they carry meaning (AI usage split, GitHub calendar).

### Texture
Subtle noise overlay (repo already has `noise_b64.txt` / `gen_noise.py`) at ~4%
opacity, fixed, `pointer-events: none`.

### Motion (restraint)
Framer Motion for page fade/slide and hover states only. No custom cursor, no
smooth-scroll library, no scroll-jacking, no GSAP. Everything disabled under
`prefers-reduced-motion`.

### Personality layer ("professional but cool")
- Variable-font hover morphs on wordmark + section headings (Fraunces `wght`/`opsz` shift)
- Draw-in underlines on nav/links; row hovers reveal `→` and light up the accent number
- Pulsing `◉ Live` dot in the stats header; honest "updated {date}" timestamps
- Text selection in burnt orange; accent focus rings; custom favicon; OG card
- Voice: specific, first-person, slightly dry ("an unreasonable number of tokens").
  No "passionate full-stack developer" copy anywhere
- Easter eggs: `/v1` footer link; playable game one click from featured-work row

## 5. Homepage Layout (approved mock `layout-v6.html`)

Top to bottom in the main column:

1. **◉ Live strip** — two panels side by side:
   - **AI pair-programming**: monthly token total (big serif number), Claude-vs-Codex
     share bar (coral/green) with token + session counts, 14-day stacked daily bars
     (Claude + Codex segments), caption row
   - **GitHub — Elliot-Sones**: streak record row (total contributions · current
     streak highlighted with date range · longest streak with date range), 7×26
     contribution calendar (green squares), latest-commits feed (message · repo · time)
2. **01 What I'm working on** — rows: title, one-line description, status badge
   (training / shipping / iterating)
3. **02 What I'm learning** — rows: title, one-line description, type tag
   (papers / course / reading)
4. **03 About** — intro paragraphs in Elliot's real voice (TMU CS, agents, learning
   in public; soccer/Portugal/music/anime line) + vitals card (Position, Club,
   Focus, Stack, Languages)

## 6. Data & Content Model

- `content/learning/*.mdx` — essays. Frontmatter: `title`, `date`, `tag`, `description`
- `content/projects/*.mdx` — case studies. Frontmatter adds `year`, `badges`, `tech`, `repo`, `demo`, `order`
- `src/lib/data.ts` — structured data: vitals, socials, working-on items, learning
  items, competitions, experience, certificates (migrated/trimmed from
  `src/app/preview/_lib/data.ts`)
- `data/ai-usage.json` — committed snapshot from the stats script (Section 8)
- GitHub panel data: existing `/api/github-activity` (5-min revalidate)

**MDX setup:** `@next/mdx` + `remark-gfm` (already in deps) + `rehype-pretty-code`
(new dep — Shiki-based code highlighting). MDX pages can import and render React
components (the RL game embed).

## 7. Component Architecture

`src/components/site/` (all server components unless noted):
- `Sidebar.tsx` (client — active route via `usePathname`), `SectionHeader.tsx`
- `AiUsagePanel.tsx`, `DayBars.tsx` (reads `data/ai-usage.json`)
- `GitHubPanel.tsx`, `StreakRow.tsx`, `ContributionCalendar.tsx`, `CommitFeed.tsx`
- `WorkingOn.tsx`, `LearningNow.tsx`, `AboutVitals.tsx`
- `Mdx.tsx` renderer + MDX components (prose wrapper, code blocks, `RLDemo` embed)
- `HoverMorph.tsx` (client — variable-font hover effect)

`src/components/RLSoccerGame.tsx` is reused untouched, embedded via a neutral frame.
Old themed components (`PixelDecorations`, `RainOverlay`, `FilmOverlay`, etc.)
serve `/v1` only.

## 8. AI Usage Pipeline

- `scripts/update-ai-usage.mjs` — parses Claude Code session logs
  (`~/.claude/projects/**/*.jsonl`) and Codex logs (`~/.codex/sessions/**/*.jsonl`)
- Computes per tool: current-month tokens, session count, last-14-days daily token
  series. Writes `data/ai-usage.json` including a `generatedAt` timestamp
- Run via `npm run stats` (or `bun run stats`) — a package.json script; commit the
  JSON. No external service; fully static-render compatible
- Panel shows "updated {date}" so staleness is honest

## 9. Migration Plan

1. Move `src/app/page.tsx` → `src/app/v1/page.tsx` (old site preserved, still using
   its existing components/API routes)
2. Delete `src/app/preview/` — data migrates to `src/lib/data.ts`; its GitHub fetch
   logic is the basis for the new panels; desktop-OS chrome is discarded
3. `globals.css`: existing theme stays for `/v1`; new tokens added alongside via
   Tailwind v4 CSS-first config (`@theme`). The two never mix
4. Root layout: load Fraunces + JetBrains Mono (new site) alongside the font
   variables `/v1` already uses
5. New `app/(site)/` group takes over `/`
6. New metadata: title, description, OG card

## 10. Error Handling

- GitHub API down / rate-limited / missing `GITHUB_TOKEN` → GitHub panel renders a
  quiet "unavailable" state; page otherwise unaffected
- `data/ai-usage.json` missing (fresh clone) → AI panel renders a neutral
  placeholder; build never fails from missing stats
- No MDX posts yet → index pages render an honest empty state
- All animation gated behind `prefers-reduced-motion`

## 11. Testing & Verification

- `npm run lint` clean; `npm run build` passing
- Chrome visual verification (per `CLAUDE.md`) of every new page at desktop and
  mobile widths — including the embedded RL game in both widget and fullscreen mode,
  with control-bar elements fitting without cutoff
- Regression check: `/v1` renders exactly as before
- One real run of the stats script; validate JSON shape against the panel's reader
- No new test framework (repo has none — YAGNI)

## 12. Out of Scope (explicitly not building)

- Dark mode (light-only this pass)
- Custom cursor, Lenis/smooth scroll, GSAP, WebGL/R3F shaders
- Blog comments, search, tags pages, RSS (revisit once real posts exist)
- Certificates image gallery (compact list instead)
- Any new backend/service for stats (local script + committed JSON only)

## 13. References

- Research: `research/01-portfolio-inspiration-sources.md`, `research/02-portfolio-design-principles.md`
- Approved mock: `.superpowers/brainstorm/49583-1784301562/content/layout-v6.html`
- Existing GitHub data route: `src/app/api/github-activity/route.ts`
- Content inventory to migrate: `src/app/preview/_lib/data.ts`
