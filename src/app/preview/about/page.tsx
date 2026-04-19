"use client";

import Image from "next/image";
import { Nav, PageHead, PageFooter } from "../_components/Nav";

const animes = [
  { src: "/anime-onepiece.png", label: "One Piece" },
  { src: "/anime-aot.png", label: "Attack on Titan" },
  { src: "/anime-jjk.png", label: "Jujutsu Kaisen" },
];

export default function AboutPage() {
  return (
    <div className="relative isolate min-h-screen text-[#f4ead5]">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-16">
        <PageHead number="01" label="About" title="When I'm not coding." tagline="Soccer, anime, music, Portugal, and the rest of me." />

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
              {animes.map((a) => (
                <div key={a.label} className="group relative rounded-lg overflow-hidden border border-white/10">
                  <Image src={a.src} alt={a.label} width={144} height={144} className="w-36 h-36 object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.15em] uppercase text-white/90">
                      {a.label}
                    </div>
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
      </main>
      <PageFooter />
    </div>
  );
}
