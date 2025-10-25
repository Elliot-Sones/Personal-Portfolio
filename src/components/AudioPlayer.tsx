"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const SOURCE = "/audio/soccernoise.mp3";

const CROWD_MAX_VOLUME = 0.6;
const DEFAULT_VOLUME = 0.24;
const KICK_COOLDOWN_MS = 140;
const KICK_STOP_DELAY_MS = 120;
const KICK_MIN_DELTA = 0.007;
const KICK_SEGMENT_SECONDS = 0.35;
const KICK_VOLUME = 0.35;
const FORWARD_RATE = 1.05;
const BACKWARD_RATE = 0.94;

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isExpanded, setIsExpanded] = useState(false);
  // Tracks whether we already attached a one-time user gesture handler
  // to unlock audio (needed because many browsers block autoplay with sound).
  const gestureHandlerAttachedRef = useRef(false);
  // Tracks whether the user has previously unlocked audio on this site.
  // If true, we can try unmuted autoplay first on subsequent visits.
  const hasUnlockedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Keep DOM element volume in sync with state
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

    // Read persisted unlock flag (set after first user gesture unmute)
    try {
      hasUnlockedRef.current = window.localStorage.getItem("portfolio:audio:unlocked") === "1";
    } catch {
      hasUnlockedRef.current = false;
    }

    // One-time user gesture handler to unmute and play when policies block sound
    const attachOneTimeGestureHandler = () => {
      if (gestureHandlerAttachedRef.current) return;
      gestureHandlerAttachedRef.current = true;

      const onFirstGesture = () => {
        try {
          // Persist unlock for subsequent visits
          window.localStorage.setItem("portfolio:audio:unlocked", "1");
        } catch {}

        // Ensure audio is audible and playing after a real user gesture
        audio.muted = false;
        audio.volume = volume;
        void audio.play().catch(() => {});

        removeGestureHandlers();
      };

      const removeGestureHandlers = () => {
        window.removeEventListener("pointerdown", onFirstGesture);
        window.removeEventListener("touchstart", onFirstGesture, { capture: true } as any);
        window.removeEventListener("keydown", onFirstGesture);
        window.removeEventListener("scroll", onFirstGesture, { passive: true } as any);
      };

      window.addEventListener("pointerdown", onFirstGesture, { once: true });
      window.addEventListener("touchstart", onFirstGesture, { once: true, capture: true });
      window.addEventListener("keydown", onFirstGesture, { once: true });
      window.addEventListener("scroll", onFirstGesture, { once: true, passive: true });

      // Also try when tab becomes visible (helps when landing on a background tab)
      const onVisibility = () => {
        if (document.visibilityState === "visible") {
          void audio.play().catch(() => {});
        }
      };
      document.addEventListener("visibilitychange", onVisibility, { once: true });

      // Cleanup for gesture/visibility handlers when component unmounts
      cleanupFns.push(() => {
        removeGestureHandlers();
        document.removeEventListener("visibilitychange", onVisibility);
      });
    };

    // Keep cleanup callbacks we add dynamically here
    const cleanupFns: Array<() => void> = [];

    const tryAutoPlay = async () => {
      try {
        // If user previously unlocked, attempt unmuted autoplay first
        if (hasUnlockedRef.current) {
          audio.muted = false;
          audio.volume = volume;
          await audio.play();
          return;
        }

        // Normal attempt: play with current settings
        audio.muted = false;
        audio.volume = volume;
        await audio.play();
      } catch {
        // If blocked, fall back to muted autoplay (allowed on most browsers)
        try {
          audio.muted = true;
          await audio.play();
          // Attach a one-time gesture handler to unmute as soon as the user interacts
          attachOneTimeGestureHandler();
        } catch {
          // If even muted autoplay fails, rely on the first user gesture to start playback
          attachOneTimeGestureHandler();
          setIsPlaying(false);
        }
      }
    };

    void tryAutoPlay();

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
      // Run any deferred cleanups we registered (gesture/visibility handlers)
      cleanupFns.forEach((fn) => {
        try {
          fn();
        } catch {}
      });
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    // If user explicitly toggles play, ensure we are unmuted and audible
    audio.muted = false;
    audio.volume = volume;
    void audio.play();
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    setVolume(Math.min(Math.max(nextVolume, 0), CROWD_MAX_VOLUME));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <KickSoundController />
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
              max={CROWD_MAX_VOLUME}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-accent"
              aria-valuemin={0}
              aria-valuemax={CROWD_MAX_VOLUME}
              aria-valuenow={Number(volume.toFixed(2))}
            />
          </div>
        </div>
      </div>
      {/*
        We do not set the muted attribute by default; we attempt audible autoplay first
        and only fall back to muted autoplay in code when policies block sound.
        playsInline improves autoplay behavior on iOS Safari.
      */}
      <audio ref={audioRef} src={SOURCE} preload="auto" autoPlay loop playsInline />
    </div>
  );
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M8 5.14v13.72c0 .59.65.96 1.15.63l10.23-6.86a.75.75 0 0 0 0-1.26L9.15 4.51A.75.75 0 0 0 8 5.14Z" />
  </svg>
);

const KickSoundController = () => {
  const { scrollYProgress } = useScroll();
  const baseKickRef = useRef<HTMLAudioElement | null>(null);
  const kickDurationRef = useRef(0);
  const lastProgressRef = useRef(scrollYProgress.get());
  const lastKickTimeRef = useRef(0);
  const activeKicksRef = useRef(new Map<HTMLAudioElement, () => void>());
  const scrollStopTimeoutRef = useRef<number | null>(null);

  const stopAllKicks = useCallback(() => {
    const entries = Array.from(activeKicksRef.current.entries());
    entries.forEach(([kick, cleanup]) => {
      kick.pause();
      kick.currentTime = 0;
      cleanup();
    });
  }, []);

  const playKick = useCallback(
    (direction: number) => {
      const baseKick = baseKickRef.current;
      if (!baseKick) {
        return;
      }

      const kick = baseKick.cloneNode(true) as HTMLAudioElement;
      kick.volume = KICK_VOLUME;
      kick.playbackRate = direction >= 0 ? FORWARD_RATE : BACKWARD_RATE;

      const duration = kickDurationRef.current || baseKick.duration;
      if (Number.isFinite(duration) && duration > KICK_SEGMENT_SECONDS) {
        const maxStart = Math.max(duration - KICK_SEGMENT_SECONDS, 0);
        kick.currentTime = Math.random() * maxStart;
      }

      const cleanup = () => {
        kick.removeEventListener("ended", cleanup);
        kick.removeEventListener("error", cleanup);
        activeKicksRef.current.delete(kick);
      };

      activeKicksRef.current.set(kick, cleanup);
      kick.addEventListener("ended", cleanup);
      kick.addEventListener("error", cleanup);

      void kick.play().catch(() => {
        cleanup();
      });
    },
    [],
  );

  useEffect(() => {
    const audio = new Audio("/audio/soccerkick.mp3");
    audio.preload = "auto";

    const handleLoadedMetadata = () => {
      kickDurationRef.current = audio.duration || 0;
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    baseKickRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      baseKickRef.current = null;
      stopAllKicks();
    };
  }, [stopAllKicks]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const previous = lastProgressRef.current;
    const delta = Math.abs(latest - previous);
    const now = performance.now();
    const direction = latest - previous;

    if (delta > KICK_MIN_DELTA && now - lastKickTimeRef.current > KICK_COOLDOWN_MS) {
      playKick(direction);
      lastKickTimeRef.current = now;
    }

    if (scrollStopTimeoutRef.current !== null) {
      window.clearTimeout(scrollStopTimeoutRef.current);
    }

    scrollStopTimeoutRef.current = window.setTimeout(() => {
      stopAllKicks();
      scrollStopTimeoutRef.current = null;
    }, KICK_STOP_DELAY_MS);

    lastProgressRef.current = latest;
  });

  useEffect(() => {
    return () => {
      if (scrollStopTimeoutRef.current !== null) {
        window.clearTimeout(scrollStopTimeoutRef.current);
        scrollStopTimeoutRef.current = null;
      }
      stopAllKicks();
    };
  }, [stopAllKicks]);

  return null;
};

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M7 4.75C7 4.34 7.34 4 7.75 4h2.5c.41 0 .75.34.75.75v14.5c0 .41-.34.75-.75.75h-2.5A.75.75 0 0 1 7 19.25V4.75Zm6 0c0-.41.34-.75.75-.75h2.5c.41 0 .75.34.75.75v14.5c0 .41-.34.75-.75.75h-2.5a.75.75 0 0 1-.75-.75V4.75Z" />
  </svg>
);
