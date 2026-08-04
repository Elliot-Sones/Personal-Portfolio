import type { MDXComponents } from "mdx/types";
import RLSoccerGame from "@/components/RLSoccerGame";

function RLDemo() {
  return (
    <figure className="my-6">
      <div className="site-card overflow-hidden p-1.5 h-[540px]">
        <RLSoccerGame className="h-full w-full" />
      </div>
      <figcaption className="mt-2 font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.16em] text-faint">
        Live — the agent trains in your browser. Switch to 1v1 to play against it.
      </figcaption>
    </figure>
  );
}

function Fig({
  src,
  caption,
  max,
}: {
  src: string;
  caption?: string;
  max?: number;
}) {
  return (
    <figure className="my-5">
      <div className="overflow-hidden rounded-[6px] border border-line bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption ?? ""}
          loading="lazy"
          className="mx-auto max-h-[420px] w-auto object-contain"
          style={max ? { maxWidth: max } : undefined}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 font-[family-name:var(--font-jbmono)] text-[9.5px] text-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function FigRow({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div
      className={`my-5 grid grid-cols-1 items-start gap-4 [&_figure]:my-0 ${
        cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      }`}
    >
      {children}
    </div>
  );
}

function Video({ id, caption }: { id: string; caption?: string }) {
  return (
    <figure className="my-5">
      <div className="overflow-hidden rounded-[6px] border border-line bg-ink">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={caption ?? "Video"}
          className="aspect-video w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && (
        <figcaption className="mt-2 font-[family-name:var(--font-jbmono)] text-[9.5px] text-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function MathLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-[6px] border border-line bg-raised px-4 py-3 text-center font-[family-name:var(--font-jbmono)] text-[13px] tracking-[0.02em] text-ink">
      {children}
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  RLDemo,
  Fig,
  FigRow,
  Video,
  MathLine,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-4 rounded-[4px]" loading="lazy" alt="" {...props} />
  ),
  table: (props) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-ink px-3 py-2 text-left font-[family-name:var(--font-jbmono)] text-[9px] font-medium uppercase tracking-[0.16em] text-mute"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-line px-3 py-2 align-top font-[family-name:var(--font-jbmono)] text-[11.5px] leading-[1.65] text-inksoft"
      {...props}
    />
  ),
  h1: (props) => (
    <h1
      className="font-[family-name:var(--font-fraunces)] text-[24px] font-semibold tracking-[-0.02em] text-ink mt-8 mb-3"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-[family-name:var(--font-fraunces)] text-[19px] font-semibold tracking-[-0.01em] text-ink mt-7 mb-2"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-[family-name:var(--font-jbmono)] text-[11px] font-bold uppercase tracking-[0.14em] text-ink mt-6 mb-2"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="font-[family-name:var(--font-fraunces)] text-[15.5px] leading-[1.8] text-inksoft my-3.5"
      {...props}
    />
  ),
  a: (props) => (
    <a className="text-ember u-draw" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  ul: (props) => <ul className="my-3.5 ml-5 list-disc marker:text-ember" {...props} />,
  ol: (props) => <ol className="my-3.5 ml-5 list-decimal marker:text-ember" {...props} />,
  li: (props) => (
    <li
      className="font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.75] text-inksoft my-1"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-2 border-ember pl-4 font-[family-name:var(--font-fraunces)] italic text-[15px] text-inksoft"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="font-[family-name:var(--font-jbmono)] text-[0.85em] bg-sunken border border-line rounded px-1 py-0.5"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-4 overflow-x-auto rounded-md border border-line bg-raised p-4 font-[family-name:var(--font-jbmono)] text-[12px] leading-relaxed [&_code]:bg-transparent [&_code]:border-0 [&_code]:p-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-line" />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
};
