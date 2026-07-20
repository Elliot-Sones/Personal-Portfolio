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

export const mdxComponents: MDXComponents = {
  RLDemo,
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
