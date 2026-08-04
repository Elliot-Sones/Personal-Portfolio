"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mfsModels } from "@/lib/ml-from-scratch";

const items = [
  { href: "/learning/ml-from-scratch", label: "Overview" },
  ...mfsModels.map((m) => ({
    href: `/learning/ml-from-scratch/${m.slug}`,
    label: m.short === "Transformer" ? "Transformers" : m.short,
  })),
];

export function SeriesNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-baseline border-t border-line py-2.5 font-[family-name:var(--font-jbmono)] text-[12.5px] transition-colors ${
              active ? "font-bold text-ink" : "text-inksoft hover:text-ink"
            }`}
          >
            <span className="u-draw">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SeriesMobileNav() {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
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
