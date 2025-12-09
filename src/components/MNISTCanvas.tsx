"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MNISTCanvasProps {
    onPredict: (imageData: string) => void;
    isLoading?: boolean;
}

export function MNISTCanvas({ onPredict, isLoading = false }: MNISTCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    // Initialize canvas with white background
    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        initCanvas();
    }, [initCanvas]);

    const getCoordinates = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ): { x: number; y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if ("touches" in e) {
            const touch = e.touches[0];
            if (!touch) return null;
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY,
            };
        }

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const draw = (coords: { x: number; y: number }) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (lastPointRef.current) {
            ctx.beginPath();
            ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
        }

        lastPointRef.current = coords;
        setHasDrawn(true);
    };

    const handleStart = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        e.preventDefault();
        const coords = getCoordinates(e);
        if (!coords) return;

        setIsDrawing(true);
        lastPointRef.current = coords;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(coords.x, coords.y, 10, 0, Math.PI * 2);
            ctx.fill();
            setHasDrawn(true);
        }
    };

    const handleMove = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!isDrawing) return;
        e.preventDefault();
        const coords = getCoordinates(e);
        if (coords) draw(coords);
    };

    const handleEnd = () => {
        setIsDrawing(false);
        lastPointRef.current = null;
    };

    const handleClear = () => {
        initCanvas();
        setHasDrawn(false);
    };

    const handlePredict = () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasDrawn) return;

        const imageData = canvas.toDataURL("image/png");
        onPredict(imageData);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="mnist-canvas-container relative">
                <canvas
                    ref={canvasRef}
                    width={280}
                    height={280}
                    className="mnist-canvas cursor-crosshair touch-none"
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                />
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/60"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className="mnist-loader" />
                                <span className="text-xs uppercase tracking-[0.3em] text-muted">
                                    Analyzing...
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleClear}
                    className="pixel-btn bg-foreground/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-muted transition hover:text-accent"
                    disabled={isLoading}
                >
                    Clear
                </button>
                <button
                    onClick={handlePredict}
                    disabled={!hasDrawn || isLoading}
                    className="pixel-btn bg-accent/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-background transition hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Predicting..." : "Predict"}
                </button>
            </div>

            <p className="text-center text-xs uppercase tracking-[0.2em] text-muted/70">
                Draw a digit (0-9) on the canvas above
            </p>
        </div>
    );
}
