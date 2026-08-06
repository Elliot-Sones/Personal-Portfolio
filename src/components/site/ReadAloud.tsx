"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Read-aloud player: browser speechSynthesis with word-boundary highlighting.
// The transcript text is authored in src/lib/read-aloud.ts.
export function ReadAloud({ text }: { text: string }) {
  const words = useMemo(
    () =>
      Array.from(text.matchAll(/\S+/g)).map((m) => ({
        word: m[0],
        start: m.index ?? 0,
      })),
    [text],
  );
  const [supported, setSupported] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(-1);
  // Chrome garbage-collects utterances that aren't referenced, which kills
  // playback and boundary events mid-sentence; keep it pinned here
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function play() {
    const synth = window.speechSynthesis;
    synth.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const voice =
      voices.find((v) => v.lang.startsWith("en") && v.localService) ??
      voices.find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    u.rate = 1;

    u.onboundary = (e) => {
      if (e.name && e.name !== "word") return;
      const ci = e.charIndex;
      let idx = -1;
      for (let i = 0; i < words.length; i++) {
        if (words[i].start <= ci) idx = i;
        else break;
      }
      setActive(idx);
    };
    u.onend = () => {
      setPlaying(false);
      setActive(-1);
    };
    u.onerror = () => {
      setPlaying(false);
      setActive(-1);
    };

    utteranceRef.current = u;
    synth.speak(u);
    setPlaying(true);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setPlaying(false);
    setActive(-1);
  }

  if (!supported) return null;

  const minutes = Math.max(1, Math.round(words.length / 180));

  return (
    <div className="rounded-[6px] border border-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <span className="font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.14em] text-mute">
          Listen · ~{minutes} min
        </span>
        <button
          type="button"
          onClick={playing ? stop : play}
          className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 font-[family-name:var(--font-jbmono)] text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
            playing
              ? "bg-ember text-paper hover:bg-[#a04826]"
              : "border border-line text-inksoft hover:border-ember hover:text-ember"
          }`}
          aria-label={playing ? "Stop reading" : "Read this page aloud"}
        >
          <span aria-hidden className="text-[9px] leading-none">
            {playing ? "■" : "▶"}
          </span>
          {playing ? "Stop" : "Play"}
        </button>
      </div>
      <p className="max-h-[180px] overflow-y-auto px-4 py-3.5 font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.75] text-inksoft">
        {words.map((w, i) => (
          <span key={`${w.start}-${w.word}`}>
            <span
              ref={i === active ? activeRef : undefined}
              className={`rounded-[3px] transition-colors duration-100 ${
                i === active ? "bg-ember/20 text-ink" : ""
              }`}
            >
              {w.word}
            </span>{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
