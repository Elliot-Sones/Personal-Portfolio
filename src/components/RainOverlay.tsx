"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

interface Drop {
    x: number;
    y: number;
    length: number;
    speed: number;
}

interface Splash {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

export function RainOverlay() {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Don't run animation in light mode
        if (theme === "light") return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const drops: Drop[] = [];
        const splashes: Splash[] = [];
        let width = 0;
        let height = 0;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", resize);
        resize();

        // Initialize drops
        // A bit fewer drops for a "light rain" feel, or more for heavy.
        // Let's go for a lighter amount.
        const dropCount = Math.floor(width / 30);

        for (let i = 0; i < dropCount; i++) {
            drops.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 10 + 15, // Faster speed for rain
            });
        }

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Rain color: slight blue-ish tint, semi-transparent
            ctx.strokeStyle = "rgba(174, 194, 224, 0.4)";
            ctx.lineWidth = 1;
            ctx.lineCap = "round";

            // Draw Drops
            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];

                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.speed;

                // Reset if it hits bottom
                if (drop.y > height) {
                    // Create Splash
                    // Create a few droplets
                    const splashCount = Math.floor(Math.random() * 3) + 2;
                    for (let j = 0; j < splashCount; j++) {
                        splashes.push({
                            x: drop.x,
                            y: height,
                            vx: (Math.random() - 0.5) * 4, // Spread out x
                            vy: Math.random() * -4 - 2,    // Upward y
                            life: 1.0,
                        });
                    }

                    // Reset Drop to top
                    drop.y = -drop.length - Math.random() * 100; // Stagger re-entry
                    drop.x = Math.random() * width;
                }
            }

            // Draw Splashes
            for (let i = splashes.length - 1; i >= 0; i--) {
                const splash = splashes[i];

                ctx.fillStyle = `rgba(174, 194, 224, ${splash.life})`;
                ctx.beginPath();
                // Tiny circle for splash droplet
                ctx.arc(splash.x, splash.y, 1.5, 0, Math.PI * 2);
                ctx.fill();

                // Update Physics
                splash.x += splash.vx;
                splash.y += splash.vy;
                splash.vy += 0.3; // Gravity pulling splash down
                splash.life -= 0.05; // Fade out

                // Remove dead splashes
                if (splash.life <= 0) {
                    splashes.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    // Hide canvas in light mode
    if (theme === "light") {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-50 h-full w-full mix-blend-screen"
            aria-hidden="true"
        />
    );
}
