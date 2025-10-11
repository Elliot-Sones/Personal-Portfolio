"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

const SOURCE = "/audio/soccernoise.mp3";

const DEFAULT_VOLUME = 0.4;

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);
    audio.loop = true;

    const tryAutoPlay = async () => {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    };

    void tryAutoPlay();

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    void audio.play();
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <div
        className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-full border border-border bg-muted/20 shadow-lg backdrop-blur-sm transition-all duration-200 ${
          isExpanded
            ? "min-h-[8rem] w-70 gap-3 px-6 pt-4 pb-5"
            : "h-16 w-16 gap-0 px-0 py-0 sm:h-20 sm:w-25"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <button
          type="button"
          onClick={togglePlayback}
          className={`grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:border-accent hover:text-accent ${
            isExpanded ? "translate-y-0.5" : ""
          }`}
          aria-label={isPlaying ? "Pause stadium atmosphere" : "Play stadium atmosphere"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div
          className={`w-full max-w-[13rem] overflow-hidden transition-all duration-200 ${
            isExpanded
              ? "pointer-events-auto -translate-y-0.5 opacity-100 max-h-32"
              : "pointer-events-none -translate-y-2 opacity-0 max-h-0"
          }`}
          aria-hidden={!isExpanded}
        >
          <div className="flex flex-col items-center gap-1.5">
            <label className="text-center text-[10px] uppercase tracking-[0.25em] text-muted" htmlFor="audio-volume">
              Volume
            </label>
            <input
              id="audio-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-accent"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={Number(volume.toFixed(2))}
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={SOURCE} preload="auto" autoPlay loop />
    </div>
  );
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M8 5.14v13.72c0 .59.65.96 1.15.63l10.23-6.86a.75.75 0 0 0 0-1.26L9.15 4.51A.75.75 0 0 0 8 5.14Z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M7 4.75C7 4.34 7.34 4 7.75 4h2.5c.41 0 .75.34.75.75v14.5c0 .41-.34.75-.75.75h-2.5A.75.75 0 0 1 7 19.25V4.75Zm6 0c0-.41.34-.75.75-.75h2.5c.41 0 .75.34.75.75v14.5c0 .41-.34.75-.75.75h-2.5a.75.75 0 0 1-.75-.75V4.75Z" />
  </svg>
);
