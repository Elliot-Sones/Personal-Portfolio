import Link from "next/link";
import { SeriesNav, SeriesMobileNav } from "@/components/site/SeriesNav";
import { mfsIntro } from "@/lib/ml-from-scratch";

export default function SeriesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-paper text-ink min-h-screen overflow-x-clip">
      <div className="noise-overlay" aria-hidden />

      {/* Series sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[250px] flex-col bg-sunken border-r border-line p-6">
        <Link href="/" className="block">
          <span className="font-[family-name:var(--font-fraunces)] text-[18px] font-medium tracking-[-0.01em] text-ink">
            Elliot Sones<span className="text-ember">.</span>
          </span>
          <span className="mt-1 block font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.16em] text-faint">
            ← back to the site
          </span>
        </Link>

        <div className="mt-9">
          <div className="font-[family-name:var(--font-fraunces)] text-[16px] font-medium leading-snug text-ink">
            {mfsIntro.title}
          </div>
          <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.16em] text-mute">
            A learning blog series
          </div>
        </div>

        <div className="mt-5">
          <SeriesNav />
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-line pt-3.5 font-[family-name:var(--font-jbmono)] text-[9.5px]">
          <Link href="/learning" className="text-mute transition-colors hover:text-ember">
            All learning blogs
          </Link>
          <a
            href={mfsIntro.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mute transition-colors hover:text-ember"
          >
            Code on GitHub ↗
          </a>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-sunken/95 backdrop-blur border-b border-line px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <Link
            href="/"
            className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink"
          >
            Elliot Sones<span className="text-ember">.</span>
          </Link>
          <span className="truncate font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.14em] text-mute">
            {mfsIntro.title}
          </span>
        </div>
        <div className="mt-2 flex gap-4 overflow-x-auto">
          <SeriesMobileNav />
        </div>
      </div>

      <main className="min-w-0 px-5 py-6 md:ml-[250px] md:px-10 md:py-8">
        <div className="mx-auto max-w-[1080px]">{children}</div>
        <footer className="mx-auto mt-16 flex max-w-[1080px] items-center justify-between border-t border-line pt-4 font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.16em] text-faint">
          <span>© 2026 Elliot Sones</span>
          <Link href="/learning" className="hover:text-ember transition-colors">
            learning blogs →
          </Link>
        </footer>
      </main>
    </div>
  );
}
