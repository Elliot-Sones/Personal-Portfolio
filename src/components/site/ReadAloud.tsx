"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SPEEDS = [0.8, 1, 1.25, 1.5, 2];

// Floating read-aloud player (Speechify-style): fixed bar at the bottom of the
// page with play/stop, a speed cycle, and the transcript words lighting up as
// they are spoken. Speech comes from the browser's speechSynthesis; boundary
// events drive the highlight. Transcript text is authored in
// src/lib/read-aloud.ts.
export function ReadAloud({
  text,
  insetLeftClass = "",
}: {
  text: string;
  // e.g. "md:left-[250px]" so the bar centers within the content column
  insetLeftClass?: string;
}) {
  const words = useMemo(
    () =>
      Array.from(text.matchAll(/\S+/g)).map((m) => ({
        word: m[0],
        start: m.index ?? 0,
      })),
    [text],
  );
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(-1);
  const [rate, setRate] = useState(1);
  // Chrome garbage-collects unreferenced utterances mid-speech; pin it here.
  // Also used to ignore end/error events from utterances we cancelled.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const baseOffsetRef = useRef(0);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (active < 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    activeWordRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  function speakFrom(charOffset: number, atRate: number) {
    const synth = window.speechSynthesis;
    utteranceRef.current = null;
    synth.cancel();

    const u = new SpeechSynthesisUtterance(text.slice(charOffset));
    baseOffsetRef.current = charOffset;
    const voices = synth.getVoices();
    const voice =
      voices.find((v) => v.lang.startsWith("en") && v.localService) ??
      voices.find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    u.rate = atRate;

    u.onboundary = (e) => {
      if (utteranceRef.current !== u) return;
      if (e.name && e.name !== "word") return;
      const ci = baseOffsetRef.current + e.charIndex;
      let idx = -1;
      for (let i = 0; i < words.length; i++) {
        if (words[i].start <= ci) idx = i;
        else break;
      }
      setActive(idx);
    };
    const finish = () => {
      if (utteranceRef.current !== u) return;
      setPlaying(false);
      setActive(-1);
    };
    u.onend = finish;
    u.onerror = finish;

    utteranceRef.current = u;
    synth.speak(u);
    setPlaying(true);
  }

  function play() {
    speakFrom(0, rate);
  }

  function stop() {
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
    setPlaying(false);
    setActive(-1);
  }

  function cycleSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length];
    setRate(next);
    if (playing) {
      // speechSynthesis can't change the rate of an in-flight utterance:
      // restart from the word currently being spoken
      speakFrom(active >= 0 ? words[active].start : 0, next);
    }
  }

  if (!supported || words.length === 0) return null;

  const minutes = Math.max(1, Math.round(words.length / 180));

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 ${insetLeftClass}`}
      style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto mx-auto flex max-w-[680px] items-center gap-2.5 rounded-full border border-line bg-raised/95 py-2 pl-2 pr-3 shadow-[0_12px_32px_rgba(43,36,24,0.16)] backdrop-blur-md">
        <button
          type="button"
          onClick={playing ? stop : play}
          aria-label={playing ? "Stop reading" : "Read this post aloud"}
          className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 active:scale-95 motion-reduce:transition-none ${
            playing
              ? "bg-ember text-paper hover:bg-[#a04826]"
              : "border border-line bg-card text-inksoft hover:border-ember hover:text-ember"
          }`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.5-6.86a1.04 1.04 0 0 0 0-1.76L9.56 4.26A1.04 1.04 0 0 0 8 5.14Z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={cycleSpeed}
          aria-label={`Speech speed ${rate}x, press to change`}
          className="flex h-11 min-w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-card px-3 font-[family-name:var(--font-jbmono)] text-[11px] tabular-nums text-inksoft transition-colors duration-150 hover:border-ember hover:text-ember motion-reduce:transition-none"
        >
          {rate}×
        </button>

        <div
          className="min-w-0 flex-1 overflow-x-hidden whitespace-nowrap py-1.5 [mask-image:linear-gradient(90deg,transparent,black_20px,black_calc(100%-20px),transparent)]"
          aria-hidden
        >
          {active < 0 ? (
            <span className="font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-mute">
              Listen to this post · ~{minutes} min
            </span>
          ) : (
            words.map((w, i) => (
              <span key={`${w.start}`}>
                <span
                  ref={i === active ? activeWordRef : undefined}
                  className={`rounded-[3px] px-0.5 font-[family-name:var(--font-fraunces)] text-[14px] transition-colors duration-100 motion-reduce:transition-none ${
                    i === active ? "bg-ember/20 text-ink" : "text-mute"
                  }`}
                >
                  {w.word}
                </span>{" "}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
