import { SectionHeader } from "@/components/site/SectionHeader";

export const metadata = { title: "About · Elliot Sones" };

const anime = [
  { src: "/anime-onepiece.png", title: "One Piece" },
  { src: "/anime-aot.png", title: "Attack on Titan" },
  { src: "/anime-jjk.png", title: "Jujutsu Kaisen" },
  { src: "/anime-sololeveling.png", title: "Solo Leveling" },
];

function AnimeStrip() {
  return (
    <div>
      <SectionHeader title="Favorite anime" />
      <div className="mt-3.5 flex flex-wrap gap-3.5">
        {anime.map((a) => (
          <div
            key={a.title}
            className="group rounded-[6px] border border-line bg-card p-2 transition-all hover:-translate-y-1 hover:border-ember"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.src}
              alt={a.title}
              className="h-28 w-28 rounded-[4px] object-cover"
              loading="lazy"
            />
            <div className="mt-2 text-center font-[family-name:var(--font-jbmono)] text-[10px] text-mute transition-colors group-hover:text-ink">
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
        alt="Elliot playing for Lank Vilaverdense"
        className="h-72 w-full object-cover object-[50%_22%]"
        loading="lazy"
      />
      <div className="flex items-baseline justify-between px-3.5 py-3">
        <div>
          <span className="font-[family-name:var(--font-fraunces)] text-[17px] font-medium text-ink">
            Soccer
          </span>
          <span className="ml-3 font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.14em] text-mute">
            Lank Vilaverdense U19 · Portugal
          </span>
        </div>
        <span className="font-[family-name:var(--font-jbmono)] text-[9px] text-faint transition-colors group-hover:text-ember">
          playmaker profile <span className="arrow-nudge">↗</span>
        </span>
      </div>
    </a>
  );
}

function MusicCard() {
  return (
    <div className="sleeve">
      <div className="flex items-baseline justify-between px-4 pb-2.5 pt-3.5">
        <span className="font-[family-name:var(--font-fraunces)] text-[17px] font-medium text-paper">
          Music
        </span>
        <span className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.14em] text-paper/60">
          on rotation · spotify
        </span>
      </div>
      <div className="px-2 pb-2">
        <iframe
          title="Spotify playlist"
          style={{ borderRadius: "8px", display: "block" }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DX9RwfGbeGQwP?utm_source=generator&theme=0"
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="reveal flex flex-col gap-12" style={{ "--reveal-i": 0 } as React.CSSProperties}>
      <div>
        <SectionHeader title="About" />
        <h1 className="page-hed mt-4 max-w-[640px] text-[clamp(30px,4vw,44px)]">
          When I&apos;m not coding&hellip;
        </h1>
        <div className="mt-5 max-w-[560px]">
          <p className="prose-serif">
            I love to play as much soccer as I can in my free time. I played my
            whole life, including a season in Portugal with Lank Vilaverdense&apos;s
            U19 academy.
          </p>
          <p className="prose-serif mt-3">
            Off the pitch it&apos;s music, anime, and hanging out with friends.
          </p>
        </div>
      </div>

      {/* media row */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <SoccerCard />
        <MusicCard />
      </div>

      <AnimeStrip />
    </div>
  );
}
