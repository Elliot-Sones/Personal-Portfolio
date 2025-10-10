"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MotionProps, Transition } from "framer-motion";

const projects = [
  {
    title: "Match Insights Dashboard",
    description:
      "Real-time analytics exploring team momentum, expected goals, and tactical trends across the major European leagues.",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    link: "https://github.com/elliot18/match-insights",
  },
  {
    title: "Player Radar Generator",
    description:
      "Upload performance data to generate scouted radar charts, benchmarking athletes against positional archetypes.",
    tech: ["D3.js", "Vercel Edge", "Framer Motion"],
    link: "https://github.com/elliot18/player-radar",
  },
  {
    title: "Training Microcycles App",
    description:
      "Mobile-first planner that coordinates conditioning blocks, session loads, and wellness check-ins for youth academies.",
    tech: ["React Native", "Expo", "Zustand"],
    link: "https://github.com/elliot18/training-cycles",
  },
];

const focuses = [
  {
    title: "AI-Assisted Match Notes",
    detail:
      "Building a workflow that converts match footage into tagged clips and tactical summaries in minutes.",
  },
  {
    title: "Motion-First Interactions",
    detail:
      "Experimenting with progressive disclosure and gesture-friendly animations for scouting dashboards.",
  },
];

const highlights = [
  { label: "Experience", value: "4+ years shipping products" },
  { label: "Stack", value: "TypeScript • Next.js • Node • React Native" },
  { label: "Based in", value: "Toronto, Canada" },
  { label: "Current club", value: "Full-stack dev @ Night Owl Collective" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/Elliot-Sones" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elliot-sones/" },
  { label: "Resume", href: "https://x.com/elliotcodes" },
];

const fadeTransition: Transition = { duration: 0.6, ease: "easeOut" };

const fadeConfig: MotionProps = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: fadeTransition,
};

export default function Home() {
  return (
    // header
    <div className="relative isolate">
      <header className="mx-auto w-full max-w-5xl px-6 pt-4 sm:pt-6">
        <nav className="flex items-center justify-between rounded-full border border-border bg-card/80 px-6 py-4 backdrop-blur">
          <span className="font-display text-lg tracking-[0.4em] uppercase">
            Elliot Sones
          </span>
          <div className="hidden items-center gap-6 text-sm uppercase tracking-[0.25em] text-muted sm:flex">
            <a className="hover:text-accent transition-colors" href="#about">
              About
            </a>
            <a className="hover:text-accent transition-colors" href="#work">
              Work
            </a>
            <a className="hover:text-accent transition-colors" href="#contact">
              Contact
            </a>
          </div>
          <Link
            href="#contact"
            className="rounded-full border border-border bg-foreground/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:border-accent hover:text-accent"
          >
            Let&apos;s talk
          </Link>
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-24 px-6 py-16 sm:gap-32 sm:py-24">
        <motion.section
          id="hero"
          className="rounded-3xl border border-border bg-card/80 p-8 shadow-xl shadow-black/10 backdrop-blur"
          {...fadeConfig}
        >
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
            Full-stack developer &amp; football analytics enthusiast
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl uppercase tracking-[0.08em] text-foreground sm:text-6xl">
            Building soccer-inspired digital experiences that feel match-day
            smooth.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            I craft responsive apps that connect athletes, coaches, and fans
            through data-driven storytelling. From live match analysis to
            training tools, I blend clear UX with performant engineering.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#work"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-background transition hover:brightness-105"
            >
              View recent work
            </Link>
            <a
              href="mailto:hello@elliot.dev"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-muted transition hover:border-accent hover:text-accent"
            >
              Chat about a project
            </a>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {highlights.map((item) => (
              <motion.div
                key={item.label}
                className="rounded-2xl border border-border/60 bg-background/40 p-6 shadow-inner shadow-black/20"
                whileHover={{ y: -6, opacity: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs uppercase tracking-[0.35em] text-muted">
                  {item.label}
                </p>
                <p className="mt-3 font-display text-xl uppercase tracking-[0.1em]">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        // about section
        <motion.section
          id="about"
          className="grid gap-10 rounded-3xl border border-border bg-card/75 p-8 backdrop-blur md:grid-cols-[1.2fr_0.8fr]"
          {...fadeConfig}
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
              About me
            </p>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
              Shipping features with the discipline of a midfield engine.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              I specialise in full-stack TypeScript, pairing design intuition
              with reliable delivery. My workflow centres on rapid prototyping,
              clear documentation, and steady iteration—much like preparing for
              match day. I love bridging analytics with storytelling so clubs,
              brands, and startups can make confident, data-backed moves.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              When I&apos;m not coding, you can find me breaking down Premier
              League tactics, coaching youth sessions, or recording notes for
              the next build.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <article className="rounded-2xl border border-border/60 bg-background/40 p-6">
              <h3 className="font-display text-xl uppercase tracking-[0.12em]">
                Toolset
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>• TypeScript, Next.js, Node.js</li>
                <li>• Tailwind CSS, Framer Motion, Radix UI</li>
                <li>• PostgreSQL, Supabase, Prisma</li>
                <li>• Expo, React Native, Zustand</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-border/60 bg-background/40 p-6">
              <h3 className="font-display text-xl uppercase tracking-[0.12em]">
                Values
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>• Accessibility and clarity over pixel tricks</li>
                <li>• Pairing rapid delivery with thoughtful QA</li>
                <li>• Building transparent feedback loops with teams</li>
              </ul>
            </article>
          </div>
        </motion.section>
        // work section
        <motion.section
          id="work"
          className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur"
          {...fadeConfig}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                Selected work
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                Projects shaped by the beautiful game.
              </h2>
            </div>
            <Link
              href="https://github.com/elliot18"
              className="self-start rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:border-accent hover:text-accent"
            >
              Explore GitHub
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                className="group flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-background/40 p-6 shadow-md shadow-black/10 transition"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-[0.1em]">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={project.link}
                  className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition group-hover:gap-3"
                >
                  View project
                  <span aria-hidden>→</span>
                </Link>
              </motion.article>
            ))}
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {focuses.map((focus) => (
              <motion.article
                key={focus.title}
                className="rounded-3xl border border-border/60 bg-background/40 p-6 shadow-inner shadow-black/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="font-display text-xl uppercase tracking-[0.1em]">
                  {focus.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {focus.detail}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>
        // contact section
        <motion.section
          id="contact"
          className="rounded-3xl border border-border bg-card/85 p-8 backdrop-blur"
          {...fadeConfig}
        >
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                Contact
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                Ready to collaborate? Let&apos;s build the next big play.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Send a note about your idea, provide a match brief, or simply
                say hello. I respond within two working days and can jump on a
                call to scope things fast.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm uppercase tracking-[0.25em] text-muted">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="transition hover:text-accent"
                  >
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>
            <form
              action="https://formspree.io/f/yourFormId"
              method="POST"
              className="rounded-2xl border border-border/60 bg-background/45 p-6 shadow-lg shadow-black/10"
            >
              <div className="flex flex-col gap-4">
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Name
                  <input
                    className="mt-2 w-full rounded-xl border border-border bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Email
                  <input
                    className="mt-2 w-full rounded-xl border border-border bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
                    type="email"
                    name="_replyto"
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Project details
                  <textarea
                    className="mt-2 h-28 w-full resize-none rounded-xl border border-border bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
                    name="message"
                    placeholder="Tell me about the challenge you want to solve…"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-background transition hover:brightness-110"
                >
                  Send message
                </button>
                <p className="text-[11px] uppercase tracking-[0.25em] text-muted">
                  Powered by Formspree · Update the action URL once your form is
                  set up.
                </p>
              </div>
            </form>
          </div>
        </motion.section>
      </main>
      // footer
      <footer className="mx-auto w-full max-w-5xl px-6 pb-16 text-xs uppercase tracking-[0.35em] text-muted">
        © {new Date().getFullYear()} Elliot. Crafted with Next.js, Tailwind,
        and a love for the beautiful game.
      </footer>
    </div>
  );
}
