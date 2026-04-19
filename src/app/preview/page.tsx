"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RLSoccerGame from "@/components/RLSoccerGame";

// ——— Shared data (copied from home page, unchanged) ———————————————————

const focuses = [
  {
    title: "AI Agents",
    detail:
      "Building autonomous agents that can reason, plan, and take actions -- from RL-based game agents to tool-using LLM agents that solve real problems.",
  },
  {
    title: "Deep Learning & MLOps",
    detail:
      "Training models from scratch (transformers, CNNs, RNNs) and deploying them -- with a focus on reinforcement learning and attention mechanisms.",
  },
];

const hackathons = [
  {
    slug: "splxutspan-2026",
    name: "SPLxUTSPAN 2026 Data Challenge",
    project: "Free Throw Prediction from Motion Capture",
    date: "February 2026",
    logo: "/experience/spl_logo.png",
    image: "/experience/spl_image.png",
    outcome: "Won 1st Place",
    git: "https://github.com/Elliot-Sones/SPLxUTSPAN-2026-Data-Challenge",
    description:
      "Kaggle competition predicting basketball free throw outcomes from 69-joint motion capture data. Built per-player biomechanical models, temporal commitment analysis, kinetic chain features, and CNN ensembles to achieve 0.006148 MSE.",
    link: "https://www.kaggle.com/competitions/spl-utspan-data-challenge-2026",
  },
  {
    slug: "hack-canada-2026",
    name: "Hack Canada 2026",
    project: "CoCivil — Land Development Due Diligence Platform",
    date: "March 2026",
    logo: "/experience/cocivil_logo.svg",
    image: "",
    outcome: "Won Google Studio AI",
    git: "https://github.com/Elliot-Sones/Hack_Canada",
    description:
      "Built a full-stack due diligence platform for Toronto land development. Generates planning submission packages from a plain-English query using AI, zoning analysis, 3D massing, and RAG-powered policy search.",
    link: "https://cocivils.com",
  },
  {
    slug: "ntangible",
    name: "NTangible",
    project: "Machine Learning Research Intern",
    date: "November 2025",
    logo: "/experience/ntangible_logo.png",
    image: "",
    outcome: "",
    git: "",
    description:
      "Supporting the technical team on exploring real-world applications of AI/ML in sports psychology, combining technical development with performance analytics.",
    link: "",
  },
  {
    slug: "uoft-anthropic",
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
    slug: "mues-2025",
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
    slug: "pond-2025",
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

const socials = [
  { label: "GitHub", href: "https://github.com/Elliot-Sones" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elliot-sones/" },
  { label: "Resume", href: "https://drive.google.com/file/d/1mv1yrWGmZp0d1NJmM8x8mINL1LVgvNuF/view?usp=drive_link" },
  { label: "Instagram", href: "https://www.instagram.com/_elliot.sones_/" },
  { label: "Discord", href: "https://discordapp.com/users/1362890550428176466" },
  { label: "Email", href: "mailto:soneselliot@gmail.com" },
];

const certificates = [
  {
    slug: "ml-specialization",
    title: "Machine Learning Specialization",
    image: "/certificates/ml-certificate.png",
    issuer: "Stanford Online & DeepLearning.AI",
    date: "2024",
    link: "https://coursera.org/share/c11e6b7d48feb1562c4f00e27cc5a918",
    skills: ["NumPy", "scikit-learn", "TensorFlow"],
  },
  {
    slug: "python-for-everybody",
    title: "Python for Everybody",
    image: "/certificates/python-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/01bb7c66747ac3c22eb8dee7bf0ee71f",
    skills: ["Web Scraping", "SQL", "Data Processing"],
  },
  {
    slug: "javascript-certificate",
    title: "JavaScript Certificate",
    image: "/certificates/js-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/bbff1834c39f1aecfd3a04b534eee3d1",
    skills: ["JavaScript"],
  },
  {
    slug: "html5-certificate",
    title: "HTML5 Certificate",
    image: "/certificates/html-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/5acc063d1324a5f2105e65e168f8f70b",
    skills: ["HTML5"],
  },
  {
    slug: "css3-certificate",
    title: "CSS3 Certificate",
    image: "/certificates/css-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/b34968314e48535fe5bb123884f16711",
    skills: ["CSS3"],
  },
];

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  repo: string;
  image?: string;
  slug?: string;
}

const fallbackProjects: Project[] = [
  {
    slug: "neural-networks-fundamentals",
    title: "Neural Network Fundamentals",
    description:
      "MLP, CNN, and RNN architectures built from scratch to demystify every layer and gradient.",
    tech: ["Python", "NumPy", "TensorFlow"],
    link: "https://github.com/Elliot-Sones/Neural_Networks_Fundamentals",
    repo: "Elliot-Sones/Neural_Networks_Fundamentals",
  },
  {
    slug: "transformers",
    title: "Machine Translator",
    description:
      "Re-implemented 'Attention is all you need' end-to-end to translate English to French.",
    tech: ["Transformer", "Self Attention", "TensorFlow", "Python"],
    link: "https://github.com/Elliot-Sones/Transformers",
    repo: "Elliot-Sones/Transformers",
  },
  {
    slug: "rl-fighting-agent",
    title: "RL AI 2D Fighting Agent",
    description: "PPO trained through self-play against a 2D fighting game environment.",
    tech: ["Machine Learning", "Python", "Neural Networks"],
    link: "https://github.com/Elliot-Sones/AI_2",
    repo: "Elliot-Sones/AI_2",
  },
];

// ——— Reusable redesigned bits ———————————————————————————————————

function SectionHead({
  number,
  label,
  title,
  right,
}: {
  number: string;
  label: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 mb-10 border-b border-white/10">
      <div>
        <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[var(--accent)] flex items-center gap-3">
          <span className="w-6 h-px bg-[var(--accent)]" />
          {number} / {label}
        </div>
        <h2 className="font-[family-name:var(--font-bebas)] text-4xl sm:text-5xl tracking-[0.01em] text-[#f4ead5] mt-3 leading-none">
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

// ——— Page ——————————————————————————————————————————————————————————————

export default function PreviewHome() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    fetch("/api/pinned-repos")
      .then((r) => r.json())
      .then((d) => {
        if (d.projects?.length) {
          const withSlugs = d.projects.map((p: Project) => ({
            ...p,
            slug: p.repo?.split("/")[1]?.toLowerCase().replace(/_/g, "-") || p.title.toLowerCase().replace(/\s+/g, "-"),
          }));
          setProjects(withSlugs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      {/* Preview banner */}
      <div className="bg-[#00e87b]/10 border-b border-[#00e87b]/30 text-[#00e87b] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-center py-2.5">
        Preview build · /preview · content unchanged · UI redesigned
      </div>

      {/* ——— NAV ——— */}
      <header className="fixed top-2 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-[#0a1410]/80 backdrop-blur-xl border border-white/[0.06]">
          <div className="font-[family-name:var(--font-bebas)] text-lg tracking-[0.18em] text-[#f4ead5]">
            ELLIOT SONES
          </div>
          <div className="hidden md:flex items-center gap-7 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/60">
            <a href="#about" className="hover:text-[#00e87b] transition">About</a>
            <a href="#experience" className="hover:text-[#00e87b] transition">Experience</a>
            <a href="#projects" className="hover:text-[#00e87b] transition">Projects</a>
            <a href="#github" className="hover:text-[#00e87b] transition">GitHub</a>
            <a href="#certificates" className="hover:text-[#00e87b] transition">Certificates</a>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#00e87b]/10 border border-[#00e87b]/30 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.15em] uppercase text-[#00e87b]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00e87b] opacity-60 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00e87b]"></span>
            </span>
            <span>LIVE</span>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20">

        {/* ——— HERO ——— */}
        <section id="hero" className="grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center min-h-[60vh] pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3 mb-6">
              <span className="w-7 h-px bg-[#00e87b]" />
              RL · ML · APPLIED AI
            </div>
            <h1 className="font-[family-name:var(--font-bebas)] text-7xl sm:text-8xl tracking-[0.01em] text-[#f4ead5] leading-[0.88] mb-5">
              Elliot<br />Sones.
            </h1>
            <div
              className="font-[family-name:var(--font-jbmono)] text-sm tracking-[0.2em] uppercase text-[#00e87b] mb-6"
              style={{ textShadow: "0 0 20px rgba(0, 232, 123, 0.35)" }}
            >
              ML Engineer &amp; CS Student
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-white/70 max-w-xl mb-8">
              Computer Science student at Toronto Metropolitan University building intelligent agents and deep learning systems. Focused on reinforcement learning, transformer architectures, and applied AI.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="px-3.5 py-1.5 rounded-full border border-white/15 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-[#00e87b] hover:border-[#00e87b]/60 hover:bg-[#00e87b]/5 transition"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>

          <div className="hidden md:block">
            <div className="rounded-2xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl p-4">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/50">
                <span>RL Soccer · Live</span>
                <span className="text-[#00e87b]">Interactive</span>
              </div>
              <RLSoccerGame />
            </div>
          </div>
        </section>

        {/* ——— ABOUT ——— */}
        <section id="about" className="py-16" style={{ scrollMarginTop: "15vh" }}>
          <SectionHead number="01" label="About" title="When I'm not coding." />
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-10">
            <div>
              <p className="text-lg leading-relaxed text-white/75 mb-5">
                When I am not coding, I love to play as much soccer as I can in my free time. I played soccer my whole life where I played in Portugal for one season.
              </p>
              <p className="text-lg leading-relaxed text-white/75 mb-8">
                When I&apos;m not playing soccer I love listening to music, watching anime, and hanging out with friends.
              </p>
              <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-white/50 mb-4">
                Favorite Anime
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { src: "/anime-onepiece.png", label: "One Piece" },
                  { src: "/anime-aot.png", label: "Attack on Titan" },
                  { src: "/anime-jjk.png", label: "Jujutsu Kaisen" },
                ].map((a) => (
                  <div key={a.label} className="group relative rounded-lg overflow-hidden border border-white/10">
                    <Image src={a.src} alt={a.label} width={128} height={128} className="w-32 h-32 object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.15em] uppercase text-white/90">{a.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href="https://www.playmakerstats.com/player/elliot-sones/1259756"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl p-5 hover:border-[#00e87b]/40 transition"
              >
                <div className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.04em] text-[#f4ead5]">SOCCER</div>
                <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1">Portugal · Club system</div>
                <div className="mt-4 overflow-hidden rounded-lg">
                  <Image src="/elliot-lank.jpg" alt="Soccer" width={320} height={320} className="w-full h-48 object-cover" />
                </div>
              </a>
              <div className="rounded-xl border border-white/10 bg-[#0a1410]/60 backdrop-blur-xl p-5">
                <div className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.04em] text-[#f4ead5]">MUSIC</div>
                <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1 mb-3">What I code to</div>
                <iframe
                  style={{ borderRadius: "8px" }}
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
        </section>

        {/* ——— EXPERIENCE ——— */}
        <section id="experience" className="py-16" style={{ scrollMarginTop: "15vh" }}>
          <SectionHead number="02" label="Experience" title="Work & Hackathons." />
          <div className="flex flex-col gap-4">
            {hackathons.slice(0, 3).map((h) => (
              <Link
                key={h.slug}
                href={`/preview/experience/${h.slug}`}
                className={`grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-6 items-start p-6 rounded-r-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 hover:border-white/15 transition group ${h.outcome ? "border-l-[3px] border-l-[#fbbf24]" : "border-l-[3px] border-l-[#00e87b]"}`}
              >
                <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-white/50 pt-1">
                  {h.date}
                </div>
                <div>
                  <div className="font-[family-name:var(--font-bebas)] text-2xl tracking-[0.02em] text-[#f4ead5] mb-1 group-hover:text-[#00e87b] transition">
                    {h.name}
                  </div>
                  {h.project && (
                    <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.15em] uppercase text-white/50 mb-3">
                      {h.project}
                    </div>
                  )}
                  {h.outcome && (
                    <div
                      className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.2em] uppercase text-[#fbbf24] font-semibold mb-3"
                      style={{ textShadow: "0 0 12px rgba(251, 191, 36, 0.35)" }}
                    >
                      ★ {h.outcome}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-white/70 max-w-2xl">{h.description}</p>
                </div>
                {h.image && (
                  <div className="w-full md:w-48 aspect-[3/2] overflow-hidden rounded-lg border border-white/5">
                    <Image src={h.image} alt={h.name} width={192} height={128} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="px-6 py-2.5 rounded-lg border border-white/15 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-[#00e87b] hover:border-[#00e87b]/40 transition">
              View All ({hackathons.length})
            </button>
          </div>
        </section>

        {/* ——— PROJECTS ——— */}
        <section id="projects" className="py-16" style={{ scrollMarginTop: "15vh" }}>
          <SectionHead
            number="03"
            label="Projects"
            title="Personal Projects."
            right={
              <a
                href="https://github.com/Elliot-Sones"
                className="self-start px-4 py-2 rounded-lg border border-white/15 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-[#00e87b] hover:border-[#00e87b]/40 transition"
              >
                Explore GitHub ↗
              </a>
            }
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((p) => (
              <Link
                key={p.title}
                href={`/preview/projects/${p.slug || p.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group rounded-xl overflow-hidden border border-white/5 bg-[#0a1410]/60 backdrop-blur-xl hover:border-[#00e87b]/30 hover:-translate-y-1 transition"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-[#00e87b]/5 to-[#0a1410]/80 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <Image src={p.image} alt={p.title} width={400} height={225} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-white/30">{p.repo}</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.02em] text-[#f4ead5] mb-2 group-hover:text-[#00e87b] transition">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/65 mb-4 line-clamp-3 min-h-[3.8em]">
                    {p.description || "Explore this project on GitHub for details."}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tech.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.1em] uppercase text-white/50 bg-white/5 border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-[#00e87b]">
                    Read case study →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5">
              Currently exploring
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {focuses.map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-r-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 border-l-[3px] border-l-[#00e87b]"
                >
                  <div className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.03em] text-[#00e87b] mb-2">
                    {f.title}
                  </div>
                  <p className="text-sm leading-relaxed text-white/70">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ——— GITHUB (NEW) ——— */}
        <section id="github" className="py-16" style={{ scrollMarginTop: "15vh" }}>
          <SectionHead number="04" label="GitHub" title="Building in public." />
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 flex items-center justify-center">
              <img
                src="https://streak-stats.demolab.com?user=Elliot-Sones&theme=dark&hide_border=true&background=0a1410&stroke=f4ead5&ring=00e87b&fire=00e87b&currStreakLabel=00e87b&sideLabels=f4ead5&sideNums=f4ead5&currStreakNum=f4ead5&dates=f4ead5"
                alt="GitHub streak stats"
                className="w-full max-w-md"
              />
            </div>
            <div className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 flex items-center justify-center">
              <img
                src="https://github-readme-stats.vercel.app/api?username=Elliot-Sones&show_icons=true&theme=dark&hide_border=true&bg_color=0a1410&title_color=00e87b&text_color=f4ead5&icon_color=00e87b"
                alt="GitHub stats"
                className="w-full max-w-md"
              />
            </div>
          </div>
          <div className="mt-5 p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/5 flex items-center justify-center overflow-x-auto">
            <img
              src="https://ghchart.rshah.org/00e87b/Elliot-Sones"
              alt="GitHub contribution grid"
              className="w-full max-w-5xl"
              style={{ filter: "brightness(1.1)" }}
            />
          </div>
        </section>

        {/* ——— CERTIFICATES ——— */}
        <section id="certificates" className="py-16" style={{ scrollMarginTop: "15vh" }}>
          <SectionHead
            number="05"
            label="Certificates"
            title="Credentials."
            right={
              <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 max-w-xs">
                Click any certificate to view the full credential.
              </div>
            }
          />
          <div className="flex gap-4 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
            {certificates.map((c) => (
              <Link
                key={c.slug}
                href={`/preview/certificates/${c.slug}`}
                className="flex-shrink-0 w-72 rounded-xl overflow-hidden border border-[#fbbf24]/15 bg-[#0a1410]/60 backdrop-blur-xl hover:border-[#fbbf24]/40 hover:-translate-y-1 transition group"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[#fbbf24]/8 to-[#0a1410]/80 overflow-hidden">
                  <Image src={c.image} alt={c.title} width={288} height={216} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-bebas)] text-lg tracking-[0.02em] text-[#f4ead5] leading-tight mb-1.5 line-clamp-2">
                    {c.title}
                  </h3>
                  <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.18em] uppercase text-white/50 mb-3">
                    {c.issuer} · {c.date}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {c.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.1em] uppercase text-[#fbbf24] border border-[#fbbf24]/25">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ——— CONTACT ——— */}
        <section id="contact" className="py-16" style={{ scrollMarginTop: "15vh" }}>
          <SectionHead number="06" label="Contact" title="Reach out." />
          <div className="grid md:grid-cols-[1fr_1fr] gap-10">
            <div>
              <p className="text-lg leading-relaxed text-white/75 mb-8">
                Feel free to reach out or discuss what you are working on.
              </p>
              <div className="flex flex-wrap gap-5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="font-[family-name:var(--font-jbmono)] text-xs tracking-[0.25em] uppercase text-white/60 hover:text-[#00e87b] transition"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <form
              action="https://formsubmit.co/soneselliot@gmail.com"
              method="POST"
              className="p-6 rounded-xl bg-[#0a1410]/60 backdrop-blur-xl border border-white/10"
            >
              <input type="hidden" name="_subject" value="New message from your portfolio!" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <div className="mb-4">
                <label className="block font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 mb-1.5">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="w-full px-3 py-2.5 rounded-md bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 rounded-md bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition"
                />
              </div>
              <div className="mb-5">
                <label className="block font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-white/50 mb-1.5">Any details?</label>
                <textarea
                  name="message"
                  placeholder="Tell me what you're working on."
                  rows={4}
                  required
                  className="w-full px-3 py-2.5 rounded-md bg-black/30 border border-white/10 text-sm text-[#f4ead5] outline-none focus:border-[#00e87b]/60 transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#00e87b] text-[#0a1410] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase font-bold hover:brightness-110 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

      </main>

      <footer className="mx-auto max-w-6xl px-8 py-8 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-white/30 text-center border-t border-white/5">
        © 2026 Elliot Sones · Preview
      </footer>
    </div>
  );
}
