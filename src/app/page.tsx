"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import type { MotionProps, Transition } from "framer-motion";
import { CursorBall } from "@/components/CursorBall";

// Portfolio projects showcased in the “Work” grid
const projects = [
  {
    title: "Digit Classifier Neural Network from Scratch",
    description:
      "Built a neural network from scratch (only numpy) to classify digits from 0 to 9 and put it into production for people to use.",
    tech: ["Python","Numpy"],
    link: "https://github.com/Elliot-Sones/Digit-Classifier-from-scratch",
  },
  {
    title: "Crypto learning platform",
    description:
      "Built a crypto learning platform to help people learn about crypto and blockchain. ",
    tech: ["React", "TypeScript"],
    link: "https://github.com/Elliot-Sones/Nodelet_web",
  },
  {
    title: "Work helper AI",
    description:
      "On going project building an AI assistant helping you to work as smart as possible. Let's you know when you should take a break or when you efficiency is lowering",
    tech: ["machine learning", "Python", "Neural Networks"],
    link: "https://github.com/elliot18/training-cycles",
  },
];

// Spotlight items for the “Currently exploring” cards
const focuses = [
  {
    title: "Machine Learning and data science ",
    detail:
      "Building a workflow that converts match footage into tagged clips and tactical summaries in minutes.",
  },
  {
    title: "Motion-First Interactions",
    detail:
      "Experimenting with progressive disclosure and gesture-friendly animations for scouting dashboards.",
  },
];

// Hackathon experience highlights
const hackathons = [
  {
    name: "MUES Hackathon 2025",
    project: "Magic Studio Paint",
    date: "October 2025",
    outcome: "Won 1st place",
    git: "https://github.com/Elliot-Sones/MUESHACK",
    description:
      "Built a website that allows you to draw on a canvas and choose your caracter and interact with the drawing",
    link: "https://magicspace.vercel.app/",
  },
  {
    name: "Pond Hackathon 2025",
    project: "Nodelet",
    date: "July 2025",
    outcome: "over 20 000 votes",
    git: "https://github.com/Elliot-Sones/Pond-Hackathon",
    description:
      "Built a educational interactive learning platform for crypto literacy",
    link: "https://nodelet-web.vercel.app/",
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
const BALL_FORWARD_OFFSET = 12;

const PitchProgress = () => {
  const { scrollYProgress } = useScroll();
  const columnRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef(0);
  const ballHeightRef = useRef(0);
  const [goalVisible, setGoalVisible] = useState(false);
  const [, setRerender] = useState(0); // force update when measurements change
  const kickSoundRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollRef = useRef(scrollYProgress.get());

  useEffect(() => {
    kickSoundRef.current = new Audio("/audio/soccerkick.mp3");
    kickSoundRef.current.volume = 0.5;

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

      travelRef.current = Math.max(columnHeight - goal.clientHeight - ball.clientHeight - BALL_FORWARD_OFFSET, 0);
      ballHeightRef.current = ball.clientHeight;
      setRerender((count) => count + 1);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  const translateY = useTransform(scrollYProgress, (value) => `${BALL_FORWARD_OFFSET + value * travelRef.current}px`);
  const trailHeight = useTransform(
    scrollYProgress,
    (value) => `${Math.max(value * travelRef.current + ballHeightRef.current, 0)}px`,
  );
  const goalOpacity = useSpring(
    useTransform(scrollYProgress, [0.65, 1], [0, 1]),
    { stiffness: 120, damping: 18 },
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setGoalVisible(latest >= 0.65);

    const previous = lastScrollRef.current;
    lastScrollRef.current = latest;
    if (Math.abs(latest - previous) < 0.01) {
      return;
    }

    const audio = kickSoundRef.current;
    if (!audio) {
      return;
    }
    try {
      audio.currentTime = 0;
      void audio.play();
    } catch {
      // ignore playback errors (e.g. auto-play restrictions)
    }
  });

  return (
    <div className="pointer-events-none fixed left-2 top-28 z-30 hidden h-[70vh] w-24 flex-col items-center md:flex lg:left-8">
      <div ref={columnRef} className="relative flex-1">
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2 border-l-2 border-dashed border-accent/60"
          style={{ height: trailHeight }}
        />
        <motion.div
          style={{ translateY }}
          className="absolute left-1/2 top-0 -translate-x-1/2"
        >
          <div ref={ballRef} className="flex h-16 w-16 items-center justify-center">
            <Image src="/soccer-ball.svg" alt="Soccer ball" width={52} height={52} priority />
          </div>
        </motion.div>
        <motion.div
          ref={goalRef}
          style={{ opacity: goalVisible ? goalOpacity : 0 }}
          className="absolute bottom-0 left-1/2 flex h-20 w-24 -translate-x-1/2 items-end justify-center transition-opacity duration-500"
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

const HeroCodingAnimation = ({ className = "" }: { className?: string }) => {
  const { RiveComponent } = useRive({
    src: "/rive/coding.riv",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div
      className={`relative h-72 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-foreground/10 via-accent/15 to-transparent shadow-lg shadow-black/20 ${className}`}
    >
      {RiveComponent ? (
        <RiveComponent className="h-full w-full" />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-foreground/10" />
      )}
    </div>
  );
};

export default function Home() {
  return (
    <div className="relative isolate">
      <CursorBall />
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
            <a className="hover:text-accent transition-colors" href="#experience">
              Experience
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
            <HeroCodingAnimation className="hidden md:block" />
          </div>
        </motion.section>
        {/* About / profile narrative */}
        <motion.section
          id="about"
          className="grid gap-10 rounded-3xl border border-border bg-card/75 p-8 backdrop-blur md:grid-cols-[1.2fr_0.8fr]"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
              About me
            </p>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
              My Story and experience
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
            I started my journey as a professional soccer player, where I learned discipline, focus, and resilience. 
            <br />After stepping off the field, I pursued business at university to understand strategy and value creation. 
            <br />That path eventually led me to computer science, where I now focus on building, problem-solving, and leveraging technology to create real-world impact. <br />
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
            I now use my skills from sports, business, and computer science towards my next challenge.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="https://www.playmakerstats.com/player/elliot-sones/1259756"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-border/60 bg-background/40 p-6 transition hover:border-accent hover:bg-background/60"
            >
              <h3 className="font-display text-xl uppercase tracking-[0.12em]">
                Soccer
              </h3>
              <Image
                src="/elliot-lank.jpg"
                alt="Soccer"
                width={320}
                height={320}
                className="w-50 h-50 rounded-lg object-cover mx-auto"
              />
            </a>
            <a
              href="https://github.com/Elliot-Sones"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-border/60 bg-background/40 p-6 transition hover:border-accent hover:bg-background/60"
            >
              <h3 className="font-display text-xl uppercase tracking-[0.12em]">
                Coding
              </h3>
              <p className="mt-4 text-sm text-muted">
                Machine learning, data analysis, and software development.
              </p>
            </a>
          </div>
        </motion.section>
        {/* Work highlights + focus cards */}
        <motion.section
          id="projects"
          className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                My projects
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                Solving problems 
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
              <motion.a
                key={project.title}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-background/40 p-6 shadow-md shadow-black/10 transition hover:border-accent hover:bg-background/60"
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
                <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition group-hover:gap-3">
                  View project
                  <span aria-hidden>→</span>
                </div>
              </motion.a>
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
        {/* Hackathon experience */}
        <motion.section
          id="experience"
          className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                Experience
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                Experiences and hackathons
              </h2>
            </div>
            <p className="max-w-sm self-start text-xs uppercase tracking-[0.25em] text-muted">
              Two intense weekends, two shipped products, and plenty of coffee.
            </p>
          </div>
          <div className="mt-10 space-y-6">
            {hackathons.map((hackathon, index) => (
              <motion.article
                key={hackathon.name}
                className="rounded-3xl border border-border/60 bg-background/40 p-6 shadow-inner shadow-black/10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-foreground">
                        {hackathon.name}
                      </h3>
                      <Link
                        href={hackathon.git}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent transition hover:text-accent/80"
                      >
                        GitHub
                        <span aria-hidden>↗</span>
                      </Link>
                    </div>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted">
                      {hackathon.project}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted">
                    {hackathon.date}
                  </p>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-accent/80">
                  {hackathon.outcome}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {hackathon.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:gap-3">
                  <Link href={hackathon.link} target="_blank" rel="noopener noreferrer">
                    View the project
                  </Link>
                  <span aria-hidden>→</span>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
        {/* Technical skills */}
        <motion.section
          id="skills"
          className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur"
          style={{ scrollMarginTop: "20vh" }}
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
          style={{ scrollMarginTop: "20vh" }}
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
