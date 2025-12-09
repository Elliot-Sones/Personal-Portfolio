"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import type { MotionProps, Transition } from "framer-motion";
import { CursorBall } from "@/components/CursorBall";
import { MNISTCanvas } from "@/components/MNISTCanvas";

// Portfolio projects showcased in the “Work” grid
const projects = [
  {
    title: "Neural Network Fundamental",
    description:
      "This projects builds the fundamental neural network architectures including, multilayer perceptron, Convolutional Neural Networks and Recurrent Neural Network.",
    tech: ["Python", "Numpy", "TensorFlow"],
    link: "https://github.com/Elliot-Sones/Neural_Networks_Fundamentals",
  },
  {
    title: "Machine Translator",
    description:
      "In this project, I replicated the 'Transformer' model from the research paper 'Attention is all you need' to build a machine translator from English to French.",
    tech: ["Transformer", "Self Attention", "TensorFlow", "Python"],
    link: "https://github.com/Elliot-Sones/Transformers",
  },
  {
    title: "RL AI 2D Fighting agent",
    description:
      "In this project I trained a RL PPO model to play against a 2d fighting game",
    tech: ["machine learning", "Python", "Neural Networks"],
    link: "https://github.com/Elliot-Sones/AI_2",
  },
];

// Spotlight items for the “Currently exploring” cards
const focuses = [
  {
    title: "AI integration",
    detail:
      "Integrating AI into my projects to improve performance and accuracy.",
  },
  {
    title: "Deep Learning",
    detail:
      "Experimenting with deep learning models to improve the performance of my projects.",
  },
];

// Hackathon experience highlights
const hackathons = [
  {
    name: "NTangible",
    project: "Machine Learning Research Intern",
    date: "November 2025",
    logo: "/experience/ntangible_logo.png", // Small logo for top-right
    image: "", // Large image for right side
    outcome: "",
    git: "",
    description:
      "Supporting the technical team on exploring real-world applications of AI/ML in sports psychology, combining technical development with performance analytics.",
    link: "",
  },
  {
    name: "UofT Anthropic Hackathon",
    project: "Reinforcement Learning Agent 2D Fighting Game",
    date: "October 2025",
    logo: "/experience/anthropic_logo.png",
    image: "/experience/anthropic_image.png",
    outcome: "",
    git: "https://github.com/Elliot-Sones/AI_2",
    description:
      "Developed a reinforcement learning agent that learns to play a 2D fighting game through self-play and neural network training.",
    link: "",
  },
  {
    name: "AI^2",
    project: "Reinforcement Learning Agent 2D Fighting Game",
    date: "October 2025",
    logo: "/experience/ai^2_logo.png",
    image: "/experience/ai^2_image.png",
    outcome: "",
    git: "https://github.com/Elliot-Sones/AI_2",
    description:
      "Developed a reinforcement learning agent that learns to play a 2D fighting game through self-play and neural network training.",
    link: "",
  },
  {
    name: "MUES Hackathon 2025",
    project: "Magic Studio Paint",
    date: "October 2025",
    logo: "/experience/mues_logo.png",
    image: "/experience/mues_image.png",
    outcome: "Won 1st place",
    git: "https://github.com/Elliot-Sones/MUESHACK",
    description:
      "Built a website that allows you to draw on a canvas and choose your character and interact with the drawing",
    link: "https://magicspace.vercel.app/",
  },
  {
    name: "Pond Hackathon 2025",
    project: "Nodelet",
    date: "July 2025",
    logo: "",
    image: "",
    outcome: "Over 20,000 votes",
    git: "https://github.com/Elliot-Sones/Pond-Hackathon",
    description:
      "Built an educational interactive learning platform for crypto literacy",
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
  { label: "Resume", href: "https://drive.google.com/file/d/1mv1yrWGmZp0d1NJmM8x8mINL1LVgvNuF/view?usp=drive_link" },
  { label: "Instagram", href: "https://www.instagram.com/_elliot.sones_/" },
  { label: "Discord", href: "https://discordapp.com/users/1362890550428176466" },
  { label: "Email", href: "mailto:soneselliot@gmail.com" }
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
  return (
    <div
      className={`pixel-card relative h-72 w-full overflow-hidden bg-gradient-to-br from-foreground/10 via-accent/15 to-transparent shadow-lg shadow-black/20 ${className}`}
    >
      <Image
        src="/elliot.png"
        alt="Elliot Sones"
        width={400}
        height={400}
        className="h-full w-full object-top object-cover"
        priority
      />
    </div>
  );
};

// Hackathon list component with show more/less functionality
const HackathonList = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedHackathons = showAll ? hackathons : hackathons.slice(0, 3);

  return (
    <>
      <div className="mt-10 space-y-6">
        {displayedHackathons.map((hackathon, index) => (
          <motion.article
            key={`${hackathon.name}-${index}`}
            className="pixel-card bg-background/40 p-6 shadow-inner shadow-black/10 overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              {/* Left side - Content */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  {/* Small logo in top-left */}
                  {hackathon.logo && (
                    <div className="pixel-card bg-background/60 p-2 w-16 h-16 flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={hackathon.logo}
                        alt={`${hackathon.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  )}

                  {/* Title and GitHub link */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 flex-1">
                    <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-foreground">
                      {hackathon.name}
                    </h3>
                    {hackathon.git && (
                      <Link
                        href={hackathon.git}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent transition hover:text-accent/80"
                      >
                        GitHub
                        <span aria-hidden>↗</span>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {hackathon.project && (
                    <p className="text-xs uppercase tracking-[0.25em] text-muted">
                      {hackathon.project}
                    </p>
                  )}
                  {hackathon.date && (
                    <p className="text-xs uppercase tracking-[0.25em] text-muted">
                      {hackathon.date}
                    </p>
                  )}
                </div>

                {hackathon.outcome && (
                  <p className="text-xs uppercase tracking-[0.25em] text-accent/80 font-semibold">
                    {hackathon.outcome}
                  </p>
                )}

                {hackathon.description && (
                  <p className="text-sm leading-relaxed text-muted">
                    {hackathon.description}
                  </p>
                )}

                {hackathon.link && (
                  <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:gap-3">
                    <Link href={hackathon.link} target="_blank" rel="noopener noreferrer">
                      View the project
                    </Link>
                    <span aria-hidden>→</span>
                  </div>
                )}
              </div>

              {/* Right side - Large banner image */}
              {hackathon.image && (
                <div className="pixel-card bg-background/20 p-2 w-full lg:w-80 h-48 lg:h-64 flex-shrink-0 overflow-hidden group">
                  <div className="relative w-full h-full">
                    <Image
                      src={hackathon.image}
                      alt={`${hackathon.project} preview`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hackathons.length > 3 && (
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="pixel-btn bg-background/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:text-accent hover:bg-background/60"
          >
            {showAll ? "Show Less" : `View All Experiences (${hackathons.length})`}
          </button>
        </motion.div>
      )}
    </>
  );
};

// MNIST Demo section component
const MNISTDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidences, setConfidences] = useState<Array<{ label: string; confidence: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);

  const handlePredict = async (imageData: string) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setConfidences([]);
    setIsSleeping(false);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();

      if (data.sleeping) {
        setIsSleeping(true);
        setError("Model is waking up... Please wait 30-60 seconds and try again.");
      } else if (data.error) {
        setError(data.message || data.error);
      } else if (data.success) {
        setPrediction(data.prediction);
        setConfidences(data.confidences || []);
      }
    } catch {
      setError("Failed to connect to the prediction service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      id="mnist-demo"
      className="pixel-border bg-card/80 p-4 sm:p-6 lg:p-10 backdrop-blur"
      style={{ scrollMarginTop: "20vh" }}
      {...fadeConfig}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
            Interactive Demo
          </p>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
            Try My Neural Network
          </h2>
        </div>
        <a
          href="https://github.com/Elliot-Sones/Digit-Classifier-from-scratch"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn self-start px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:text-accent"
        >
          View on GitHub
        </a>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
        {/* Canvas */}
        <MNISTCanvas onPredict={handlePredict} isLoading={isLoading} />

        {/* Results */}
        <div className="flex flex-col gap-6">
          <div className="pixel-card bg-background/40 p-6">
            <h3 className="font-display text-xl uppercase tracking-[0.12em]">
              Prediction Result
            </h3>

            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30">
                <p className="text-sm text-red-300">{error}</p>
                {isSleeping && (
                  <p className="mt-2 text-xs text-muted">
                    The HuggingFace Space is sleeping to save resources. It will wake up on the first request.
                  </p>
                )}
              </div>
            )}

            {prediction !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 text-center"
              >
                <span className="font-display text-7xl text-accent">
                  {prediction}
                </span>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted">
                  Predicted Digit
                </p>
              </motion.div>
            )}

            {!prediction && !error && (
              <p className="mt-4 text-sm text-muted">
                Draw a digit on the canvas and click &quot;Predict&quot; to see the neural network in action.
              </p>
            )}
          </div>

          {/* Confidence bars */}
          {confidences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pixel-card bg-background/40 p-6"
            >
              <h4 className="font-display text-lg uppercase tracking-[0.12em] mb-4">
                Confidence Scores
              </h4>
              <div className="space-y-3">
                {confidences
                  .sort((a, b) => b.confidence - a.confidence)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="w-6 text-right font-mono text-sm text-muted">
                        {item.label}
                      </span>
                      <div className="confidence-bar flex-1">
                        <div
                          className={`confidence-bar-fill ${index === 0 ? "top-prediction" : ""}`}
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono text-xs text-muted">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* About the project */}
          <div className="pixel-card bg-background/40 p-6">
            <h4 className="font-display text-lg uppercase tracking-[0.12em]">
              About This Project
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Built a neural network from scratch using only NumPy to classify handwritten digits.
              No TensorFlow, no PyTorch—just pure math and backpropagation.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Python", "NumPy", "MLP"].map((tech) => (
                <span
                  key={tech}
                  className="pixel-tag px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default function Home() {
  return (
    <div className="relative isolate">
      <CursorBall />
      <PitchProgress />
      <header className="fixed top-0 left-0 right-0 z-50 mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 uppercase text-[#f4ead5]">
        <nav className="mx-auto max-w-6xl pixel-border-soft flex items-center justify-between bg-card/80 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur">
          <span className="font-display text-lg tracking-[0.4em] ">
            Elliot Sones
          </span>
          <div className="hidden items-center gap-6 text-sm uppercase tracking-[0.25em] text-muted sm:flex">
            <a className="hover:text-accent transition-colors" href="#about">
              About
            </a>
            <a className="hover:text-accent transition-colors" href="#experience">
              Experience
            </a>
            <a className="hover:text-accent transition-colors" href="#projects">
              Projects
            </a>
            <a className="hover:text-accent transition-colors" href="#skills">
              Skills
            </a>
            <a className="hover:text-accent transition-colors" href="#mnist-demo">
              Project Demo
            </a>
          </div>
          <Link
            href="#contact"
            className="pixel-btn bg-foreground/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:text-accent"
          >
            Let&apos;s talk
          </Link>
        </nav>
      </header>
      <main
        // Anchor for scroll-based animations (hero → footer)
        className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 sm:px-6 lg:px-8 pt-48 pb-16 sm:gap-32 sm:pt-56 sm:pb-24"
      >
        {/* Hero intro */}
        <motion.section
          id="hero"
          className="pixel-border bg-card/80 p-4 sm:p-6 lg:p-10 shadow-xl shadow-black/10 backdrop-blur min-h-[50vh] flex flex-col justify-center"
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
                I am a Computer Scince Student at Toronto Metropolitan University. I love to building cool things with AI and Deep Learning!
              </p>
              {/* Social Links */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {/* GitHub */}
                <a
                  href="https://github.com/Elliot-Sones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pixel-card bg-background/30 p-3 transition hover:bg-background/50 hover:scale-110"
                  title="GitHub"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-accent transition-colors">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/elliot-sones/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pixel-card bg-background/30 p-3 transition hover:bg-background/50 hover:scale-110"
                  title="LinkedIn"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-accent transition-colors">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Resume */}
                <a
                  href="https://drive.google.com/file/d/1mv1yrWGmZp0d1NJmM8x8mINL1LVgvNuF/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pixel-card bg-background/30 p-3 transition hover:bg-background/50 hover:scale-110"
                  title="Resume"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-accent transition-colors">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/_elliot.sones_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pixel-card bg-background/30 p-3 transition hover:bg-background/50 hover:scale-110"
                  title="Instagram"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-accent transition-colors">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                {/* Email */}
                <a
                  href="mailto:soneselliot@gmail.com"
                  className="group pixel-card bg-background/30 p-3 transition hover:bg-background/50 hover:scale-110"
                  title="Email"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-accent transition-colors">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
                {/* Discord */}
                <a
                  href="https://discordapp.com/users/1362890550428176466"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group pixel-card bg-background/30 p-3 transition hover:bg-background/50 hover:scale-110"
                  title="Discord"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-muted group-hover:text-accent transition-colors">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
            <HeroCodingAnimation className="hidden md:block" />
          </div>
        </motion.section>
        {/* About / profile narrative */}
        <motion.section
          id="about"
          className="pixel-border grid gap-10 bg-card/75 p-4 sm:p-6 lg:p-10 backdrop-blur md:grid-cols-[1.2fr_0.8fr]"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
              About me
            </p>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
              When Im not coding...
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              When I am not coding, I love to play as much soccer as I can in my free time. I played soccer my whole life where I played in Portugal for one season.
            </p>
            <p className="mt-6 text-base leading-relaxed text-muted">
              When I&apos;m not playing soccer I love listening to music, watching anime, and hanging out with friends.
            </p>
            {/* Favorite Anime */}
            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-3">
                Favorite Anime
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="pixel-card bg-background/40 p-2 transition hover:bg-background/60 hover:scale-105">
                  <Image
                    src="/anime-onepiece.png"
                    alt="One Piece"
                    width={108}
                    height={108}
                    className="w-32 h-32 object-cover"
                  />
                  <p className="mt-1 text-xs text-center text-muted">One Piece</p>
                </div>
                <div className="pixel-card bg-background/40 p-2 transition hover:bg-background/60 hover:scale-105">
                  <Image
                    src="/anime-aot.png"
                    alt="Attack on Titan"
                    width={108}
                    height={108}
                    className="w-32 h-32 object-cover"
                  />
                  <p className="mt-1 text-xs text-center text-muted">Attack on Titan</p>
                </div>
                <div className="pixel-card bg-background/40 p-2 transition hover:bg-background/60 hover:scale-105">
                  <Image
                    src="/anime-jjk.png"
                    alt="Jujutsu Kaisen"
                    width={108}
                    height={108}
                    className="w-32 h-32 object-cover"
                  />
                  <p className="mt-1 text-xs text-center text-muted">Jujutsu Kaisen</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="https://www.playmakerstats.com/player/elliot-sones/1259756"
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-card bg-background/40 p-6 transition hover:bg-background/60"
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
            <div className="pixel-card bg-background/40 p-6">
              <h3 className="font-display text-xl uppercase tracking-[0.12em]">
                Music
              </h3>
              <div className="mt-4">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX9RwfGbeGQwP?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.section>
        {/* Hackathon experience */}
        <motion.section
          id="experience"
          className="pixel-border bg-card/80 p-4 sm:p-6 lg:p-10 backdrop-blur"
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
          </div>
          <HackathonList />
        </motion.section>
        {/* Work highlights + focus cards */}
        <motion.section
          id="projects"
          className="pixel-border bg-card/80 p-4 sm:p-6 lg:p-10 backdrop-blur"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                My projects
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                Personal Projects
              </h2>
            </div>
            <Link
              href="https://github.com/Elliot-Sones"
              className="pixel-btn self-start px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:text-accent"
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
                className="pixel-card group flex h-full flex-col justify-between bg-background/40 p-6 shadow-md shadow-black/10 transition hover:bg-background/60"
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
                      className="pixel-tag px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted"
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
                className="pixel-card bg-background/40 p-6 shadow-inner shadow-black/10"
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
          className="pixel-border bg-card/80 p-4 sm:p-6 lg:p-10 backdrop-blur"
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
                className="pixel-card bg-background/40 p-6 shadow-inner shadow-black/10"
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
                      className="pixel-tag px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </motion.section>
        {/* MNIST Digit Classifier Demo */}
        <MNISTDemo />
        {/* Contact / form */}
        <motion.section
          id="contact"
          className="pixel-border bg-card/85 p-4 sm:p-6 lg:p-10 backdrop-blur"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                Contact
              </p>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.1em] sm:text-4xl">
                Feel free to reach out!
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Feel free to reach out or discuss what you are working on!
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
              action="https://formsubmit.co/soneselliot@gmail.com"
              method="POST"
              className="pixel-card bg-background/45 p-6 shadow-lg shadow-black/10"
            >
              {/* FormSubmit configuration */}
              <input type="hidden" name="_subject" value="New message from your portfolio!" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <div className="flex flex-col gap-4">
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Name
                  <input
                    className="pixel-input mt-2 w-full bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Email
                  <input
                    className="pixel-input mt-2 w-full bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Any details?
                  <textarea
                    className="pixel-input mt-2 h-28 w-full resize-none bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition"
                    name="message"
                    placeholder="Tell me about the challenge you want to solve…"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="pixel-btn mt-2 w-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-background transition hover:brightness-110"
                >
                  Send message
                </button>
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
