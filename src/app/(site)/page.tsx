import { AiUsagePanel } from "@/components/site/AiUsagePanel";
import { GitHubPanel } from "@/components/site/GitHubPanel";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusList } from "@/components/site/StatusList";
import { workingOn, learningNow, focuses } from "@/lib/site-data";

const anime = [
  { src: "/anime-onepiece.png", title: "One Piece" },
  { src: "/anime-aot.png", title: "Attack on Titan" },
  { src: "/anime-jjk.png", title: "Jujutsu Kaisen" },
  { src: "/anime-sololeveling.png", title: "Solo Leveling" },
];

function AnimeStrip() {
  return (
    <div className="mt-5">
      <div className="font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.18em] text-faint">
        Favorite anime
      </div>
      <div className="mt-2 flex flex-wrap gap-3">
        {anime.map((a) => (
          <div
            key={a.title}
            className="group rounded-[6px] border border-line bg-card p-2 transition-transform hover:-translate-y-0.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.src}
              alt={a.title}
              className="h-24 w-24 rounded-[4px] object-cover"
              loading="lazy"
            />
            <div className="mt-1.5 text-center font-[family-name:var(--font-jbmono)] text-[9px] text-mute">
              {a.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SoccerCard() {
  return (
    <a
      href="https://www.playmakerstats.com/player/elliot-sones/1259756"
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-[6px] border border-line bg-card transition-colors hover:border-ember"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/elliot-lank.jpg"
        alt="Elliot playing soccer"
        className="h-44 w-full object-cover"
        loading="lazy"
      />
      <div className="flex items-baseline justify-between px-3 py-2.5">
        <span className="font-[family-name:var(--font-fraunces)] text-[14px] font-medium text-ink">
          Soccer
        </span>
        <span className="font-[family-name:var(--font-jbmono)] text-[9px] text-faint group-hover:text-ember transition-colors">
          playmaker profile ↗
        </span>
      </div>
    </a>
  );
}

function MusicCard() {
  return (
    <div className="rounded-[6px] border border-line bg-card p-3">
      <div className="mb-2.5 flex items-baseline justify-between px-1">
        <span className="font-[family-name:var(--font-fraunces)] text-[14px] font-medium text-ink">
          Music
        </span>
        <span className="font-[family-name:var(--font-jbmono)] text-[9px] text-faint">spotify</span>
      </div>
      <iframe
        title="Spotify playlist"
        style={{ borderRadius: "8px" }}
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DX9RwfGbeGQwP?utm_source=generator&theme=0"
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Live strip */}
      <section>
        <SectionHeader title="Live" />
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
          <AiUsagePanel />
          <GitHubPanel />
        </div>
      </section>

      {/* Working on / Learning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div>
          <SectionHeader title="What I'm working on" />
          <StatusList items={workingOn} />
        </div>
        <div>
          <SectionHeader title="What I'm learning" />
          <StatusList items={learningNow} />
        </div>
      </section>

      {/* About */}
      <section>
        <SectionHeader title="About" />
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-6 items-start">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] font-medium tracking-[-0.02em] text-ink mb-2.5">
              When I&apos;m not coding…
            </h1>
            <p className="font-[family-name:var(--font-jbmono)] text-[12.5px] leading-[1.8] text-inksoft mb-2.5">
              <em className="font-[family-name:var(--font-fraunces)] text-[14px] italic text-ink">
                I&apos;m Elliot — a CS student at Toronto Metropolitan University
              </em>{" "}
              training agents that play games and building tools that use LLMs. Most of
              my learning happens in public: hackathons, Kaggle, and an unreasonable
              number of tokens.
            </p>
            <p className="font-[family-name:var(--font-jbmono)] text-[12.5px] leading-[1.8] text-inksoft">
              When I&apos;m not coding, I play as much soccer as I can — I&apos;ve played
              my whole life, including one season in Portugal. When I&apos;m not playing,
              it&apos;s music, anime, and friends.
            </p>
            <AnimeStrip />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {focuses.map((f) => (
                <div key={f.title} className="rounded-[6px] border border-line bg-card p-4">
                  <div className="font-[family-name:var(--font-fraunces)] text-[15px] font-medium text-ink">
                    {f.title}
                  </div>
                  <p className="mt-1.5 font-[family-name:var(--font-jbmono)] text-[11px] leading-relaxed text-inksoft">
                    {f.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3.5">
            <SoccerCard />
            <MusicCard />
          </div>
        </div>
      </section>
    </div>
  );
}
