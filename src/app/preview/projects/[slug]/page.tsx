"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Nav, PageFooter } from "../../_components/Nav";

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  repo: string;
  image?: string;
}

const slugify = (s: string) => s.toLowerCase().replace(/_/g, "-");

// Static case study for the RL Soccer project (embedded demo component)
const RL_SOCCER: Project = {
  title: "RL Soccer Agent",
  description:
    "A PPO agent trained to play soccer from a custom 2D environment — the one you can play against on the home page.",
  tech: ["PyTorch", "Gymnasium", "Canvas", "Python"],
  link: "https://github.com/Elliot-Sones",
  repo: "Elliot-Sones/RL-Soccer",
};

const RL_SOCCER_README = `# Teaching an Agent to Play Soccer

## The Problem
Most RL tutorials stop at CartPole. I wanted something I could actually watch — an agent that has to learn spatial reasoning, timing, and long-horizon credit assignment. Soccer felt right: simple enough to simulate, hard enough to mean something when it works.

## The Environment
Built a 2D pitch in Canvas with ball physics, goal posts, and a simple opponent. Observation space is 84-dim: positions, velocities, ball state, distances to goals. Action space is continuous — movement + kick intensity.

## Reward Shaping (Why It Kept Failing)
First reward: +1 for scoring, 0 otherwise. The agent never learned — the sparse signal meant thousands of episodes with no gradient.

Fix: a three-stage curriculum. First reward touching the ball. Then reward moving the ball toward the goal. Then reward scoring. Each stage unlocks when the prior one converges.

## What I Learned
Reward shaping matters more than algorithm choice at this scale. What took the agent from dribbling randomly to scoring on purpose was staring at episode recordings for an hour and realizing it wasn't even aiming — added a cosine-angle term and the curve climbed the next day.

## Try It
The agent is live on the home page. Switch from "Training" to "1v1" and play against the final policy — every game you play is a real forward pass through the network.
`;

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Special case: our embedded RL soccer demo
      if (slug === "rl-soccer") {
        setProject(RL_SOCCER);
        setReadme(RL_SOCCER_README);
        setLoading(false);
        return;
      }

      try {
        // Find the matching pinned repo
        const res = await fetch("/api/pinned-repos");
        const data = await res.json();
        const projects: Project[] = data.projects ?? [];
        const match = projects.find(
          (p) => slugify(p.repo.split("/")[1]) === slug || slugify(p.title) === slug,
        );
        if (cancelled) return;

        if (!match) {
          setError("Project not found.");
          setLoading(false);
          return;
        }
        setProject(match);

        // Fetch README
        const [owner, repo] = match.repo.split("/");
        const readmeRes = await fetch(`/api/readme?owner=${owner}&repo=${repo}`);
        if (cancelled) return;
        if (readmeRes.ok) {
          const rd = await readmeRes.json();
          setReadme(rd.content);
        } else {
          setReadme(null);
        }
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(244,234,213,1) 0, rgba(244,234,213,1) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <Nav />

      <main className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20">
        <Link
          href="/preview/projects"
          className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 hover:text-[#00e87b] transition mb-8 inline-block"
        >
          ← All projects
        </Link>

        {loading && (
          <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 animate-pulse">
            Loading project…
          </div>
        )}

        {error && !loading && (
          <div className="p-6 rounded-md border border-red-500/20 bg-red-500/5 text-red-400 font-[family-name:var(--font-jbmono)] text-sm">
            {error}
          </div>
        )}

        {project && !loading && (
          <>
            <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.3em] uppercase text-[#00e87b] flex items-center gap-3 mb-4">
              <span className="w-7 h-px bg-[#00e87b]" />
              Case Study · {project.repo}
            </div>
            <h1
              className="font-[family-name:var(--font-bricolage)] text-[#f4ead5] leading-[0.92] tracking-[-0.03em] mb-5"
              style={{
                fontSize: "clamp(2.75rem, 6vw, 5rem)",
                fontVariationSettings: '"wdth" 80, "wght" 700',
              }}
            >
              {project.title}
              <span className="text-[#00e87b]">.</span>
            </h1>
            <p
              className="font-[family-name:var(--font-fraunces)] italic text-[#f4ead5]/80 text-lg sm:text-xl leading-[1.45] mb-8 max-w-2xl"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              {project.description || "Exploring this project via its GitHub README."}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-sm font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.15em] uppercase text-[#f4ead5]/70 bg-white/5 border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-8 py-5 border-y border-white/10 mb-10 font-[family-name:var(--font-jbmono)] text-xs">
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-white/40">Repo</div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00e87b] hover:underline mt-1 inline-block"
                >
                  {project.repo} ↗
                </a>
              </div>
              {slug === "rl-soccer" && (
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-white/40">Live demo</div>
                  <Link href="/preview" className="text-[#00e87b] hover:underline mt-1 inline-block">
                    Play on home ↗
                  </Link>
                </div>
              )}
            </div>

            {/* Banner image from GitHub OG (if available) */}
            {project.image && (
              <div className="aspect-video rounded-md border border-white/10 bg-[#0a1410]/40 overflow-hidden mb-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* README markdown */}
            {readme ? (
              <>
                <style jsx global>{`
                  .markdown-readme { color: rgba(244, 234, 213, 0.85); font-size: 16px; line-height: 1.7; }
                  .markdown-readme h1 { font-family: var(--font-bricolage); font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin: 2rem 0 1rem; color: #f4ead5; line-height: 1.1; }
                  .markdown-readme h2 { font-family: var(--font-bricolage); font-size: 1.5rem; font-weight: 650; letter-spacing: -0.01em; margin: 2.5rem 0 0.75rem; color: #f4ead5; padding-bottom: 0.4rem; border-bottom: 1px solid rgba(244,234,213,0.1); }
                  .markdown-readme h3 { font-family: var(--font-bricolage); font-size: 1.2rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #f4ead5; }
                  .markdown-readme p { margin: 0 0 1.1rem; color: rgba(244, 234, 213, 0.75); }
                  .markdown-readme ul, .markdown-readme ol { margin: 0 0 1.25rem 1.5rem; color: rgba(244, 234, 213, 0.75); }
                  .markdown-readme li { margin-bottom: 0.4rem; }
                  .markdown-readme a { color: #00e87b; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
                  .markdown-readme a:hover { color: #f4ead5; }
                  .markdown-readme code { background: rgba(244, 234, 213, 0.08); padding: 0.1em 0.4em; border-radius: 3px; font-size: 0.9em; font-family: var(--font-jbmono); color: #00e87b; }
                  .markdown-readme pre { background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(244, 234, 213, 0.08); padding: 1rem; border-radius: 4px; overflow-x: auto; margin: 0 0 1.5rem; font-family: var(--font-jbmono); font-size: 0.85em; line-height: 1.6; }
                  .markdown-readme pre code { background: transparent; padding: 0; color: rgba(244, 234, 213, 0.9); }
                  .markdown-readme blockquote { border-left: 3px solid #00e87b; padding: 0.25rem 0 0.25rem 1rem; margin: 0 0 1.25rem; color: rgba(244, 234, 213, 0.7); font-style: italic; }
                  .markdown-readme img { max-width: 100%; border-radius: 4px; margin: 1rem 0; border: 1px solid rgba(244, 234, 213, 0.08); }
                  .markdown-readme table { border-collapse: collapse; margin: 0 0 1.5rem; width: 100%; font-size: 0.9em; }
                  .markdown-readme th, .markdown-readme td { border: 1px solid rgba(244, 234, 213, 0.1); padding: 0.5rem 0.75rem; text-align: left; }
                  .markdown-readme th { background: rgba(244, 234, 213, 0.04); font-weight: 600; color: #f4ead5; }
                  .markdown-readme hr { border: none; border-top: 1px solid rgba(244, 234, 213, 0.15); margin: 2rem 0; }
                  .markdown-readme strong { color: #f4ead5; font-weight: 650; }
                `}</style>
                <article className="markdown-readme max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {readme}
                  </ReactMarkdown>
                </article>
              </>
            ) : (
              <div className="p-6 rounded-md border border-white/10 bg-[#0a1410]/40 text-white/60">
                <p className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/40 mb-2">
                  Notice
                </p>
                <p>
                  Couldn&apos;t load the README from GitHub. Check the repo directly for details.
                </p>
              </div>
            )}

            {slug === "rl-soccer" && (
              <div className="my-10 p-6 rounded-md border border-white/10 bg-[#0a1410]/60">
                <div className="font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase text-white/50 mb-3">
                  Reward Curve · 2.3M Steps
                </div>
                <svg viewBox="0 0 800 250" className="w-full h-auto">
                  <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(244,234,213,0.1)" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(244,234,213,0.05)" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(244,234,213,0.05)" />
                  <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(244,234,213,0.05)" />
                  <path
                    d="M0,200 C100,195 200,190 300,198 S400,150 500,100 S650,60 800,40"
                    stroke="#00e87b"
                    strokeWidth="2.5"
                    fill="none"
                    style={{ filter: "drop-shadow(0 0 6px rgba(0,232,123,0.5))" }}
                  />
                  <circle cx="300" cy="198" r="4" fill="#fbbf24" />
                  <text x="310" y="195" fill="rgba(244,234,213,0.7)" fontSize="11" fontFamily="monospace">
                    curriculum stage 2 unlocks
                  </text>
                </svg>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-12">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-sm border border-[#00e87b] text-[#00e87b] font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase hover:bg-[#00e87b]/10 transition"
              >
                View on GitHub ↗
              </a>
              <Link
                href="/preview/projects"
                className="px-5 py-2.5 rounded-sm border border-white/20 text-white/70 font-[family-name:var(--font-jbmono)] text-[11px] tracking-[0.25em] uppercase hover:border-white/50 hover:text-white transition"
              >
                ← All projects
              </Link>
            </div>
          </>
        )}
      </main>
      <PageFooter />
    </div>
  );
}
