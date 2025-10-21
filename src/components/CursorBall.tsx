"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const BALL_RADIUS = 22; // pixels; tweak to change both size and physics
const BALL_DIAMETER = BALL_RADIUS * 2;
const SPRING_STIFFNESS = 4;
const FRICTION = 0.35;
const MAX_SHADOW_STRETCH = 12;
const MAX_TILT_DEG = 10;
const MAX_SPEED = 120;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const toDegrees = (radians: number) => radians * (180 / Math.PI);

/**
 * Cursor-following ball with simple spring physics and motion-driven styling.
 * Gives the illusion of rolling by tying rotation to travel speed.
 */
export function CursorBall() {
  const baseX = useMotionValue(-999);
  const baseY = useMotionValue(-999);
  const rotation = useMotionValue(0);
  const tilt = useMotionValue(0);
  const stretch = useMotionValue(0);
  const scale = useMotionValue(1);
  const pressed = useMotionValue(0);
  const speedValue = useMotionValue(0);

  const shadowScaleX = useTransform(stretch, (value) => 1 + value / BALL_RADIUS);
  const shadowOpacity = useTransform(speedValue, (value) => (value > 30 ? Math.min(1, value / MAX_SPEED) : 0));
  const dropShadow = useTransform(speedValue, (value) =>
    value > 30 ? "0 24px 40px rgba(14, 20, 45, 0.28)" : "0 0 0 rgba(0,0,0,0)",
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef({ x: BALL_RADIUS, y: BALL_RADIUS });
  const targetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const initialisePosition = () => {
      const { innerWidth, innerHeight } = window;
      targetRef.current = { x: innerWidth / 2, y: innerHeight / 2 };
      positionRef.current = { x: innerWidth / 2, y: innerHeight / 2 };
      const { x: offsetX, y: offsetY } = offsetRef.current;
      baseX.set(innerWidth / 2 - offsetX);
      baseY.set(innerHeight / 2 - offsetY);
      rotation.set(0);
      tilt.set(0);
      stretch.set(0);
      scale.set(1);
      speedValue.set(0);
    };

    initialisePosition();
    window.addEventListener("resize", initialisePosition);
    return () => window.removeEventListener("resize", initialisePosition);
  }, [baseX, baseY, rotation, scale, speedValue, stretch, tilt]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      const next = {
        x: node.offsetWidth / 2,
        y: node.offsetHeight / 2,
      };
      offsetRef.current = next;
      const current = positionRef.current;
      baseX.set(current.x - next.x);
      baseY.set(current.y - next.y);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [baseX, baseY]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateTarget = (event: PointerEvent) => {
      if (!event.isTrusted) {
        return;
      }

      targetRef.current = { x: event.clientX, y: event.clientY };
      pressed.set(event.buttons > 0 ? 1 : 0);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!event.isTrusted) {
        return;
      }
      targetRef.current = { x: event.clientX, y: event.clientY };
      pressed.set(0);
    };

    window.addEventListener("pointermove", updateTarget, { passive: true });
    window.addEventListener("pointerdown", updateTarget, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", updateTarget);
      window.removeEventListener("pointerdown", updateTarget);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [pressed]);

  useEffect(() => {
    const step = (time: number) => {
      const last = lastTimeRef.current ?? time;
      const delta = Math.min((time - last) / 1000, 0.032);
      lastTimeRef.current = time;

      const target = targetRef.current;
      const position = positionRef.current;
      const velocity = velocityRef.current;
      const offset = offsetRef.current;

      const dx = target.x - position.x;
      const dy = target.y - position.y;

      const ax = dx * SPRING_STIFFNESS * delta;
      const ay = dy * SPRING_STIFFNESS * delta;

      velocity.x = (velocity.x + ax) * (1 - FRICTION);
      velocity.y = (velocity.y + ay) * (1 - FRICTION);

      let speed = Math.hypot(velocity.x, velocity.y);
      if (speed > MAX_SPEED) {
        const ratio = MAX_SPEED / speed;
        velocity.x *= ratio;
        velocity.y *= ratio;
        speed = MAX_SPEED;
      }

      position.x += velocity.x;
      position.y += velocity.y;

      positionRef.current = position;

      baseX.set(position.x - offset.x);
      baseY.set(position.y - offset.y);

      speedValue.set(speed);

      const tiltAmount = clamp(velocity.x * 0.12, -MAX_TILT_DEG, MAX_TILT_DEG);
      tilt.set(tiltAmount);

      const stretchAmount = Math.min(MAX_SHADOW_STRETCH, speed * 0.35);
      stretch.set(stretchAmount);

      const desiredScale = pressed.get() > 0 ? 0.92 : 1 - Math.min(speed / 2200, 0.07);
      const currentScale = scale.get();
      const lerpFactor = Math.min(delta * 10, 1);
      scale.set(currentScale + (desiredScale - currentScale) * lerpFactor);

      const direction = Math.sign(velocity.x || dx);
      const angularDistance = direction * (Math.abs(speed) / BALL_RADIUS) * delta;
      rotation.set(rotation.get() + toDegrees(angularDistance));

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [baseX, baseY, pressed, rotation, scale, speedValue, stretch, tilt]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ translateX: baseX, translateY: baseY, width: BALL_DIAMETER, height: BALL_DIAMETER }}
    >
      <motion.div
        className="relative h-full w-full rounded-full"
        style={{
          rotate: rotation,
          scale,
          transformStyle: "preserve-3d",
          boxShadow: dropShadow,
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(210,225,255,0.55) 45%, rgba(90,130,255,0.4) 70%, rgba(35,55,115,0.65))",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full opacity-80"
          style={{
            rotate: rotation,
            rotateX: tilt,
            background:
              "repeating-conic-gradient(from 0deg, transparent 0deg 30deg, rgba(38,53,100,0.35) 30deg 34deg)",
            maskImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 55%, rgba(255,255,255,0) 73%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 55%, rgba(255,255,255,0) 73%)",
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0) 70%)",
            rotateX: tilt,
          }}
        />
        <motion.div
          className="absolute bottom-[-45%] left-1/2 h-1/2 w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-t from-slate-900/40 to-transparent"
          style={{ scaleX: shadowScaleX, opacity: shadowOpacity }}
        />
      </motion.div>
    </motion.div>
  );
}
