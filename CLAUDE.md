# Personal Portfolio

## Stack
- Next.js (App Router), React, TypeScript, Tailwind CSS
- Deployed on Vercel

## Design language (v2 site)
- Warm Paper editorial system: paper/ink/ember tokens in `globals.css` `@theme`; Fraunces (display + serif body) and JetBrains Mono (labels/metadata only, never paragraphs)
- Shared primitives in `globals.css`: `.display-hed` (Fraunces opsz 144 + WONK, italic `em` renders ember), `.page-hed`, `.prose-serif`, `.stat-num`, `.site-h`, `.sleeve` (ink frame for dark third-party embeds), `.reveal` (staggered load, reduced-motion safe)
- No index numbering anywhere (nav, section headers, list rows) — Elliot removed it deliberately; don't reintroduce
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
- `src/lib/ml-from-scratch.ts` + `src/app/(series)/learning/ml-from-scratch/` — "Machine Learning, from scratch" blog series. Own route group with its own book-style layout (no site sidebar; series sidebar lists Overview + models, wordmark links back to site). Write-ups in `content/ml-from-scratch/*.mdx`, images in `public/ml-from-scratch/`, live HF demo embeds. Blog-style: no quickstarts or file trees in posts.
- `src/components/RLSoccerGame.tsx` — RL soccer mini-game, embedded in the RL case study
