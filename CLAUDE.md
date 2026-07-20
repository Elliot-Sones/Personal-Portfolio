# Personal Portfolio

## Stack
- Next.js (App Router), React, TypeScript, Tailwind CSS
- Deployed on Vercel

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
