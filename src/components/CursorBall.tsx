"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ARTBOARD = "Artboard";
const STATE_MACHINE = "State Machine 1";
const PRESSED_INPUT = "Pressed";

type RiveBooleanInput = {
  name: string;
  value: boolean;
};

type RivePlayerElement = HTMLElement & {
  src: string;
  autoplay?: boolean;
  artboard?: string;
  alignment?: string;
  fit?: string;
  stateMachines?: string | string[];
  rive?: {
    stateMachineInputs: (artboardName: string, stateMachineName: string) => Array<{
      name: string;
      value: boolean | number;
      fire?: () => void;
    }>;
  };
};

/**
 * Renders the cursor-following soccer ball that reacts to presses.
 * The ball is driven by a Rive state machine and smoothly trails pointer movement.
 */
export function CursorBall() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<RivePlayerElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const pressedInputRef = useRef<RiveBooleanInput | null>(null);
  const offsetRef = useRef({ x: 32, y: 32 });
  const riveLoadResolverRef = useRef<(() => void) | null>(null);

  const baseX = useMotionValue(-999);
  const baseY = useMotionValue(-999);
  const x = useSpring(baseX, { stiffness: 220, damping: 28, mass: 0.6 });
  const y = useSpring(baseY, { stiffness: 220, damping: 28, mass: 0.6 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateOffset = () => {
      offsetRef.current = {
        x: node.offsetWidth / 2,
        y: node.offsetHeight / 2,
      };
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateInitialPosition = () => {
      const { innerWidth, innerHeight } = window;
      const { x: offsetX, y: offsetY } = offsetRef.current;
      baseX.set(innerWidth / 2 - offsetX);
      baseY.set(innerHeight / 2 - offsetY);
    };

    updateInitialPosition();
    window.addEventListener("resize", updateInitialPosition);
    return () => window.removeEventListener("resize", updateInitialPosition);
  }, [baseX, baseY]);

  useEffect(() => {
    const container = playerContainerRef.current;
    if (!container) {
      return;
    }

    let disposed = false;
    let player: RivePlayerElement | null = null;

    const cachePressedInput = () => {
      if (!player) {
        return;
      }
      const rive = player.rive;
      if (!rive) {
        pressedInputRef.current = null;
        return;
      }
      const inputs = rive.stateMachineInputs(ARTBOARD, STATE_MACHINE);
      if (!Array.isArray(inputs)) {
        return;
      }

      const pressed = inputs.find(
        (input): input is RiveBooleanInput => input.name === PRESSED_INPUT && typeof input.value === "boolean",
      );

      pressedInputRef.current = pressed ?? null;
    };

    const mountPlayer = () => {
      if (disposed || !container || player) {
        return;
      }

      const instance = document.createElement("rive-player") as RivePlayerElement;
      instance.className =
        "absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 bg-transparent";
      instance.setAttribute("src", "/rive/cursor_ball.riv");
      instance.setAttribute("artboard", ARTBOARD);
      instance.setAttribute("fit", "contain");
      instance.setAttribute("alignment", "center");
      instance.setAttribute("autoplay", "true");
      (instance as unknown as { src: string }).src = "/rive/cursor_ball.riv";
      (instance as unknown as { artboard?: string }).artboard = ARTBOARD;
      (instance as unknown as { fit?: string }).fit = "contain";
      (instance as unknown as { alignment?: string }).alignment = "center";
      (instance as unknown as { autoplay?: boolean }).autoplay = true;
      if ("stateMachines" in instance) {
        (instance as unknown as { stateMachines?: string | string[] }).stateMachines = STATE_MACHINE;
      } else {
        instance.setAttribute("state-machines", STATE_MACHINE);
      }

      instance.addEventListener("load", cachePressedInput);
      container.appendChild(instance);

      player = instance;
      playerRef.current = instance;

      if (player.rive) {
        cachePressedInput();
      }
    };

    if (typeof window !== "undefined") {
      if (customElements.get("rive-player")) {
        mountPlayer();
      } else {
        const resolve = () => {
          riveLoadResolverRef.current = null;
          mountPlayer();
        };
        riveLoadResolverRef.current = resolve;
        customElements.whenDefined("rive-player").then(resolve).catch(() => {
          riveLoadResolverRef.current = null;
        });
      }
    }

    return () => {
      disposed = true;
      if (riveLoadResolverRef.current) {
        riveLoadResolverRef.current = null;
      }
      if (player) {
        player.removeEventListener("load", cachePressedInput);
        if (container.contains(player)) {
          container.removeChild(player);
        }
      }
      playerRef.current = null;
      pressedInputRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const setPressed = (value: boolean) => {
      if (pressedInputRef.current) {
        pressedInputRef.current.value = value;
      }
    };

    const updatePosition = (event: PointerEvent) => {
      const { x: offsetX, y: offsetY } = offsetRef.current;
      baseX.set(event.clientX - offsetX);
      baseY.set(event.clientY - offsetY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!event.isTrusted) {
        return;
      }
      updatePosition(event);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isTrusted) {
        return;
      }
      updatePosition(event);
      setPressed(true);
    };

    const releasePress = () => {
      setPressed(false);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!event.isTrusted) {
        return;
      }
      updatePosition(event);
      releasePress();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        releasePress();
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [baseX, baseY]);

  return (
    <motion.div
      ref={containerRef}
      className="pointer-events-none fixed left-0 top-0 z-50 h-32 w-32 overflow-hidden md:h-40 md:w-40"
      style={{ translateX: x, translateY: y }}
      aria-hidden
    >
      <div className="relative h-full w-full" style={{ clipPath: "circle(48% at 50% 50%)" }}>
        <div ref={playerContainerRef} className="absolute inset-0" />
        <div className="absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 opacity-0" />
      </div>
    </motion.div>
  );
}
