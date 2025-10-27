## Elliot — Personal Portfolio
Welcome to my personal portfolio. In this project, I built a Next.js Tailwind CSS website to demonstrate all my projects in one place. Hope you enjoy!

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Framer Motion for motion design
- Vercel for hosting (recommended)

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the site. ESLint is configured—run `npm run lint` before committing.

## Customising your content

Edit `src/app/page.tsx` to update:

- Hero copy, stats, and call-to-action links (search for `highlights`, `projects`, and `focuses` arrays).
- Social profiles inside the `socials` array.
- Contact CTA email (`mailto:hello@elliotadu.com`) and footer text.

Typeface settings and the soccer field background live in:

- `src/app/layout.tsx` — metadata, font imports (`Geist`, `Bebas Neue`).
- `src/app/globals.css` — colour tokens, pitch pattern, and utilities.

### Custom cursor

Removed. The site now uses the default system cursor. The previous Rive-based implementation and assets were deleted.

### Contact form

The contact form points to Formspree by default. Create a free Formspree form and replace the placeholder action URL in `src/app/page.tsx`:

```tsx
<form action="https://formspree.io/f/yourFormId" method="POST">
```

Formspree will return a unique ID like `https://formspree.io/f/abcdwxyz`.

## Deploying to Vercel

1. Commit your changes and push to GitHub.
2. In Vercel, create a **New Project** and import the repository.
3. Use the default settings:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add environment variables if you integrate external services (none required now).
5. Deploy. Vercel will also generate preview URLs for future pull requests.

### Post-deploy checklist

- Set up a custom domain (e.g., `elliotadu.dev`) in the Vercel dashboard.
- Enable Vercel Analytics or hook up a privacy-friendly alternative if you want traffic insights.
- Run `npm run build` locally before pushing major changes to catch issues early.

## Next steps

- Swap placeholder project links for live URLs or case-study pages.
- Add an `/api/contact` route if you prefer handling form submissions yourself.
- Drop in Open Graph imagery under `public/` and update `next.config.ts` metadata.
