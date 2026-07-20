"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Sidebar } from "@/components/site/Sidebar";

const STORAGE_KEY = "sidebar-collapsed";
const CHANGE_EVENT = "sidebar-collapsed-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(STORAGE_KEY) === "1",
    () => false,
  );

  const toggle = useCallback(() => {
    const next = localStorage.getItem(STORAGE_KEY) !== "1";
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <div className="bg-paper text-ink min-h-screen overflow-x-clip">
      <div className="noise-overlay" aria-hidden />
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <main
        className={`min-w-0 px-5 py-6 transition-[margin] duration-300 md:px-10 md:py-8 ${
          collapsed ? "md:ml-0" : "md:ml-[250px]"
        }`}
      >
        {children}
        <footer className="mt-14 flex items-center justify-between border-t border-line pt-4 font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.16em] text-faint">
          <span>© 2026 Elliot Sones</span>
          <a href="/v1" className="hover:text-ember transition-colors" title="the old site">
            v1 ↗
          </a>
        </footer>
      </main>
    </div>
  );
}
