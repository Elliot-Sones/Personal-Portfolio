"use client";

import { useTheme } from "./ThemeContext";

export function PixelSun() {
  const { theme } = useTheme();

  if (theme !== "light") return null;

  const pixelSize = 6;
  const rayLength = 24;

  return (
    <div className="fixed top-8 right-8 sm:top-12 sm:right-12 pointer-events-none z-[5]">
      <div
        className="relative animate-sun-pulse"
        style={{
          width: pixelSize * 12,
          height: pixelSize * 12,
        }}
      >
        {/* Sun core - pixelated circle made of squares */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: pixelSize * 8,
              height: pixelSize * 8,
            }}
          >
            {/* Core rows - building a pixelated circle */}
            {/* Row 1 - top */}
            <div
              className="absolute bg-[#ffd93d]"
              style={{
                width: pixelSize * 4,
                height: pixelSize,
                left: pixelSize * 2,
                top: 0
              }}
            />
            {/* Row 2 */}
            <div
              className="absolute bg-[#ffe066]"
              style={{
                width: pixelSize * 6,
                height: pixelSize,
                left: pixelSize,
                top: pixelSize
              }}
            />
            {/* Row 3 */}
            <div
              className="absolute bg-[#ffec99]"
              style={{
                width: pixelSize * 8,
                height: pixelSize,
                left: 0,
                top: pixelSize * 2
              }}
            />
            {/* Row 4 - center */}
            <div
              className="absolute bg-[#fff4cc]"
              style={{
                width: pixelSize * 8,
                height: pixelSize,
                left: 0,
                top: pixelSize * 3
              }}
            />
            {/* Row 5 - center */}
            <div
              className="absolute bg-[#fff4cc]"
              style={{
                width: pixelSize * 8,
                height: pixelSize,
                left: 0,
                top: pixelSize * 4
              }}
            />
            {/* Row 6 */}
            <div
              className="absolute bg-[#ffec99]"
              style={{
                width: pixelSize * 8,
                height: pixelSize,
                left: 0,
                top: pixelSize * 5
              }}
            />
            {/* Row 7 */}
            <div
              className="absolute bg-[#ffe066]"
              style={{
                width: pixelSize * 6,
                height: pixelSize,
                left: pixelSize,
                top: pixelSize * 6
              }}
            />
            {/* Row 8 - bottom */}
            <div
              className="absolute bg-[#ffd93d]"
              style={{
                width: pixelSize * 4,
                height: pixelSize,
                left: pixelSize * 2,
                top: pixelSize * 7
              }}
            />
          </div>
        </div>

        {/* Sun rays - 8 directions */}
        {/* Top ray */}
        <div
          className="absolute bg-[#ffd93d] animate-ray-pulse"
          style={{
            width: pixelSize,
            height: rayLength,
            left: '50%',
            top: -rayLength - 4,
            marginLeft: -pixelSize / 2,
          }}
        />
        {/* Bottom ray */}
        <div
          className="absolute bg-[#ffd93d] animate-ray-pulse"
          style={{
            width: pixelSize,
            height: rayLength,
            left: '50%',
            bottom: -rayLength - 4,
            marginLeft: -pixelSize / 2,
            animationDelay: '0.1s',
          }}
        />
        {/* Left ray */}
        <div
          className="absolute bg-[#ffd93d] animate-ray-pulse"
          style={{
            width: rayLength,
            height: pixelSize,
            left: -rayLength - 4,
            top: '50%',
            marginTop: -pixelSize / 2,
            animationDelay: '0.2s',
          }}
        />
        {/* Right ray */}
        <div
          className="absolute bg-[#ffd93d] animate-ray-pulse"
          style={{
            width: rayLength,
            height: pixelSize,
            right: -rayLength - 4,
            top: '50%',
            marginTop: -pixelSize / 2,
            animationDelay: '0.3s',
          }}
        />
        {/* Top-left diagonal ray */}
        <div
          className="absolute bg-[#ffe066] animate-ray-pulse"
          style={{
            width: pixelSize,
            height: rayLength * 0.7,
            left: pixelSize,
            top: -rayLength * 0.5,
            transform: 'rotate(-45deg)',
            transformOrigin: 'bottom center',
            animationDelay: '0.4s',
          }}
        />
        {/* Top-right diagonal ray */}
        <div
          className="absolute bg-[#ffe066] animate-ray-pulse"
          style={{
            width: pixelSize,
            height: rayLength * 0.7,
            right: pixelSize,
            top: -rayLength * 0.5,
            transform: 'rotate(45deg)',
            transformOrigin: 'bottom center',
            animationDelay: '0.5s',
          }}
        />
        {/* Bottom-left diagonal ray */}
        <div
          className="absolute bg-[#ffe066] animate-ray-pulse"
          style={{
            width: pixelSize,
            height: rayLength * 0.7,
            left: pixelSize,
            bottom: -rayLength * 0.5,
            transform: 'rotate(45deg)',
            transformOrigin: 'top center',
            animationDelay: '0.6s',
          }}
        />
        {/* Bottom-right diagonal ray */}
        <div
          className="absolute bg-[#ffe066] animate-ray-pulse"
          style={{
            width: pixelSize,
            height: rayLength * 0.7,
            right: pixelSize,
            bottom: -rayLength * 0.5,
            transform: 'rotate(-45deg)',
            transformOrigin: 'top center',
            animationDelay: '0.7s',
          }}
        />

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full animate-sun-glow"
          style={{
            background: 'radial-gradient(circle, rgba(255, 217, 61, 0.4) 0%, rgba(255, 217, 61, 0) 70%)',
            transform: 'scale(2.5)',
          }}
        />
      </div>
    </div>
  );
}
