"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionProps, Transition } from "framer-motion";
import RLSoccerGame from "@/components/RLSoccerGame";
import { ReadmeModal } from "@/components/ReadmeModal";

// Spotlight items for the "Currently exploring" cards
const focuses = [
  {
    title: "AI Agents",
    detail: "Building autonomous agents that can reason, plan, and take actions -- from RL-based game agents to tool-using LLM agents that solve real problems.",
  },
  {
    title: "Deep Learning & MLOps",
    detail: "Training models from scratch (transformers, CNNs, RNNs) and deploying them -- with a focus on reinforcement learning and attention mechanisms.",
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

// Certificates data
const certificates = [
  {
    title: "Machine Learning Specialization",
    image: "/certificates/ml-certificate.png",
    issuer: "Stanford Online & DeepLearning.AI",
    date: "2024",
    link: "https://coursera.org/share/c11e6b7d48feb1562c4f00e27cc5a918",
    skills: ["NumPy", "scikit-learn", "TensorFlow"],
    description: "Supervised learning, Advanced learning algorithms, Unsupervised learning, Recommenders, Reinforcement learning",
  },
  {
    title: "Python for Everybody",
    image: "/certificates/python-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/01bb7c66747ac3c22eb8dee7bf0ee71f",
    skills: ["Web Scraping", "SQL", "Data Processing"],
    description: "Python data structures, Web scraping, SQL, Data retrieval, processing, and visualization",
  },
  {
    title: "JavaScript Certificate",
    image: "/certificates/js-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/bbff1834c39f1aecfd3a04b534eee3d1",
    skills: ["JavaScript"],
    description: "Front-end dynamic websites development",
  },
  {
    title: "HTML5 Certificate",
    image: "/certificates/html-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/5acc063d1324a5f2105e65e168f8f70b",
    skills: ["HTML5"],
    description: "Front-end web development fundamentals",
  },
  {
    title: "CSS3 Certificate",
    image: "/certificates/css-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/b34968314e48535fe5bb123884f16711",
    skills: ["CSS3"],
    description: "Styling and layout for modern web pages",
  },
];

// Certificates Gallery Component with sliding bar and fullscreen view
const CertificatesGallery = () => {
  const [selectedCert, setSelectedCert] = useState<typeof certificates[0] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Scrollable slider */}
      <div className="relative mt-10">
        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-2 py-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {certificates.map((cert, index) => (
            <motion.button
              key={`${cert.title}-${index}`}
              onClick={() => setSelectedCert(cert)}
              className="glass-card-inner p-4 min-w-[280px] max-w-[280px] flex-shrink-0 cursor-pointer transition hover:bg-background/60 hover:scale-105 text-left"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -8 }}
            >
              <div className="relative w-full h-40 bg-background/30 overflow-hidden">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  sizes="280px"
                  className="object-cover object-top"
                />
              </div>
              <h3 className="mt-4 font-display text-lg tracking-[0.02em] text-foreground line-clamp-2">
                {cert.title}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted">
                {cert.issuer}
              </p>
              {/* Skills tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {cert.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="glass-tag px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                View details
                <span aria-hidden>↗</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Navigation arrows - centered at bottom */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => scroll("left")}
            className="glass-btn bg-background/60 px-4 py-3 text-accent hover:bg-background/80 transition text-2xl"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="glass-btn bg-background/60 px-4 py-3 text-accent hover:bg-background/80 transition text-2xl"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {/* Fullscreen Modal - rendered at body level via Portal */}
      {selectedCert && typeof document !== 'undefined' && createPortal(
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-8 bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedCert(null)}
        >
          {/* Close button at top */}
          <div className="absolute top-6 right-8">
            <button
              onClick={() => setSelectedCert(null)}
              className="text-white/80 text-sm uppercase tracking-[0.3em] hover:text-white transition"
            >
              Close ✕
            </button>
          </div>

          {/* Certificate Image - takes up most of screen */}
          <motion.div
            className="w-full max-w-[90vw] max-h-[75vh] flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedCert.image}
              alt={selectedCert.title}
              width={1400}
              height={1000}
              className="max-w-full max-h-[75vh] w-auto h-auto object-contain"
            />
          </motion.div>

          {/* Certificate Info below image */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl tracking-[0.02em] text-white">
              {selectedCert.title}
            </h3>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-white/60">
              {selectedCert.issuer} • {selectedCert.date}
            </p>

            {/* Skills */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {selectedCert.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent border border-accent/40"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* View on Coursera button */}
            <div className="mt-6">
              <a
                href={selectedCert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent border border-accent/40 hover:bg-accent/10 transition"
              >
                Verify on Coursera ↗
              </a>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </>
  );
};

// Section entrance animations - varied for visual interest
const fadeTransition: Transition = { duration: 0.7, ease: "easeOut" };
const fadeConfig: MotionProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: fadeTransition,
};

const fadeLeft: MotionProps = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: fadeTransition,
};

const fadeScale: MotionProps = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: false, amount: 0.2 },
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
            className={`glass-card-inner p-6 overflow-hidden ${hackathon.outcome ? "accent-stripe-gold" : "accent-stripe-green"}`}
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
                    <div className="glass-card-inner p-2 w-16 h-16 flex-shrink-0 flex items-center justify-center">
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
                    <h3 className="font-display text-2xl tracking-[0.02em] text-foreground">
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
                  <p className="text-xs uppercase tracking-[0.25em] badge-gold font-semibold">
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
                <div className="glass-card-inner p-2 w-full lg:w-80 h-48 lg:h-64 flex-shrink-0 overflow-hidden group">
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
            className="glass-btn bg-background/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:text-accent hover:bg-background/60"
          >
            {showAll ? "Show Less" : `View All Experiences (${hackathons.length})`}
          </button>
        </motion.div>
      )}
    </>
  );
};

// Project type for dynamic fetching
interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  repo: string;
  image?: string;
}

// Fallback projects in case API fails
const fallbackProjects: Project[] = [
  {
    title: "Neural Network Fundamental",
    description:
      "This projects builds the fundamental neural network architectures including, multilayer perceptron, Convolutional Neural Networks and Recurrent Neural Network.",
    tech: ["Python", "Numpy", "TensorFlow"],
    link: "https://github.com/Elliot-Sones/Neural_Networks_Fundamentals",
    repo: "Elliot-Sones/Neural_Networks_Fundamentals",
  },
  {
    title: "Machine Translator",
    description:
      "In this project, I replicated the 'Transformer' model from the research paper 'Attention is all you need' to build a machine translator from English to French.",
    tech: ["Transformer", "Self Attention", "TensorFlow", "Python"],
    link: "https://github.com/Elliot-Sones/Transformers",
    repo: "Elliot-Sones/Transformers",
  },
  {
    title: "RL AI 2D Fighting agent",
    description:
      "In this project I trained a RL PPO model to play against a 2d fighting game",
    tech: ["machine learning", "Python", "Neural Networks"],
    link: "https://github.com/Elliot-Sones/AI_2",
    repo: "Elliot-Sones/AI_2",
  },
];

// Projects section component with README modal - fetches pinned repos from GitHub
const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);

  // Fetch pinned repos on mount
  useEffect(() => {
    const fetchPinnedRepos = async () => {
      try {
        const response = await fetch("/api/pinned-repos");
        const data = await response.json();

        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Failed to fetch pinned repos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPinnedRepos();
  }, []);

  return (
    <>
      {/* Projects grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="glass-card-inner flex flex-col p-4 animate-pulse"
              >
                <div className="h-44 bg-muted/20 mb-4" />
                <div className="h-6 bg-muted/20 w-3/4 mb-3" />
                <div className="h-4 bg-muted/20 w-full mb-2" />
                <div className="h-4 bg-muted/20 w-5/6" />
                <div className="mt-4 flex gap-2">
                  <div className="h-6 bg-muted/20 w-16" />
                  <div className="h-6 bg-muted/20 w-20" />
                </div>
              </div>
            ))
          : projects.map((project, index) => (
              <motion.button
                key={project.title}
                onClick={() => setSelectedProject(project)}
                className="glass-card-inner group flex flex-col p-4 cursor-pointer transition hover:bg-background/60 text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ y: -6 }}
              >
                {/* Project Image */}
                <div className="relative w-full h-44 bg-background/30 overflow-hidden mb-4">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted/40">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <h3 className="font-display text-xl tracking-[0.02em] text-foreground line-clamp-2">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                  {project.description || "Explore this project on GitHub for details."}
                </p>

                {/* Tech Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="glass-tag px-2 py-1 text-xs uppercase tracking-[0.2em] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="px-2 py-1 text-xs text-muted/60">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>

                {/* View README link */}
                <div className="mt-auto pt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition group-hover:gap-3">
                  View README
                  <span aria-hidden>→</span>
                </div>
              </motion.button>
            ))}
      </div>

      <ReadmeModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
};


export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative isolate">
      <PitchProgress />
      <header className="fixed top-0 left-0 right-0 z-50 mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 uppercase text-[#f4ead5]">
        <nav className="mx-auto max-w-6xl glass-nav flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <span className="font-display text-lg tracking-[0.2em] font-bold">
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
            <a className="hover:text-accent transition-colors" href="#certificates">
              Certificates
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden text-foreground/80 text-xl p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "\u2715" : "\u2630"}
            </button>
            <Link
              href="#contact"
              className="glass-btn px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:text-accent whitespace-nowrap"
            >
              Let&apos;s talk
            </Link>
          </div>
        </nav>
        {mobileMenuOpen && (
          <motion.div
            className="sm:hidden glass-card-inner mx-4 mt-2 p-4 flex flex-col gap-3 text-sm uppercase tracking-[0.25em] text-muted"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <a className="hover:text-accent transition-colors py-2" href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a className="hover:text-accent transition-colors py-2" href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
            <a className="hover:text-accent transition-colors py-2" href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a className="hover:text-accent transition-colors py-2" href="#certificates" onClick={() => setMobileMenuOpen(false)}>Certificates</a>
          </motion.div>
        )}
      </header>
      <main
        // Anchor for scroll-based animations (hero → footer)
        className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:px-8 pt-48 pb-16 sm:gap-20 sm:pt-56 sm:pb-24"
      >
        {/* Hero intro */}
        <motion.section
          id="hero"
          className="glass-card glass-card-hero p-4 sm:p-6 lg:p-10 shadow-2xl shadow-black/20 min-h-[50vh] flex flex-col justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-6 text-left">
              <motion.p
                className="font-display text-5xl tracking-[0.02em] font-bold gradient-text sm:text-6xl md:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0, duration: 0.6, ease: "easeOut" }}
              >
                Elliot Sones
              </motion.p>
              <motion.p
                className="text-base tracking-[0.2em] text-accent uppercase font-semibold sm:text-lg"
                style={{ textShadow: "0 0 30px var(--glow)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              >
                ML Engineer & CS Student
              </motion.p>
              <motion.p
                className="max-w-xl text-base leading-relaxed text-muted sm:text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              >
                Computer Science student at Toronto Metropolitan University building intelligent agents and deep learning systems. Focused on reinforcement learning, transformer architectures, and applied AI.
              </motion.p>
              {/* Social Links — compact row */}
              <motion.div
                className="flex flex-wrap items-center gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              >
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="glass-tag px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-muted transition hover:text-accent hover:border-accent/60"
                  >
                    {social.label}
                  </a>
                ))}
              </motion.div>
            </div>
            <RLSoccerGame className="hidden md:block" />
          </div>

        </motion.section>
        {/* About / profile narrative */}
        <motion.section
          id="about"
          className="glass-card grid gap-10 p-4 sm:p-6 lg:p-10 md:grid-cols-[1.2fr_0.8fr]"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
              About me
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-[0.02em] sm:text-4xl">
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
                <div className="glass-card-inner p-2 transition hover:bg-background/60 hover:scale-105">
                  <Image
                    src="/anime-onepiece.png"
                    alt="One Piece"
                    width={108}
                    height={108}
                    className="w-32 h-32 object-cover"
                  />
                  <p className="mt-1 text-xs text-center text-muted">One Piece</p>
                </div>
                <div className="glass-card-inner p-2 transition hover:bg-background/60 hover:scale-105">
                  <Image
                    src="/anime-aot.png"
                    alt="Attack on Titan"
                    width={108}
                    height={108}
                    className="w-32 h-32 object-cover"
                  />
                  <p className="mt-1 text-xs text-center text-muted">Attack on Titan</p>
                </div>
                <div className="glass-card-inner p-2 transition hover:bg-background/60 hover:scale-105">
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
              className="glass-card-inner p-6 transition hover:bg-background/60"
            >
              <h3 className="font-display text-xl tracking-[0.02em]">
                Soccer
              </h3>
              <Image
                src="/elliot-lank.JPG"
                alt="Soccer"
                width={320}
                height={320}
                className="w-50 h-50 rounded-lg object-cover mx-auto"
              />
            </a>
            <div className="glass-card-inner p-6">
              <h3 className="font-display text-xl tracking-[0.02em]">
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
          className="glass-card p-4 sm:p-6 lg:p-10"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeLeft}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                Experience
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-[0.02em] sm:text-4xl">
                Work & Hackathons
              </h2>
            </div>
          </div>
          <HackathonList />
        </motion.section>
        {/* Work highlights + focus cards */}
        <motion.section
          id="projects"
          className="glass-card p-4 sm:p-6 lg:p-10"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                My projects
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-[0.02em] sm:text-4xl">
                Personal Projects
              </h2>
            </div>
            <Link
              href="https://github.com/Elliot-Sones"
              className="glass-btn self-start px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition hover:text-accent"
            >
              Explore GitHub
            </Link>
          </div>
          <ProjectsSection />
          <div className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6">
              Currently exploring
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {focuses.map((focus) => (
                <motion.article
                  key={focus.title}
                  className="glass-card-inner p-6 shadow-inner shadow-black/10"
                  style={{ borderLeft: "4px solid var(--accent)" }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.35 }}
                >
                  <h3 className="font-display text-xl tracking-[0.02em] text-accent">
                    {focus.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {focus.detail}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>
        {/* Certificates section */}
        <motion.section
          id="certificates"
          className="glass-card glass-card-gold p-4 sm:p-6 lg:p-10"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeScale}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                Certifications
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-[0.02em] sm:text-4xl">
                Certificates & Credentials
              </h2>
            </div>
            <p className="max-w-sm self-start text-xs uppercase tracking-[0.25em] text-muted">
              Click on any certificate to view it in full screen.
            </p>
          </div>
          <CertificatesGallery />
        </motion.section>
        {/* Contact / form */}
        <motion.section
          id="contact"
          className="glass-card p-4 sm:p-6 lg:p-10"
          style={{ scrollMarginTop: "20vh" }}
          {...fadeConfig}
        >
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">
                Contact
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-[0.02em] sm:text-4xl">
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
              className="glass-card-inner p-6 shadow-lg shadow-black/10"
            >
              {/* FormSubmit configuration */}
              <input type="hidden" name="_subject" value="New message from your portfolio!" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <div className="flex flex-col gap-4">
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Name
                  <input
                    className="glass-input mt-2 w-full bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Email
                  <input
                    className="glass-input mt-2 w-full bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.3em] text-muted">
                  Any details?
                  <textarea
                    className="glass-input mt-2 h-28 w-full resize-none bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition"
                    name="message"
                    placeholder="Tell me about the challenge you want to solve…"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="glass-btn mt-2 w-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-background transition hover:brightness-110"
                >
                  Send message
                </button>
              </div>
            </form>
          </div>
        </motion.section>
      </main>
      <footer className="mx-auto w-full max-w-5xl px-6 pb-16 text-xs uppercase tracking-[0.35em] text-muted">
        © {new Date().getFullYear()} Elliot Sones
      </footer>
    </div>
  );
}
