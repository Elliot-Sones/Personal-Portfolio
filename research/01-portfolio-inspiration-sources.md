# Portfolio Inspiration Sources

## Research Question

Where are the best sources of inspiration for a standout personal developer portfolio,
especially for a CS student / ML engineer whose site (elliotsones.com) currently has a
soccer/anime theme, an RL mini-game, and the usual about/experience/projects/certificates
sections? Specifically:

1. Which gallery/curation sites are actually worth browsing (vs. generic listicles)?
2. Which specific personal portfolios are worth studying right now?
3. Which awards / "best of" programs should be followed for ongoing inspiration?

---

## Gallery & Curation Sites (ranked by usefulness)

Ranked by signal-to-noise for a CS student / ML engineer who already has a Next.js +
Framer Motion + WebGL-ish site and wants taste upgrades, not template dumps.

1. **Awwwards — Sites of the Day / Portfolio winners.** `https://www.awwwards.com/websites/sites_of_the_day/`
   and `https://www.awwwards.com/websites/winner_category_portfolio/`. The single highest-signal
   gallery for bleeding-edge creative dev work. Filter by "Portfolio" or "Developer" tags.
   Bruno Simon's 3D car portfolio was Site of the Month Jan 2026; Corentin Bernadou was SOTD
   March 25, 2026 — both useful peer-level references.
2. **FWA (Favourite Website Awards).** `https://thefwa.com/`. Skews heavier/more agency,
   but FWA of the Day picks tend to be more technically ambitious than Awwwards. Jordan
   Breton's floating-island portfolio won FWA SOTD Oct 2, 2025.
3. **Godly.website.** `https://godly.website/`. Hand-curated, very tight taste, leans into
   typography, motion, and "editorial" personal sites. Smaller volume, higher hit rate than
   Awwwards for pure inspiration.
4. **One Page Love.** `https://onepagelove.com/`. Specifically single-page sites, which is
   exactly the format a personal portfolio wants. Good for structural ideas (how do you fit
   a whole self onto one scroll?).
5. **Land-book.** `https://land-book.com/`. Broader than just portfolios, but the
   "Personal" and "Portfolio" filters are worth skimming monthly.
6. **SiteInspire.** `https://www.siteinspire.com/`. Classic taste index, curated since 2008.
   Use the "Personal" type filter. Less bleeding-edge than Awwwards, more "timeless-looking".
7. **Codrops.** `https://tympanus.net/codrops/`. Not a gallery in the traditional sense —
   it's where creative devs post demo-level tutorials (WebGL shaders, scroll effects,
   GSAP recipes). The best place to learn how the flashy effects on Awwwards winners are
   actually built.
8. **Muzli "100 Best Designer Portfolios of 2026."** `https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/`.
   Technically a listicle, but the Muzli team has good taste and updates yearly; skim once
   rather than subscribe.
9. **Killer Portfolio + designengineer.fyi.** `https://www.killerportfolio.com/` and
   `https://designengineer.fyi/`. Niche curations focused specifically on "design engineer"
   portfolios — the exact sub-genre that matches this user's ambitions.

**Skip or skim lightly:** Dribbble (too much motion-graphic mockup, not real sites),
Behance (same problem), Httpster (sparse updates), Lapa Ninja (generic templates), Hostinger
/ Elementor / Colorlib listicles (SEO listicles, not curation), most "AI-summarizer" Medium
roundups.

---

## Standout Individual Portfolios to Study

All URLs below were verified live in April 2026.

### Creative dev / WebGL / game elements (closest match to the RL soccer game)

- **Bruno Simon — `https://bruno-simon.com/`**
  Three.js driving-game portfolio. You literally drive a car around a 3D world to find
  project tiles. Awwwards Site of the Month Jan 2026. WebGPU support, Rapier physics,
  gamepad input, community "Whisper" messages.
  *Borrow:* The RL soccer game is already this kind of asset — promote it from "widget in
  a section" to "primary navigation metaphor", or at least add the "Behind the Scenes" +
  open-source-on-GitHub transparency move that Bruno uses.

- **Jordan Breton — floating-island 3D portfolio (FWA SOTD Oct 2, 2025).**
  Find via `https://thefwa.com/` search. Scroll-anchored 3D camera fly-through with
  trees/waterfalls/butterflies.
  *Borrow:* the "fixed camera waypoints" pattern — you don't need free-roam 3D to feel
  interactive; pinned camera transitions per section are cheaper and read better on mobile.

- **Keita Yamada — `https://p5aholic.me/`**
  Japanese interactive designer. Six clean sections, "100 Days of Poetry" WebGL gallery.
  *Borrow:* the "100 Days of X" side-project shelf as a way to front-load craft evidence
  without needing more internships.

- **Matt DesLauriers — `https://www.mattdesl.com/`**
  Generative-art creative coder, 637 GitHub repos, also open-source ecosystem builder
  (canvas-sketch etc.).
  *Borrow:* the "artist statement" framing instead of resume framing — he describes a
  *practice*, not a job hunt.

### ML / AI / research-adjacent peers

- **Andrej Karpathy — `https://karpathy.ai/`** (plus `http://karpathy.github.io/` for
  the famous blog). Canonical example of "blog is the portfolio". Minimal chrome, content
  does the work. *Borrow:* a single "Writing" section with 3-5 technical posts outperforms
  a certificates gallery for ML roles.

- **Chris Olah — `https://colah.github.io/`**
  Longform, illustrated ML explainers (neural nets, topology). Austere but distinctive
  through hand-crafted diagrams. *Borrow:* one genuinely excellent illustrated explainer
  on something you've built (e.g. the RL soccer agent's reward shaping) would beat 20
  project cards.

- **Lilian Weng — `https://lilianweng.github.io/`**
  Classic academic-blog Hugo site. Nothing fancy — signals "I read papers and synthesize
  them." *Borrow:* tagged post archive by research area.

- **Nikita Kozodoi — `https://www.kozodoi.me/`**
  Closest structural peer for "kaggle/ML engineer who also ships". Home / Blog / Talks /
  Publications / Awards. *Borrow:* the "Talks" and "Awards" sections as first-class nav
  items — explicitly separating speaking/competition credibility from job history.

### Minimal-but-memorable (terminal / editorial / design-engineer)

- **Brittany Chiang — `https://brittanychiang.com/`**
  Next.js + Tailwind, dark theme, Inter typeface. The reference implementation of a
  "software engineer" portfolio — clean vertical nav, experience timeline, projects,
  writing. v4 source is open on GitHub. *Borrow:* the experience-timeline layout (year
  column + role column) is a clearer pattern than most "card grids" for showing growth.

- **Paco Coursey — `https://paco.me/`**
  Pure typography portfolio — no images, no nav chrome. Projects listed as working tools
  (cmdk, Writer). *Borrow:* the "projects as tools people use" framing instead of "projects
  as screenshots". If the RL soccer game is a tool, it gets filed there; if it's a demo,
  it gets filed under "writing/experiments".

- **Rauno Freiberg — `https://rauno.me/`**
  Vercel staff design engineer. Minimal page with a manifesto ("Make it fast. Make it
  beautiful. Make it consistent..."). Dock-like nav on older iteration. *Borrow:* lead
  with a point of view, not a job title.

- **Lee Robinson — `https://leerob.com/`**
  The archetypal "developer relations" personal site. Live Spotify now-playing widget,
  curated essays, music + family mentions humanize it. *Borrow:* at least one live data
  hook (now-playing, recent GitHub commits, last match played in the RL soccer game) to
  make the site feel alive vs. static.

- **Lynn Fisher — `https://lynnandtonic.com/`**
  Annually redesigned site. v. XIX currently. Each version is a CSS-art concept.
  *Borrow:* the *idea* of versioning — keep old `/v1`, `/v2` URLs around as easter eggs.
  Shows growth over time and is a running demo of taste evolution.

- **Josh W. Comeau — `https://www.joshwcomeau.com/`**
  Playful, interactive blog-portfolio. Sound effects on link hover, delightful animations,
  dark/light toggle. *Borrow:* micro-delights (one well-placed sound, one spring-animated
  toggle) — cheap to add, disproportionately memorable.

- **Cassie Evans — `https://www.cassie.codes/`**
  SVG / GSAP animations, pastel color-per-section scroll. *Borrow:* section-level color
  identity as a navigation cue instead of a sticky header.

### Honorable mentions worth one click

- **Andy Bell — `https://bell.bz/`** — editorial/brutalist personal site, opinionated typography.
- **Robin Mastromarino** — WebGL homepage slider with GSAP displacement (find via Awwwards).
- **Andrew Woan / "Aimee's Papercraft World"** — React Three Fiber + baked Blender scenes,
  hand-drawn 2D assets on 3D geometry. Great reference if the user wants to lean into the
  anime aesthetic with actual 3D instead of 2D illustrations.

---

## Awards & "Best Of" Lists to Follow

- **Awwwards SOTD/SOTM** — `https://www.awwwards.com/websites/sites_of_the_day/`. Daily
  cadence, the default feed. Filter by Portfolio / Developer.
- **FWA of the Day** — `https://thefwa.com/`. Technically more ambitious picks; weekly reading.
- **CSS Design Awards** — `https://www.cssdesignawards.com/`. Third rail after Awwwards/FWA;
  good for catching sites the other two missed.
- **The Webby Awards** — `https://www.webbyawards.com/`. More brand/agency-focused, less
  useful for personal portfolios, but the "Personal/Cultural Blog" and "Best Visual Design -
  Aesthetic" categories are worth checking each year.
- **Godly.website** (weekly newsletter) — highest signal-per-email of any of these.
- **Awwwards "Developer Awards" filter** — more useful than the generic Portfolio filter
  because it biases toward sites judged on craft, not just visual design.

Practical reading cadence: Awwwards daily (30 sec/day), Godly weekly, FWA weekly, CSSDA
and Webbys quarterly when announcements drop.

---

## Synthesis

**The top-line takeaway:** a CS student / ML engineer portfolio can be excellent in one
of three archetypes, and trying to be all three is why most portfolios feel muddled. Pick
one, commit.

1. **"The playable demo site."** The whole site is a demo of your skill. Bruno Simon,
   Keita Yamada, Aimee's Papercraft World. This user *already has the raw material* (the
   RL soccer game) — the highest-leverage move is to promote the game from a section widget
   to the site's primary navigation metaphor, à la Bruno. Risk: mobile experience, accessibility.
2. **"The research-blog site."** The site is a thin shell around excellent writing.
   Karpathy, Olah, Lilian Weng, Kozodoi. This is the strongest framing for ML roles
   specifically. Cost: requires actually writing 3-5 great posts. Benefit: ages well,
   compounds over time, and ML hiring managers read blogs more than they click portfolios.
3. **"The design-engineer site."** Minimal, typographic, every pixel intentional. Brittany
   Chiang, Paco Coursey, Rauno Freiberg, Lee Robinson. Signals taste and front-end chops.
   Best for SWE roles where the site itself is the writing sample.

**The "soccer/anime" theme is a feature, not a bug** — but only if the site leans into it
hard enough. A half-committed theme reads as noise; a fully committed theme (think Lynn
Fisher's annual reinvention, or Aimee's Papercraft World) reads as personality. The
question to answer before anything else: is the theme the *setting* (like Bruno's driving
world) or just the *wallpaper*? If it's just wallpaper, strip it. If it's the setting,
double down — the RL game becomes the hub, sections become locations, etc.

**Concrete next moves, ranked by ROI:**

1. Pick an archetype above. Commit in writing.
2. Subscribe to Awwwards SOTD and Godly. Screenshot 5 sites/week into a scratch folder.
   After 4 weeks, cluster the screenshots — that clustering *is* the design brief.
3. Add one live data hook (Lee Robinson's now-playing, a GitHub activity graph, or last-5
   matches played in the RL soccer game leaderboard). Single biggest "this site is alive"
   upgrade for the least effort.
4. Write one technical post about the RL soccer agent (reward shaping, self-play,
   whatever the interesting part was). This one post does more for ML-role applications
   than any visual polish.
5. Open-source the portfolio itself on GitHub and link to the repo from the footer (Bruno,
   Brittany, Paco all do this). For a CS student this is free credibility.

Do *not* do: add more sections, add more certificates, add another framework logo wall,
add another "skills" progress bar. Those are the tells of a not-yet-confident portfolio.
Every site studied above is confident enough to leave things out.

---

## Sources

- [Awwwards — Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/)
- [Awwwards — Winner Portfolios](https://www.awwwards.com/websites/winner_category_portfolio/)
- [Awwwards — Developer winners](https://www.awwwards.com/websites/developer/)
- [FWA](https://thefwa.com/)
- [Muzli 100 Best Designer Portfolios 2026](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [Killer Portfolio — Rauno Freiberg](https://www.killerportfolio.com/by/rauno-freiberg)
- [designengineer.fyi — Paco Coursey](https://designengineer.fyi/paco-coursey)
- [Bruno Simon](https://bruno-simon.com/)
- [Brittany Chiang](https://brittanychiang.com/)
- [Paco Coursey](https://paco.me/)
- [Rauno Freiberg](https://rauno.me/)
- [Lee Robinson](https://leerob.com/)
- [Lynn Fisher](https://lynnandtonic.com/)
- [Josh W. Comeau](https://www.joshwcomeau.com/)
- [Nikita Kozodoi](https://www.kozodoi.me/)
- [Andrej Karpathy](https://karpathy.ai/)
- [Chris Olah](https://colah.github.io/)
- [Lilian Weng](https://lilianweng.github.io/)
- [Matt DesLauriers](https://www.mattdesl.com/)
- [Andy Bell](https://bell.bz/)
- [Cassie Evans](https://www.cassie.codes/)
- [Keita Yamada](https://p5aholic.me/)
- [Best Three.js Portfolios — CreativeDevJobs](https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025)
- [Six Three.js Portfolios — DEV](https://dev.to/hr21don/six-stunning-web-developer-portfolios-showcasing-threejs-mastery-206n)
