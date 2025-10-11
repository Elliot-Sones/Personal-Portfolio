"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Fixed, decorative background that renders a stylized soccer pitch.
 * As the user scrolls, the canvas shifts vertically so the viewer
 * travels from one goal to the opposite end of the field.
 */
export function PitchBackground() {
  const { scrollYProgress } = useScroll();

  const translateY = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);
  const surfacePosition = useTransform(scrollYProgress, [0, 1], ["center top", "center 40%"]);

  return (
    <motion.div className="pitch-surface" aria-hidden style={{ backgroundPosition: surfacePosition }}>
      <motion.div className="pitch-canvas" style={{ translateY }}>
        <div className="pitch-lines">
          <div className="pitch-half-line" />
          <div className="pitch-center-circle" />
          <div className="pitch-center-spot" />

          <div className="pitch-penalty-area pitch-penalty-top" />
          <div className="pitch-penalty-area pitch-penalty-bottom" />

          <div className="pitch-six-yard pitch-six-yard-top" />
          <div className="pitch-six-yard pitch-six-yard-bottom" />

          <div className="pitch-penalty-spot pitch-penalty-spot-top" />
          <div className="pitch-penalty-spot pitch-penalty-spot-bottom" />

          <div className="pitch-arc pitch-arc-top" />
          <div className="pitch-arc pitch-arc-bottom" />

          <div className="pitch-corner pitch-corner-top-left" />
          <div className="pitch-corner pitch-corner-top-right" />
          <div className="pitch-corner pitch-corner-bottom-left" />
          <div className="pitch-corner pitch-corner-bottom-right" />
        </div>
      </motion.div>
    </motion.div>
  );
}
