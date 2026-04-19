"use client";

import Image from "next/image";
import { Nav, PageHead, PageFooter } from "../_components/Nav";

const animes = [
  { src: "/anime-onepiece.png", label: "One Piece", note: "wano arc is goated" },
  { src: "/anime-aot.png", label: "Attack on Titan", note: "season 4 finale" },
  { src: "/anime-jjk.png", label: "Jujutsu Kaisen", note: "shibuya arc >>" },
];

export default function AboutPage() {
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

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 pt-32 sm:pt-36 pb-16">
        <PageHead
          number="01"
          label="About"
          title="When I'm not coding."
          tagline="Soccer, anime, music, Portugal, and the rest of me."
        />

        {/* Main story + soccer side-by-side */}
        <section className="grid md:grid-cols-[1fr_1.05fr] gap-8 mb-8">
          {/* Text column */}
          <div className="rounded-md border border-[#f4ead5]/10 bg-[#0a1410]/50 backdrop-blur-md p-8 flex flex-col justify-center">
            <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#00e87b]/90 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-[#00e87b]" />
              Off-the-record
            </div>

            <p className="text-[#f4ead5]/85 text-lg leading-[1.65] mb-5">
              When I am not coding, I love to play as much soccer as I can in my free time. I played soccer my whole life where I played in{" "}
              <span className="font-[family-name:var(--font-fraunces)] italic text-[#00e87b]">Portugal</span>{" "}
              for one season.
            </p>
            <p className="text-[#f4ead5]/75 text-base leading-[1.65]">
              When I&apos;m not playing soccer I love listening to music, watching anime, and hanging out with friends.
            </p>
          </div>

          {/* Soccer photo card */}
          <a
            href="https://www.playmakerstats.com/player/elliot-sones/1259756"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-md overflow-hidden border border-[#f4ead5]/10 hover:border-[#00e87b]/40 transition-all"
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src="/elliot-lank.jpg"
                alt="Elliot playing soccer"
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* overlay info strip */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#00e87b]/80 mb-1">
                      ● Active player
                    </div>
                    <div
                      className="font-[family-name:var(--font-bricolage)] text-2xl text-[#f4ead5] tracking-[-0.01em]"
                      style={{ fontVariationSettings: '"wdth" 85, "wght" 650' }}
                    >
                      Soccer · Portugal
                    </div>
                    <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-[#f4ead5]/60 mt-1">
                      Club system · 1 season
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#f4ead5]/60 group-hover:text-[#00e87b] transition">
                    stats ↗
                  </div>
                </div>
              </div>
            </div>
          </a>
        </section>

        {/* Anime + Music row */}
        <section className="grid md:grid-cols-[1.5fr_1fr] gap-8">
          {/* Anime collection — 3 tiles with clean caption bars */}
          <div>
            <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#f4ead5]/50 mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-[#f4ead5]/30" />
              Favorite Anime
            </div>
            <div className="grid grid-cols-3 gap-3">
              {animes.map((a, i) => (
                <div
                  key={a.label}
                  className="group relative rounded-md overflow-hidden border border-[#f4ead5]/10 bg-[#0a1410]/50"
                >
                  {/* image in fixed aspect ratio */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={a.src}
                      alt={a.label}
                      fill
                      className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                      sizes="(max-width: 768px) 33vw, 300px"
                    />
                  </div>
                  {/* caption BELOW image, not overlapping */}
                  <div className="px-3 py-2.5 border-t border-[#f4ead5]/10 bg-[#0a1410]/80">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="font-[family-name:var(--font-bricolage)] text-sm text-[#f4ead5] tracking-[-0.005em] truncate"
                        style={{ fontVariationSettings: '"wdth" 90, "wght" 600' }}
                      >
                        {a.label}
                      </div>
                      <div className="font-[family-name:var(--font-jbmono)] text-[9px] tracking-[0.2em] uppercase text-[#f4ead5]/30 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="font-[family-name:var(--font-fraunces)] italic text-xs text-[#f4ead5]/55 mt-0.5 truncate">
                      {a.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Music card */}
          <div>
            <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.3em] uppercase text-[#f4ead5]/50 mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-[#f4ead5]/30" />
              What I Code To
            </div>
            <div className="rounded-md border border-[#f4ead5]/10 bg-[#0a1410]/50 backdrop-blur-md overflow-hidden">
              <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#f4ead5]/10">
                <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.25em] uppercase text-[#1db954]">
                  ● Now Playing
                </div>
                <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase text-[#f4ead5]/40">
                  Spotify · lofi cafe
                </div>
              </div>
              <iframe
                style={{ borderRadius: 0, border: 0 }}
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DX9RwfGbeGQwP?utm_source=generator&theme=0"
                width="100%"
                height="200"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>
      <PageFooter />
    </div>
  );
}
