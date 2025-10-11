"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionProps, Transition } from "framer-motion";

// Portfolio projects showcased in the “Work” grid
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

// Spotlight items for the “Currently exploring” cards
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

// Technical skill groups to highlight core competencies
const skillGroups = [
  {
    title: "Frontend Craft",
    summary: "Composing immersive, performant interfaces with an eye for accessibility.",
    items: ["TypeScript", "React & Next.js", "Tailwind CSS", "Framer Motion", "Radix UI"],
  },
  {
    title: "Backend & Data",
    summary: "Designing resilient APIs and data pipelines that keep insights flowing.",
    items: ["Node.js", "Supabase & PostgreSQL", "Prisma", "REST & GraphQL", "tRPC"],
  },
  {
    title: "Applied Intelligence",
    summary: "Transforming match data and training logs into actionable models.",
    items: ["Python", "scikit-learn", "TensorFlow Lite", "Pandas", "Jupyter"],
  },
  {
    title: "Dev Experience",
    summary: "Shipping confidently with modern tooling and collaboration practices.",
    items: ["Git & GitHub", "CI/CD (GitHub Actions)", "Expo", "Storybook", "Testing Library"],
  },
];

// Footer + contact links (kept short for scanning)
const socials = [
  { label: "GitHub", href: "https://github.com/Elliot-Sones" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elliot-sones/" },
  { label: "Resume", href: "/resume.pdf" },
  { label: "Instagram", href: "https://www.instagram.com/_elliot.sones_/"},
  { label: "Email", href: "mailto:soneselliot@gmail.com"}
];

// Shared motion preset for section fade/slide reveal with scale effect
// Subtle scale effect for focus without overwhelming the layout
const fadeTransition: Transition = { duration: 0.6, ease: "easeOut" };
const fadeConfig: MotionProps = {
  initial: { opacity: 0, y: 24, scale: 0.96 },
  whileInView: { opacity: 1, y: 0, scale: 1.02 },
  viewport: { once: false, amount: 0.3 },
  transition: fadeTransition,
};

// Left-rail progress indicator: soccer ball travels down a dashed line as content scrolls
const END_SHIFT = 28;

type ProgressLayout = {
  ballTravel: number;
  goalBottom: number;
  ballHeight: number;
};

const PitchProgress = () => {
  const { scrollYProgress } = useScroll();
  const columnRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<ProgressLayout>({
    ballTravel: 0,
    goalBottom: 0,
    ballHeight: 0,
  });

  useEffect(() => {
    const measure = () => {
      const column = columnRef.current;
      const goal = goalRef.current;
      const ball = ballRef.current;
      if (!column || !goal || !ball) {
        return;
      }

      const columnHeight = column.clientHeight;
      if (columnHeight === 0) {
        return;
      }

      const goalHeight = goal.clientHeight;
      const ballHeight = ball.clientHeight;

      const goalBottom = Math.max(-END_SHIFT, -goalHeight * 0.6);
      const goalTop = columnHeight - goalBottom - goalHeight;

      const maxBallTop = Math.max(columnHeight - ballHeight, 0);
      const ballTop = Math.min(Math.max(goalTop - ballHeight, 0), maxBallTop);

      const nextLayout: ProgressLayout = {
        goalBottom,
        ballTravel: ballTop,
        ballHeight,
      };

      setLayout((prev) =>
        Math.abs(prev.ballTravel - nextLayout.ballTravel) > 0.5 ||
        Math.abs(prev.goalBottom - nextLayout.goalBottom) > 0.5 ||
        Math.abs(prev.ballHeight - nextLayout.ballHeight) > 0.5
          ? nextLayout
          : prev,
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  const translateY = useTransform(scrollYProgress, (value) => `${value * layout.ballTravel}px`);
  const trailHeight = useTransform(scrollYProgress, (value) => {
    const travel = value * layout.ballTravel;
    if (travel <= 0) {
      return "0px";
    }

    const totalPath = layout.ballTravel + layout.ballHeight;
    const height = Math.min(travel + layout.ballHeight * 0.25, totalPath);
    return `${Math.max(height, 0)}px`;
  });
  const goalOpacity = useTransform(scrollYProgress, [0.6, 0.95], [0, 1]);
  const ballScale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1.05, 1.05, 0.9]);

  return (
    <div className="pointer-events-none fixed left-2 top-28 z-30 hidden h-[70vh] w-24 flex-col items-center md:flex lg:left-8">
      <div ref={columnRef} className="relative flex-1">
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2 border-l-2 border-dashed border-accent/60"
          style={{ height: trailHeight }}
        />
        <motion.div
          style={{ translateY, scale: ballScale }}
          className="absolute left-1/2 top-0 -translate-x-1/2"
        >
          <div ref={ballRef} className="flex h-16 w-16 items-center justify-center">
            <Image src="/soccer-ball.svg" alt="Soccer ball" width={52} height={52} priority />
          </div>
        </motion.div>
        <motion.div
          ref={goalRef}
          style={{ opacity: goalOpacity, bottom: layout.goalBottom }}
          className="absolute bottom-0 left-1/2 flex h-20 w-24 -translate-x-1/2 items-end justify-center"
          aria-hidden
        >
          <div className="relative h-16 w-20 rounded-b-[8px] border-2 border-accent/60 bg-background/20 backdrop-blur-sm">
            <span className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-accent/40" />
            <span className="absolute inset-y-4 left-2 w-1 rounded-full bg-accent/35" />
            <span className="absolute inset-y-4 right-2 w-1 rounded-full bg-accent/35" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="relative isolate">
      <PitchProgress />
      <header className="mx-auto w-full max-w-5xl px-6 pt-4 sm:pt-6">
        <nav className="flex items-center justify-between rounded-full border border-border bg-card/80 px-6 py-4 backdrop-blur">
          <span className="font-display text-lg tracking-[0.4em] uppercase">
            Elliot Sones
          </span>
          <div className="hidden items-center gap-6 text-sm uppercase tracking-[0.25em] text-muted sm:flex">
            <a className="hover:text-accent transition-colors" href="#about">
              About
            </a>
            <a className="hover:text-accent transition-colors" href="#projects">
              Projects
            </a>
            <a className="hover:text-accent transition-colors" href="#skills">
              Skills
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
      <main
        // Anchor for scroll-based animations (hero → footer)
        className="mx-auto flex w-full max-w-5xl flex-col gap-24 px-6 py-16 sm:gap-32 sm:py-24"
      >
        {/* Hero intro */}
        <motion.section
          id="hero"
          className="rounded-3xl bg-card/80 p-8 shadow-xl shadow-black/10 backdrop-blur"
          {...fadeConfig}
        >
          <div className="grid gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-6 text-left">
              <p className="font-display text-5xl uppercase tracking-[0.06em] text-foreground sm:text-6xl md:text-7xl">
                Hey there!
              </p>
              <p className="text-base tracking-[0.32em] text-muted sm:text-lg">
                I&apos;m Elliot and welcome to my personal website!
              </p>
              <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                I am a Computer Scince Student at Toronto Metropolitan University. I love to build cool things with coding especially when dealing with large data sets and Machine Learning.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="#projects"
                  className="rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-muted transition hover:border-accent hover:text-accent"
                >
                  View my recent projects
                </Link>
                <a
                  href="#contact"
                  className="rounded-full bg-accent/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-background transition hover:bg-black/70"
                >
                  Connect with me
                </a>
              </div>
            </div>
            <div className="relative hidden h-72 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-foreground/10 via-accent/15 to-transparent shadow-lg shadow-black/20 md:block">
              <span className="absolute inset-4 rounded-[28px] border border-border/60 bg-background/20 backdrop-blur-sm" />
              <span className="absolute inset-x-10 bottom-10 h-24 rounded-[48px] border border-accent/40 bg-accent/10 blur-xl" />
              <span className="absolute inset-x-14 top-10 h-20 rounded-[48px] border border-border/40 bg-background/30" />
              <p className="absolute bottom-6 left-8 font-mono text-xs uppercase tracking-[0.35em] text-muted">
                Image placeholder
              </p>
            </div>
          </div>
        </motion.section>
        {/* About / profile narrative */}
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
        {/* Work highlights + focus cards */}
        <motion.section
          id="projects"
          className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur"
          {...fadeConfig}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                My projects
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                Projects shaped by the beautiful game.
              </h2>
            </div>
            <Link
              href="https://github.com/Elliot-Sones"
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
        {/* Technical skills */}
        <motion.section
          id="skills"
          className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur"
          {...fadeConfig}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                Technical skills
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                A toolkit tuned for data-rich, immersive experiences.
              </h2>
            </div>
            <p className="max-w-sm self-start text-xs uppercase tracking-[0.25em] text-muted">
              Bridging product, engineering, and analytics so every build is match ready.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {skillGroups.map((group, index) => (
              <motion.article
                key={group.title}
                className="rounded-3xl border border-border/60 bg-background/40 p-6 shadow-inner shadow-black/10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={{ y: -6 }}
              >
                <h3 className="font-display text-xl uppercase tracking-[0.12em]">
                  {group.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{group.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border/60 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </motion.section>
        {/* Contact / form */}
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
                  Any details?
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
      <footer className="mx-auto w-full max-w-5xl px-6 pb-16 text-xs uppercase tracking-[0.35em] text-muted">
        © {new Date().getFullYear()} Elliot. Crafted with Next.js, Tailwind,
        and a love for the beautiful game.
      </footer>
    </div>
  );
}
