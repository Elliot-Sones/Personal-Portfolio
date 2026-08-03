"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, socials } from "@/lib/site-data";
import { HoverMorph } from "@/components/site/HoverMorph";
import { SocialIcon } from "@/components/site/SocialIcon";

function Wordmark() {
  return (
    <Link href="/" className="block group">
      <div className="font-[family-name:var(--font-fraunces)] text-[26px] leading-[1.05] tracking-[-0.02em] whitespace-nowrap text-ink">
        <HoverMorph>
          Elliot Sones<span className="text-ember">.</span>
        </HoverMorph>
      </div>
      <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.14em] leading-[1.7] text-mute">
        ML Engineer
        <br />
        RL · Transformers
      </div>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col">
      {navItems.map((item) => {
        const href = `/${item.slug}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={item.slug}
            href={href}
            onClick={onNavigate}
            className={`group flex items-baseline border-t border-line py-2.5 font-[family-name:var(--font-jbmono)] text-[12.5px] transition-colors ${
              active ? "text-ink font-bold" : "text-inksoft hover:text-ink"
            }`}
          >
            <span className="u-draw">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Socials() {
  return (
    <div className="flex items-center gap-2 border-t border-line pt-3.5">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith("http") ? "_blank" : undefined}
          rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={s.label}
          title={s.label}
          className="group relative flex h-8 w-8 items-center justify-center rounded-[6px] border border-line text-inksoft transition-colors hover:border-ember hover:text-ember"
        >
          <SocialIcon name={s.label} />
          <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-ink px-2 py-1 font-[family-name:var(--font-jbmono)] text-[9px] text-paper shadow-md group-hover:block">
            {s.label}
          </span>
        </a>
      ))}
    </div>
  );
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {/* Desktop sidebar — fixed to the viewport, collapsible */}
      <aside
        className={`hidden md:flex fixed inset-y-0 left-0 z-40 w-[250px] flex-col bg-sunken border-r border-line p-6 transition-transform duration-300 ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <Wordmark />
        <div className="mt-8">
          <NavLinks />
        </div>
        <div className="mt-auto">
          <Socials />
          <div className="mt-3 font-[family-name:var(--font-jbmono)] text-[8.5px] uppercase tracking-[0.16em] text-faint">
            Toronto · TMU &apos;29
          </div>
        </div>
      </aside>

      {/* Edge-tab toggle, always reachable */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`fixed top-1/2 z-50 hidden h-10 w-5 -translate-y-1/2 items-center justify-center rounded-r-[6px] border border-l-0 border-line bg-sunken font-[family-name:var(--font-jbmono)] text-[11px] text-mute transition-[left] duration-300 hover:text-ember md:flex ${
          collapsed ? "left-0" : "left-[250px]"
        }`}
      >
        {collapsed ? "»" : "«"}
      </button>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-sunken/95 backdrop-blur border-b border-line px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink"
          >
            Elliot Sones<span className="text-ember">.</span>
          </Link>
        </div>
        <div className="mt-2 flex gap-4 overflow-x-auto">
          <MobileNav />
        </div>
      </div>
    </>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <>
      {navItems.map((item) => {
        const href = `/${item.slug}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={item.slug}
            href={href}
            className={`whitespace-nowrap font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.12em] ${
              active ? "text-ember" : "text-inksoft"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
