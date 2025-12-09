"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

// Pixel cloud component - blocky cloud shape
const PixelCloud = ({
  left,
  top,
  scale = 1,
  speed = 30,
  delay = 0
}: {
  left: number;
  top: number;
  scale?: number;
  speed?: number;
  delay?: number;
}) => {
  const baseSize = 8; // Base pixel size
  const s = baseSize * scale;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        animation: `cloudFloat ${speed}s linear ${delay}s infinite`,
        opacity: 0.6,
      }}
    >
      {/* Pixel cloud shape - made of rectangles */}
      <div className="relative" style={{ filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.1))" }}>
        {/* Top row */}
        <div
          className="absolute bg-[#e8f4e8]"
          style={{ width: s * 2, height: s, left: s * 2, top: 0 }}
        />
        <div
          className="absolute bg-[#e8f4e8]"
          style={{ width: s * 2, height: s, left: s * 5, top: 0 }}
        />
        {/* Second row */}
        <div
          className="absolute bg-[#e8f4e8]"
          style={{ width: s * 3, height: s, left: s, top: s }}
        />
        <div
          className="absolute bg-[#e8f4e8]"
          style={{ width: s * 4, height: s, left: s * 4, top: s }}
        />
        {/* Middle row - main body */}
        <div
          className="absolute bg-[#f4faf4]"
          style={{ width: s * 8, height: s, left: 0, top: s * 2 }}
        />
        {/* Bottom row */}
        <div
          className="absolute bg-[#dceadc]"
          style={{ width: s * 6, height: s, left: s, top: s * 3 }}
        />
      </div>
    </div>
  );
};

// Pixel raindrop - simple rectangle
const PixelRaindrop = ({
  left,
  delay,
  duration
}: {
  left: number;
  delay: number;
  duration: number;
}) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: "-20px",
        animation: `rainFall ${duration}s linear ${delay}s infinite`,
      }}
    >
      <div
        className="bg-[#a8c8d8]"
        style={{
          width: "3px",
          height: "12px",
          opacity: 0.7,
          boxShadow: "0 0 2px rgba(168, 200, 216, 0.5)"
        }}
      />
    </div>
  );
};

// Pixel grass tuft - blocky grass shape
const PixelGrass = ({
  left,
  variant = 0
}: {
  left: number;
  variant?: number;
}) => {
  const colors = [
    { light: "#5a8a5a", dark: "#3a6a3a" },
    { light: "#4a7a4a", dark: "#2a5a2a" },
    { light: "#6a9a6a", dark: "#4a7a4a" },
  ];
  const color = colors[variant % colors.length];

  return (
    <div
      className="absolute bottom-0 pointer-events-none"
      style={{ left: `${left}%` }}
    >
      {/* Grass blade pattern */}
      <div className="relative">
        <div
          style={{
            width: "4px",
            height: "16px",
            backgroundColor: color.dark,
            position: "absolute",
            bottom: 0,
            left: 0
          }}
        />
        <div
          style={{
            width: "4px",
            height: "24px",
            backgroundColor: color.light,
            position: "absolute",
            bottom: 0,
            left: "6px"
          }}
        />
        <div
          style={{
            width: "4px",
            height: "20px",
            backgroundColor: color.dark,
            position: "absolute",
            bottom: 0,
            left: "12px"
          }}
        />
        <div
          style={{
            width: "4px",
            height: "12px",
            backgroundColor: color.light,
            position: "absolute",
            bottom: 0,
            left: "18px"
          }}
        />
      </div>
    </div>
  );
};


export function PixelDecorations() {
  const { theme } = useTheme();
  const [raindrops, setRaindrops] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate raindrops only for dark mode
    if (theme === "light") {
      setRaindrops([]);
      return;
    }

    const drops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 0.5,
    }));
    setRaindrops(drops);
  }, [theme]);

  // In light mode, don't render clouds or rain
  if (theme === "light") {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {/* Pixel clouds - floating across the top */}
      <PixelCloud left={-10} top={5} scale={1.2} speed={45} delay={0} />
      <PixelCloud left={20} top={8} scale={0.8} speed={50} delay={5} />
      <PixelCloud left={50} top={3} scale={1} speed={40} delay={10} />
      <PixelCloud left={75} top={10} scale={0.9} speed={55} delay={15} />
      <PixelCloud left={90} top={6} scale={1.1} speed={48} delay={8} />

      {/* Pixel rain */}
      <div className="absolute inset-0">
        {raindrops.map((drop) => (
          <PixelRaindrop
            key={drop.id}
            left={drop.left}
            delay={drop.delay}
            duration={drop.duration}
          />
        ))}
      </div>
    </div>
  );
}
