"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useTheme } from "./ThemeContext";

const CROWD_SOURCE = "/audio/soccernoise.mp3";
const RAIN_SOURCE = "/audio/rain.mp3";

const CROWD_MAX_VOLUME = 0.10;
const RAIN_VOLUME = 0.35; // Fixed rain volume for clarity
const DEFAULT_VOLUME = 0.05; // Quieter initial volume
const KICK_VOLUME = 0.35;
const FADE_IN_DURATION_MS = 3000; // 3 second fade-in

export function AudioPlayer() {
  const { theme, toggleTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const rainAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fadeMultiplier, setFadeMultiplier] = useState(0); // 0 to 1 for fade-in
  // Tracks whether we already attached a one-time user gesture handler
  // to unlock audio (needed because many browsers block autoplay with sound).
  const gestureHandlerAttachedRef = useRef(false);
  // Tracks whether the user has previously unlocked audio on this site.
  // If true, we can try unmuted autoplay first on subsequent visits.
  const hasUnlockedRef = useRef(false);

  // Fade-in effect on mount
  useEffect(() => {
    const startTime = performance.now();
    let animationId: number;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / FADE_IN_DURATION_MS, 1);
      // Use easeOutQuad for smooth fade
      const eased = 1 - (1 - progress) * (1 - progress);
      setFadeMultiplier(eased);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Handle rain audio based on theme
  useEffect(() => {
    const rainAudio = rainAudioRef.current;
    if (!rainAudio) return;

    if (theme === "light") {
      // Pause rain audio in light mode
      rainAudio.pause();
    } else {
      // Resume rain audio in dark mode at fixed volume
      rainAudio.volume = RAIN_VOLUME;
      if (isPlaying) {
        void rainAudio.play().catch(() => { });
      }
    }
  }, [theme, isPlaying, volume]);

  // Apply fade multiplier to audio volumes
  useEffect(() => {
    const audio = audioRef.current;
    const rainAudio = rainAudioRef.current;
    if (!audio) return;

    // Apply fade multiplier to crowd volume
    audio.volume = volume * fadeMultiplier;
    if (rainAudio) {
      rainAudio.volume = RAIN_VOLUME * fadeMultiplier;
    }
  }, [volume, fadeMultiplier]);

  useEffect(() => {
    const audio = audioRef.current;
    const rainAudio = rainAudioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);
    audio.loop = true;

    // Setup rain audio
    if (rainAudio) {
      rainAudio.loop = true;
    }

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
        } catch { }

        // Ensure audio is audible and playing after a real user gesture
        audio.muted = false;
        audio.volume = volume;
        void audio.play().catch(() => { });

        // Also play rain audio
        if (rainAudio) {
          rainAudio.muted = false;
          rainAudio.volume = RAIN_VOLUME;
          void rainAudio.play().catch(() => { });
        }

        removeGestureHandlers();
      };

      const removeGestureHandlers = () => {
        window.removeEventListener("pointerdown", onFirstGesture);
        window.removeEventListener("touchstart", onFirstGesture, { capture: true });
        window.removeEventListener("keydown", onFirstGesture);
        window.removeEventListener("scroll", onFirstGesture);
      };

      window.addEventListener("pointerdown", onFirstGesture, { once: true });
      window.addEventListener("touchstart", onFirstGesture, { once: true, capture: true });
      window.addEventListener("keydown", onFirstGesture, { once: true });
      window.addEventListener("scroll", onFirstGesture, { once: true, passive: true });

      // Also try when tab becomes visible (helps when landing on a background tab)
      const onVisibility = () => {
        if (document.visibilityState === "visible") {
          void audio.play().catch(() => { });
          if (rainAudio) void rainAudio.play().catch(() => { });
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
          // Also play rain
          if (rainAudio) {
            rainAudio.muted = false;
            rainAudio.volume = RAIN_VOLUME;
            void rainAudio.play().catch(() => { });
          }
          return;
        }

        // Normal attempt: play with current settings
        audio.muted = false;
        audio.volume = volume;
        await audio.play();
        // Also play rain
        if (rainAudio) {
          rainAudio.muted = false;
          rainAudio.volume = RAIN_VOLUME;
          void rainAudio.play().catch(() => { });
        }
      } catch {
        // If blocked, fall back to muted autoplay (allowed on most browsers)
        try {
          audio.muted = true;
          await audio.play();
          if (rainAudio) {
            rainAudio.muted = true;
            void rainAudio.play().catch(() => { });
          }
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
        } catch { }
      });
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    const rainAudio = rainAudioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      if (rainAudio) rainAudio.pause();
      setIsPlaying(false);
      return;
    }

    // If user explicitly toggles play, ensure we are unmuted and audible
    audio.muted = false;
    audio.volume = volume;
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });

    // Also play rain audio only in dark mode
    if (rainAudio && theme === "dark") {
      rainAudio.muted = false;
      rainAudio.volume = RAIN_VOLUME;
      void rainAudio.play().catch(() => { });
    }
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    setVolume(Math.min(Math.max(nextVolume, 0), CROWD_MAX_VOLUME));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <KickSoundController />
      <div
        className={`group relative flex flex-col items-center justify-center pixel-card transition-all duration-300 ease-in-out ${isExpanded
          ? "min-h-[10rem] w-56 gap-3 px-6 pt-4 pb-5 scale-100"
          : "h-12 w-28 gap-0 px-2 py-0 sm:h-14 sm:w-32 hover:scale-105"
          }`}
        style={{
          transformOrigin: 'bottom right',
          background: '#5a4a3a'
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Main buttons row */}
        <div className={`flex items-center gap-2 ${isExpanded ? "translate-y-0.5" : ""}`}>
          <button
            type="button"
            onClick={togglePlayback}
            className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center pixel-btn bg-[#8b7355]/60 text-[#f0e6d2] transition-all duration-300 ease-out hover:bg-[#a08060] hover:text-white"
            aria-label={isPlaying ? "Pause stadium atmosphere" : "Play stadium atmosphere"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          {/* Theme toggle - always visible, positioned side-by-side */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`grid h-10 w-10 sm:h-11 sm:w-11 place-items-center pixel-btn text-[#f0e6d2] transition-all duration-300 ease-out hover:text-white ${theme === "light"
              ? "bg-[#d4a84b]/70 hover:bg-[#e8bc5a]"
              : "bg-[#7a9fc4]/50 hover:bg-[#8fb3d6]"
              }`}
            aria-label={theme === "light" ? "Switch to dark mode (rainy)" : "Switch to light mode (sunny)"}
          >
            {theme === "light" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
        <div
          className={`w-full max-w-[13rem] overflow-hidden transition-all duration-300 ease-out ${isExpanded
            ? "pointer-events-auto -translate-y-0.5 opacity-100 max-h-32"
            : "pointer-events-none -translate-y-2 opacity-0 max-h-0"
            }`}
          aria-hidden={!isExpanded}
        >
          <div className="flex flex-col items-center gap-1.5">
            <label className="text-center text-[10px] uppercase tracking-[0.25em] text-[#f0e6d2]/80" htmlFor="audio-volume">
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
              className="w-full accent-[#d4a84b]"
              aria-valuemin={0}
              aria-valuemax={CROWD_MAX_VOLUME}
              aria-valuenow={Number(volume.toFixed(2))}
            />
          </div>
          {/* Theme label */}
          <div className="mt-2 text-center text-[9px] uppercase tracking-[0.2em] text-[#f0e6d2]/60">
            {theme === "light" ? "Sunny Day" : "Rainy Night"}
          </div>
        </div>
      </div>
      {/*
        We do not set the muted attribute by default; we attempt audible autoplay first
        and only fall back to muted autoplay in code when policies block sound.
        playsInline improves autoplay behavior on iOS Safari.
      */}
      <audio ref={audioRef} src={CROWD_SOURCE} preload="auto" autoPlay loop playsInline />
      <audio ref={rainAudioRef} src={RAIN_SOURCE} preload="auto" loop playsInline />
    </div>
  );
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
    {/* Pixel-styled play icon using rectangles */}
    <rect x="8" y="6" width="2" height="2" />
    <rect x="8" y="16" width="2" height="2" />
    <rect x="10" y="8" width="2" height="2" />
    <rect x="10" y="14" width="2" height="2" />
    <rect x="12" y="10" width="2" height="2" />
    <rect x="12" y="12" width="2" height="2" />
    <rect x="14" y="11" width="2" height="2" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
    {/* Pixel-styled sun icon */}
    {/* Center */}
    <rect x="10" y="10" width="4" height="4" />
    {/* Top ray */}
    <rect x="11" y="5" width="2" height="3" />
    {/* Bottom ray */}
    <rect x="11" y="16" width="2" height="3" />
    {/* Left ray */}
    <rect x="5" y="11" width="3" height="2" />
    {/* Right ray */}
    <rect x="16" y="11" width="3" height="2" />
    {/* Diagonal rays */}
    <rect x="7" y="7" width="2" height="2" />
    <rect x="15" y="7" width="2" height="2" />
    <rect x="7" y="15" width="2" height="2" />
    <rect x="15" y="15" width="2" height="2" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
    {/* Pixel-styled moon/cloud icon for rainy mode */}
    {/* Cloud shape */}
    <rect x="8" y="8" width="2" height="2" />
    <rect x="10" y="7" width="4" height="2" />
    <rect x="14" y="8" width="2" height="2" />
    <rect x="6" y="10" width="2" height="2" />
    <rect x="8" y="10" width="8" height="4" />
    <rect x="16" y="10" width="2" height="2" />
    <rect x="7" y="14" width="10" height="2" />
    {/* Rain drops */}
    <rect x="9" y="17" width="1" height="2" />
    <rect x="12" y="18" width="1" height="2" />
    <rect x="15" y="17" width="1" height="2" />
  </svg>
);

const KickSoundController = () => {
  const baseKickRef = useRef<HTMLAudioElement | null>(null);
  const activeKicksRef = useRef(new Map<HTMLAudioElement, () => void>());

  const stopAllKicks = useCallback(() => {
    const entries = Array.from(activeKicksRef.current.entries());
    entries.forEach(([kick, cleanup]) => {
      kick.pause();
      kick.currentTime = 0;
      cleanup();
    });
  }, []);

  const playKick = useCallback(
    () => {
      const baseKick = baseKickRef.current;
      if (!baseKick) {
        return;
      }

      const kick = baseKick.cloneNode(true) as HTMLAudioElement;
      kick.volume = KICK_VOLUME;
      kick.currentTime = 0; // Always start from beginning (audio is now trimmed)

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
    baseKickRef.current = audio;

    // Add global click handler to play kick sound
    const handleClick = () => {
      playKick(); // Play kick on click
    };
    window.addEventListener("click", handleClick);

    return () => {
      audio.pause();
      window.removeEventListener("click", handleClick);
      baseKickRef.current = null;
      stopAllKicks();
    };
  }, [stopAllKicks, playKick]);

  return null;
};

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
    {/* Pixel-styled pause icon - two vertical bars */}
    <rect x="8" y="6" width="3" height="12" />
    <rect x="13" y="6" width="3" height="12" />
  </svg>
);
