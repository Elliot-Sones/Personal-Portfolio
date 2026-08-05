"use client";

import { useEffect, useRef, useState } from "react";
import { forward, parseWeights, preprocess, type MlpWeights } from "@/lib/mlp-demo";

// Internal canvas buffer; displayed at half size so strokes stay crisp on retina
const CANVAS = 560;
const BRUSH = 34;

export default function MlpDigitDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const weightsRef = useRef<MlpWeights | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [result, setResult] = useState<{ probs: number[]; pred: number } | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CANVAS, CANVAS);
    }
    paintPreview(null);

    let cancelled = false;
    fetch("/ml-from-scratch/mlp-weights.bin")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.arrayBuffer();
      })
      .then((buf) => {
        if (cancelled) return;
        weightsRef.current = parseWeights(buf);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * CANVAS) / rect.width,
      y: ((e.clientY - rect.top) * CANVAS) / rect.height,
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = pos(e);
    last.current = p;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(p.x, p.y, BRUSH / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const p = pos(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = BRUSH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  }

  function onPointerUp() {
    drawing.current = false;
    last.current = null;
    classify();
  }

  function paintPreview(arr28: Float32Array | null) {
    const ctx = previewRef.current?.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(28, 28);
    for (let i = 0; i < 784; i++) {
      const v = arr28 ? Math.round(arr28[i] * 255) : 0;
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  function classify() {
    const ctx = canvasRef.current?.getContext("2d");
    const weights = weightsRef.current;
    if (!ctx || !weights) return;
    const data = ctx.getImageData(0, 0, CANVAS, CANVAS).data;
    const gray = new Float32Array(CANVAS * CANVAS);
    for (let i = 0; i < gray.length; i++) {
      gray[i] = 255 - data[i * 4]; // invert: MNIST is a white digit on black
    }
    const arr28 = preprocess(gray, CANVAS);
    paintPreview(arr28);
    setResult(arr28 ? forward(weights, arr28) : null);
  }

  function clear() {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CANVAS, CANVAS);
    }
    paintPreview(null);
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-6 p-5 sm:flex-row">
      <div className="flex flex-col gap-3">
        <canvas
          ref={canvasRef}
          width={CANVAS}
          height={CANVAS}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="h-[280px] w-[280px] cursor-crosshair touch-none rounded-[4px] border border-line bg-white"
        />
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={clear}
            className="rounded-[4px] border border-line px-3 py-1.5 font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.14em] text-inksoft transition-colors hover:border-ember hover:text-ember"
          >
            Clear
          </button>
          <span className="font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.14em] text-mute">
            {status === "loading" && "loading weights · 0.9 mb"}
            {status === "error" && "weights failed to load"}
            {status === "ready" && "no server · runs in your browser"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5">
        <div className="flex items-end gap-6">
          <div>
            <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.18em] text-mute">
              Prediction
            </div>
            <div className="font-[family-name:var(--font-fraunces)] text-[56px] font-medium leading-none text-ink">
              {result ? result.pred : "·"}
            </div>
          </div>
          <div className="mb-1">
            <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.18em] text-mute">
              Model input · 28×28
            </div>
            <canvas
              ref={previewRef}
              width={28}
              height={28}
              className="mt-1.5 h-[56px] w-[56px] rounded-[2px] border border-line"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 10 }, (_, d) => {
            const p = result ? result.probs[d] : 0;
            const top = result !== null && result.pred === d;
            return (
              <div key={d} className="flex items-center gap-3">
                <span
                  className={`w-3 font-[family-name:var(--font-jbmono)] text-[10px] ${top ? "text-ember" : "text-mute"}`}
                >
                  {d}
                </span>
                <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-card">
                  <div
                    className={`h-full rounded-full ${top ? "bg-ember" : "bg-line"} transition-[width] duration-300 motion-reduce:transition-none`}
                    style={{ width: `${Math.max(p * 100, p > 0 ? 1 : 0)}%` }}
                  />
                </div>
                <span className="w-10 text-right font-[family-name:var(--font-jbmono)] text-[9.5px] text-mute">
                  {result ? `${(p * 100).toFixed(1)}%` : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
