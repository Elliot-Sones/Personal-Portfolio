"use client";

import { useEffect, useRef, useState } from "react";
import { classify, parseCnnWeights, segmentCompose, type CnnWeights } from "@/lib/cnn-demo";

// Internal canvas buffer (2:1 like the model's 28×56 input); displayed at half size
const CW = 720;
const CH = 360;
const BRUSH = 26;

export default function CnnDigitDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const weightsRef = useRef<CnnWeights | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [result, setResult] = useState<{ probs: number[]; pred: number } | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CW, CH);
    }
    paintPreview(null);

    let cancelled = false;
    fetch("/ml-from-scratch/cnn-weights.bin")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.arrayBuffer();
      })
      .then((buf) => {
        if (cancelled) return;
        weightsRef.current = parseCnnWeights(buf);
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
      x: ((e.clientX - rect.left) * CW) / rect.width,
      y: ((e.clientY - rect.top) * CH) / rect.height,
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
    predict();
  }

  function paintPreview(composed: Float32Array | null) {
    const ctx = previewRef.current?.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(56, 28);
    for (let i = 0; i < 56 * 28; i++) {
      const v = composed ? Math.round(composed[i] * 255) : 0;
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  function predict() {
    const ctx = canvasRef.current?.getContext("2d");
    const weights = weightsRef.current;
    if (!ctx || !weights) return;
    const data = ctx.getImageData(0, 0, CW, CH).data;
    const gray = new Float32Array(CW * CH);
    for (let i = 0; i < gray.length; i++) {
      gray[i] = 255 - data[i * 4]; // invert: MNIST is white digits on black
    }
    const composed = segmentCompose(gray, CW, CH);
    paintPreview(composed);
    setResult(composed ? classify(weights, composed) : null);
  }

  function clear() {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CW, CH);
    }
    paintPreview(null);
    setResult(null);
  }

  const top5 = result
    ? result.probs
        .map((p, i) => ({ label: String(i).padStart(2, "0"), p }))
        .sort((a, b) => b.p - a.p)
        .slice(0, 5)
    : [];

  return (
    <div className="flex flex-col gap-6 p-5 lg:flex-row">
      <div className="flex flex-col gap-3">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="h-auto w-full max-w-[360px] cursor-crosshair touch-none rounded-[4px] border border-line bg-white"
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
            {status === "loading" && "loading weights · 3.2 mb"}
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
              {result ? String(result.pred).padStart(2, "0") : "··"}
            </div>
          </div>
          <div className="mb-1">
            <div className="font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.18em] text-mute">
              Model input · 28×56
            </div>
            <canvas
              ref={previewRef}
              width={56}
              height={28}
              className="mt-1.5 h-[56px] w-[112px] rounded-[2px] border border-line"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {(top5.length > 0
            ? top5
            : Array.from({ length: 5 }, () => ({ label: "··", p: 0 }))
          ).map((row, i) => (
            <div key={`${row.label}-${i}`} className="flex items-center gap-3">
              <span
                className={`w-5 font-[family-name:var(--font-jbmono)] text-[10px] ${i === 0 && result ? "text-ember" : "text-mute"}`}
              >
                {row.label}
              </span>
              <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-card">
                <div
                  className={`h-full rounded-full ${i === 0 && result ? "bg-ember" : "bg-line"} transition-[width] duration-300 motion-reduce:transition-none`}
                  style={{ width: `${Math.max(row.p * 100, row.p > 0 ? 1 : 0)}%` }}
                />
              </div>
              <span className="w-10 text-right font-[family-name:var(--font-jbmono)] text-[9.5px] text-mute">
                {result ? `${(row.p * 100).toFixed(1)}%` : ""}
              </span>
            </div>
          ))}
          <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[9px] uppercase tracking-[0.14em] text-mute">
            Top 5 of 100 classes · averaged over 7 augmented views
          </div>
        </div>
      </div>
    </div>
  );
}
