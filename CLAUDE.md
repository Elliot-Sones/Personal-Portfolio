# Personal Portfolio

## Stack
- Next.js (App Router), React, TypeScript, Tailwind CSS
- Deployed on Vercel

## Design language (v2 site)
- Warm Paper editorial system: paper/ink/ember tokens in `globals.css` `@theme`; Fraunces (display + serif body) and JetBrains Mono (labels/metadata only, never paragraphs)
- Shared primitives in `globals.css`: `.display-hed` (Fraunces opsz 144 + WONK, italic `em` renders ember), `.page-hed`, `.prose-serif`, `.stat-num`, `.index-num`, `.site-h` (numbered via `marker` prop on SectionHeader), `.sleeve` (ink frame for dark third-party embeds), `.reveal` (staggered load, reduced-motion safe)
- GitHub heatmap uses the ember `gh0-gh4` ramp; streak stats are computed locally in `src/lib/github.ts` — do not reintroduce the dark streak-stats.demolab.com image
- No em dashes in site copy; use commas, colons, or "·"

## Testing
- Always use Chrome browser tools to visually verify UI changes before marking done
- For the RL Soccer game (`src/components/RLSoccerGame.tsx`), test both widget mode and fullscreen mode
- Control bar elements must fit without cutoff in both modes

## Key Components
- `src/app/(site)/` — new portfolio (sidebar shell, home, projects, competitions, learning, experience)
- `src/app/v1/` — archived soccer-theme site (do not restyle)
- `src/lib/site-data.ts` — content data (vitals, working/learning, competitions, experience, certificates)
- `src/lib/github.ts` + `src/lib/ai-usage.ts` — live stats data sources
- `scripts/update-ai-usage.mjs` — regenerates `data/ai-usage.json` (`npm run stats`)
- `content/projects/*.mdx`, `content/learning/*.mdx` — case studies and essays
- `src/components/RLSoccerGame.tsx` — RL soccer mini-game, embedded in the RL case study
