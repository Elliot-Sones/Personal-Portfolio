"use client";

import { Rnd } from "react-rnd";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WindowFrameProps {
  id: string;
  title: string;
  subtitle?: string;
  live?: boolean;
  defaultState: WindowState;
  minWidth?: number;
  minHeight?: number;
  zIndex?: number;
  onFocus?: (id: string) => void;
  bounds?: string;
  children: ReactNode;
  accent?: string;
  bodyClassName?: string;
  noScroll?: boolean;
}

export function WindowFrame({
  id,
  title,
  subtitle,
  live,
  defaultState,
  minWidth = 280,
  minHeight = 180,
  zIndex = 1,
  onFocus,
  bounds = "parent",
  children,
  accent = "#00e87b",
  bodyClassName = "",
  noScroll = false,
}: WindowFrameProps) {
  const [state, setState] = useState<WindowState>(defaultState);
  const hydratedRef = useRef(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const raw = localStorage.getItem(`preview-window:v2:${id}`);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<WindowState>;
        setState({
          x: saved.x ?? defaultState.x,
          y: saved.y ?? defaultState.y,
          width: saved.width ?? defaultState.width,
          height: saved.height ?? defaultState.height,
        });
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = (next: WindowState) => {
    setState(next);
    try {
      localStorage.setItem(`preview-window:v2:${id}`, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <Rnd
      bounds={bounds}
      size={{ width: state.width, height: state.height }}
      position={{ x: state.x, y: state.y }}
      minWidth={minWidth}
      minHeight={minHeight}
      dragHandleClassName={`window-drag-${id}`}
      onDragStop={(_, d) => save({ ...state, x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, pos) =>
        save({
          x: pos.x,
          y: pos.y,
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
        })
      }
      onMouseDown={() => onFocus?.(id)}
      style={{ zIndex }}
      className="group"
    >
      <div
        className="relative w-full h-full flex flex-col rounded-md overflow-hidden border border-[#f4ead5]/15 bg-[#0a1410]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-shadow group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      >
        {/* Title bar */}
        <div
          className={`window-drag-${id} flex items-center justify-between px-3 py-2 bg-[#0a1410] border-b border-[#f4ead5]/10 cursor-move select-none`}
        >
          <div className="flex items-center gap-2">
            {/* Traffic lights */}
            <div className="flex items-center gap-[5px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            {/* Title */}
            <div className="ml-2 flex items-baseline gap-2 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.2em] uppercase">
              {live && (
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                      style={{ background: accent }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-1.5 w-1.5"
                      style={{ background: accent }}
                    />
                  </span>
                  <span style={{ color: accent }}>Live</span>
                  <span className="text-[#f4ead5]/30">//</span>
                </span>
              )}
              <span className="text-[#f4ead5]/85">{title}</span>
              {subtitle && (
                <>
                  <span className="text-[#f4ead5]/25">//</span>
                  <span className="text-[#f4ead5]/40">{subtitle}</span>
                </>
              )}
            </div>
          </div>
          {/* Drag handle indicator */}
          <div
            className="flex gap-0.5 opacity-30 group-hover:opacity-70 transition-opacity"
            aria-hidden
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="w-0.5 h-0.5 rounded-full bg-[#f4ead5]" />
            ))}
          </div>
        </div>
        {/* Content */}
        <div className={`flex-1 min-h-0 ${noScroll ? "overflow-hidden" : "overflow-auto"} ${bodyClassName}`}>
          {children}
        </div>
      </div>
    </Rnd>
  );
}
