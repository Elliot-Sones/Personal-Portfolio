# Portfolio Design Principles & Techniques

## Research Question

What separates a genuinely impressive developer portfolio from a generic "AI slop" one in 2025-2026? Specifically, what design principles, technical techniques, and editorial choices do standout creative devs and designers-who-code use — and which of those are realistically implementable on a Next.js 15 / React 19 / Tailwind v4 / Framer Motion / Rive stack for a CS student + ML engineer trying to look distinctive rather than templated?

## Design Principles (typography, layout, color, motion)

### Typography — the single fastest way to stop looking AI-generated

The "AI slop" tell is Inter + Roboto + generic sans-serif at every weight. Every template and LLM output defaults to these because they dominate the training data (925 Studios; BSWEN). The way out is a **two-font system with distinct voice**:

- **Editorial serifs** are the dominant 2026 trend — "New Editorial" blends modern flair with classic proportions. Think: PP Editorial New, GT Super, Canela, Fraunces. Pair with a utility sans or mono. (Typewolf; Creative Boom 2026 fonts).
- **Expressive display + mono combo** is the creative-dev signature: a loud display face for names/headings (often a variable font) + a monospace for labels, metadata, code fragments (JetBrains Mono, Berkeley Mono, Commit Mono, IBM Plex Mono). Mono reinforces the "engineered" feel brutalist/neubrutalist portfolios lean on.
- **Typewolf's top-40** list is dominated by indie-foundry grotesks: Apercu, Basis Grotesque, Graphik, GT America, GT Sectra. These read as intentional; free Google sans-serifs read as default.
- **Variable-font tricks**: animate `font-variation-settings` on hover, scroll, or cursor proximity. Cheap to ship, looks premium.

### Layout — asymmetry, density, and a point of view

- **Single-scroll narrative** beats multi-page portfolio-as-index for devs. Brittany Chiang's entire career is one scrollable page; the constraint forces editing. Comeau agrees: "a highlight reel... 2 to 5 projects," not an archive.
- **Editorial / magazine grids** — asymmetric column counts, intentional ragged right, pull-quotes, captions in a different typeface/weight. This is what separates "designer site" from "bootcamp template."
- **Terminal/IDE aesthetic** — monospace everything, bracketed labels `[01]`, file-tree navs, line numbers in the gutter. Works especially well for ML/systems folks but is getting crowded; combine with something unexpected.
- **Dense info over big empty hero** — the 2025-2026 shift is away from "huge headline + one CTA + 3 floating blobs." Expressive minimalism packs information with hierarchy rather than negative space with no substance (itsnicethat; Adobe 2026 trends).
- **Anchor-and-slide sections** — large fixed type anchors stay put while visuals slide beneath (Framer "Archar" pattern). Good for case studies.

### Color — restraint + one signal move

- Kill the purple → blue → cyan default. Stripe's semantic palette approach (functional tokens like `--color-action-primary`) is the professional counter-move.
- **Monochrome + one accent** (near-black on off-white with a single saturated color) is a resilient foundation.
- **Texture is the 2026 differentiator** — subtle noise/grain, canvas paper overlays, linen backgrounds. Bridges print feel into digital, kills the "flat AI gradient" look (Envato; itsnicethat). A static PNG noise layer at 3-5% opacity is enough.
- **Dark mode as first-class** rather than afterthought — Brittany Chiang's navy/slate is one reason her site still reads as handcrafted a decade in.

### Motion — purposeful, not decorative

- **Micro-interactions > page-load reveals**: hover states that deform text, cursor-reactive components, link underlines that draw in, button states that respond to velocity.
- **Respect `prefers-reduced-motion`** — Cassie Evans consistently emphasizes "animating responsibly." Leaving it out is an accessibility tell.
- **Easing and timing are the craft**, not the effect itself. Generic fade-ins with linear/ease-in-out scream template. Custom cubic-beziers, spring physics, and overshoot are what read as "someone thought about this."
- **Scroll as narrative device, not scrubber gimmick**. The best scroll-driven sites (Lando Norris, Bruno Simon, Codrops WebGL portfolio case studies) use scroll to reveal story beats; the worst hijack it to slow the user down.

## Technical Techniques (with libraries / tools)

Ordered roughly by ROI for this stack. Everything listed is maintained and 2025-current.

### Tier 1 — high impact, low-to-medium effort, fits the existing stack

- **Lenis smooth scroll** (`@studio-freight/lenis`, now `darkroomengineering/lenis`). Replaces native jumpy scroll with physics-based smoothness. Integrates cleanly with Framer Motion's `useScroll` and with GSAP ScrollTrigger via `scrollerProxy` + ticker sync. It's *the* base layer every Awwwards-tier portfolio ships in 2025. (zuncreative; GSAP forums)
- **Framer Motion scroll + view transitions**. Already in the stack. `useScroll`, `useTransform`, `useMotionValueEvent`, and layout animations cover 80% of scroll storytelling needs without GSAP. React 19's native View Transitions API adds crossfade routing for free.
- **Rive interactive components**. Already in the stack. Best ROI: a hero illustration that reacts to cursor position via state machines, or a loading/empty state that feels bespoke. Single `.riv` file, tiny runtime.
- **SplitType / SplitText** (or `@motionone/splittext`). Per-character and per-word text animations — stagger reveals, hover deformations, scroll-linked reveals. GSAP's SplitText is now free as of 2025; the CSS-Tricks-era Splitting.js still works. Pair with Framer Motion for a Tailwind-friendly setup.
- **Custom cursor** — a `div` following the mouse with spring physics, scale/color changes on hover over interactive elements. ~30 lines with Framer Motion. Disable on touch devices. Single biggest "this person cares" signal.
- **Noise / grain overlay** — one fixed SVG `feTurbulence` filter or a tiled PNG at 3-5% opacity. Kills the "AI gradient flatness" instantly.
- **Variable-font hover/scroll morphs** — animate `font-weight` or optical-size axes via CSS custom properties driven by Framer Motion values.

### Tier 2 — higher impact, higher effort, signature moves

- **React Three Fiber + drei + a shader or two**. Codrops is full of 2025 R3F examples: subtle shader backgrounds, wavy infinite carousels, MeshPortal (scene-in-a-bounded-area) technique, velocity-based stretch shaders on text. The key lesson from the Codrops WebGL portfolio case study: *synchronize WebGL with DOM bounds using normalized viewport coordinates* so 3D content lives inside your layout instead of fighting it.
- **GLSL hover effects** — displacement maps on project thumbnails, RGB split on hover, ripple-on-click. Maxime Heckel's "Study of Shaders with R3F" is the canonical primer. These are the effects that win Awwwards.
- **GSAP ScrollTrigger for cinematic sequences** where Framer Motion's scroll API gets awkward — pinning, complex timelines, MorphSVG paths. GSAP core + ScrollTrigger + SplitText all went free in 2025.
- **MDX case-study pages** — turn each project into a long-form writeup with interactive demos embedded (Comeau's "tour guide" principle). This is what separates dev portfolios from designer portfolios: engineers can *make the thing live inside the case study*. The custom RL soccer widget you already have is exactly this pattern; do it twice more.

### Tier 3 — avoid unless it serves a specific idea

- Bruno-Simon-style full-3D explorable worlds (months of work, rarely read as "hireable" for eng roles).
- Heavy Lottie for everything (file size, and generic after-effects output now reads as stock).
- Locomotive Scroll (legacy, Lenis replaced it).
- Three.js without React Three Fiber (extra friction in a React app).

## Anti-Patterns to Avoid ("AI slop")

These are the patterns that make a portfolio read as generated-in-five-minutes (925 Studios 2026 AI-slop guide; BSWEN anti-patterns; Nielsen Norman on glassmorphism):

1. **Inter + purple-to-blue gradient + glass card + cyan accent**. The quadruple default. Any one of these is fine; all four together is a tell.
2. **Abstract 3D blobs, spheres, or "floating orbs"**. Stock AI imagery. Replace with actual project screenshots, real photos, or custom illustrations.
3. **Uniform 16px border-radius + 24px padding on every card**. Flat hierarchy. Vary radius and spacing intentionally.
4. **Glassmorphism as the whole design, not an accent**. NN/g: restraint is the whole game; background needs complexity/color for frosted glass to mean anything.
5. **Generic hero copy**: "Build the future of work," "Crafting digital experiences," "Passionate full-stack developer." Be specific — "ML engineer at TMU shipping [specific thing]" beats 10 adjectives.
6. **Card grids of 8 projects with identical thumbnail + title + stack tags**. This is a bootcamp template. Comeau: 2-5 projects, deep writeups, not an index.
7. **Fade-in-on-scroll everywhere, same duration, same easing**. A generic CMS animation. Vary direction, stagger, and easing to serve content.
8. **Tech-logo soup** — 30 colored SVG logos of every tool you've touched. Replaced by one well-written "what I reach for and why" paragraph.
9. **Glass navbar, gradient hero, 3D blob, testimonial carousel, CTA footer**. The SaaS landing page structure applied to a personal site. Resist.
10. **Dark mode that's just `background: #0a0a0a`**. Real dark themes have considered neutrals, accent tuning for legibility, and texture.

## Voices Worth Following (creative devs / designers who code)

- **Josh Comeau** ([joshwcomeau.com](https://www.joshwcomeau.com/)) — "Building an Effective Dev Portfolio" (free PDF). Core principles: highlight reel not archive, tour-guide mentality, deep case studies, 2-5 projects, interactive demos as proof-of-work.
- **Brittany Chiang** ([brittanychiang.com](https://brittanychiang.com/), v4 is open source) — canonical "serious engineer one-page" template. Dark palette, editorial density, hover micro-interactions, zero gimmicks. Still imitated six years later.
- **Cassie Evans** ([cassie.codes](https://www.cassie.codes/)) — GSAP core team. Authority on SVG animation, motion paths, clip-path, responsible motion. Her "constraints help creativity" framing is the right mental model.
- **Maxime Heckel** ([blog.maximeheckel.com](https://blog.maximeheckel.com/)) — shaders + R3F tutorials, aimed at React devs. "The Study of Shaders with React Three Fiber" is the right entry point.
- **Codrops** ([tympanus.net/codrops](https://tympanus.net/codrops/)) — ongoing 2025 case studies of WebGL portfolios; highest signal-to-noise for "what's actually shipping on Awwwards."
- **Awwwards Developer Awards** and **Typewolf portfolio sites** — inspiration curated by people who look at sites all day, not algorithmic listicles.
- **Lee Robinson** ([leerobinson.com](https://leerobinson.com/)) — Vercel. Case study for "engineer-first, low-decoration, content-dense" portfolio; opposite end of the spectrum from Bruno Simon and still works.
- **Bruno Simon** ([bruno-simon.com](https://bruno-simon.com/)) — the high end of the explorable-3D genre. Study it, don't clone it.

## Synthesis

**The thesis**: impressive portfolios in 2026 aren't defined by which library they use — they're defined by evidence of a point of view. "AI slop" is the absence of taste decisions. Every template-driven portfolio has the same skeleton; standout portfolios have an unmistakable authorial fingerprint in typography, pacing, and one or two signature technical moves.

**Given your stack (Next 15, React 19, Tailwind v4, Framer Motion, Rive, an existing WebGL-adjacent RL soccer demo), the highest-ROI path is**:

1. **Fix the typography first.** Pick a two-font system that isn't Inter — an editorial serif or expressive display + a mono. This alone moves you out of AI-slop territory before any other change.
2. **Add a noise/grain layer and a considered accent color** to kill visual flatness. One afternoon.
3. **Add Lenis + a custom cursor.** Base layer of "premium feel." One afternoon each.
4. **Go deep on one project per case study** (MDX page, embedded interactive demo, real writeup of the engineering problem). The RL soccer widget is already an example — do the same for CoCivil and SPLxUTSPAN. This is Comeau's tour-guide principle and it's what employers actually read.
5. **One signature technical move, not five.** Pick ONE of: an R3F shader hero (Codrops-style), a Rive-driven interactive mascot/illustration, or a GSAP ScrollTrigger cinematic project reveal. Ship it polished. Stop.
6. **Edit ruthlessly.** 2-5 projects total. Kill the tech-logo grid. Kill generic taglines. Write specific sentences.

**The trap to avoid**: adding more libraries to feel more impressive. Bruno Simon's site works because one person committed to one idea for months. A half-built Three.js world plus glassmorphism plus a terminal widget plus a cursor trail reads as busier, not better. Constraint is the signal.

**Concrete next step**: before writing any code, pick a typographic system and a single signature effect, and write them down. Everything else is execution against those two decisions.

### Sources

- [Josh Comeau — Building an Effective Dev Portfolio](https://www.joshwcomeau.com/effective-portfolio/)
- [Typewolf — Top 40 Designer Portfolio Sites 2026](https://www.typewolf.com/portfolio-sites)
- [925 Studios — AI Slop Web Design Guide 2026](https://www.925studios.co/blog/ai-slop-web-design-guide)
- [Codrops — Letting the Creative Process Shape a WebGL Portfolio (Nov 2025)](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)
- [Codrops — Creating Wavy Infinite Carousels in R3F with GLSL (Nov 2025)](https://tympanus.net/codrops/2025/11/26/creating-wavy-infinite-carousels-in-react-three-fiber-with-glsl-shaders/)
- [Maxime Heckel — The Study of Shaders with R3F](https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/)
- [Lenis smooth scroll (darkroomengineering)](https://github.com/darkroomengineering/lenis)
- [Cassie Evans — cassie.codes](https://www.cassie.codes/)
- [Brittany Chiang V4 (open source reference)](https://v4.brittanychiang.com/)
- [It's Nice That — Graphic Trends for 2026](https://www.itsnicethat.com/features/forward-thinking-graphic-trends-2026-graphic-design-120126)
- [Creative Boom — 50 Fonts Popular in 2026](https://www.creativeboom.com/resources/top-50-fonts-in-2026/)
- [Adobe Express — Design Trends 2026](https://www.adobe.com/express/learn/blog/design-trends-2026)
- [Nielsen Norman Group — Glassmorphism best practices](https://www.nngroup.com/articles/glassmorphism/)
- [Awwwards Portfolio Winners](https://www.awwwards.com/websites/winner_category_portfolio/)
