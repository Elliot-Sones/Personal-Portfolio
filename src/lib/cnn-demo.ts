import { parseTensors } from "@/lib/weights";

// Runs the from-scratch NumPy CNN (Conv16 → Conv32 → FC256 → FC100) directly
// in the browser, ported from the Hugging Face space's app.py + training-100.py.
// Pipeline: split the canvas into two digits (valley → components → center
// fallback), canonicalize each into a centered 28×28 MNIST-style tile,
// concatenate to 28×56, auto-balance stroke mass, build the space's 7
// test-time-augmentation variants (identity, 4 shifts, dilate, erode),
// standardize each, and average the softmax outputs.

const H = 28;
const W = 56;

export interface CnnWeights {
  conv1_W: Float32Array; // (16, 1, 3, 3)
  conv1_b: Float32Array; // (16)
  conv2_W: Float32Array; // (32, 16, 3, 3)
  conv2_b: Float32Array; // (32)
  fc1_W: Float32Array; // (256, 3136)
  fc1_b: Float32Array; // (256)
  fc2_W: Float32Array; // (100, 256)
  fc2_b: Float32Array; // (100)
  mean: Float32Array; // (1568)
  std: Float32Array; // (1568)
}

export function parseCnnWeights(buf: ArrayBuffer): CnnWeights {
  return parseTensors(buf) as unknown as CnnWeights;
}

// Python's round(): half rounds to the nearest even integer
function pythonRound(v: number): number {
  const floor = Math.floor(v);
  const diff = v - floor;
  if (diff > 0.5) return floor + 1;
  if (diff < 0.5) return floor;
  return floor % 2 === 0 ? floor : floor + 1;
}

function bbox(mask: (i: number) => boolean, w: number, h: number) {
  let yMin = h, yMax = -1, xMin = w, xMax = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask(y * w + x)) {
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
        if (x < xMin) xMin = x;
        if (x > xMax) xMax = x;
      }
    }
  }
  return yMax < 0 ? null : { yMin, yMax, xMin, xMax };
}

function crop(src: Float32Array, w: number, y1: number, y2: number, x1: number, x2: number) {
  const ch = y2 - y1;
  const cw = x2 - x1;
  const out = new Float32Array(ch * cw);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) out[y * cw + x] = src[(y + y1) * w + (x + x1)];
  }
  return { data: out, w: cw, h: ch };
}

// Area-average resize (box filter), close to the LANCZOS resample app.py uses
function resize(src: Float32Array, sw: number, sh: number, dw: number, dh: number): Float32Array {
  const out = new Float32Array(dw * dh);
  const sx = sw / dw;
  const sy = sh / dh;
  for (let dy = 0; dy < dh; dy++) {
    const y0 = dy * sy;
    const y1 = (dy + 1) * sy;
    for (let dx = 0; dx < dw; dx++) {
      const x0 = dx * sx;
      const x1 = (dx + 1) * sx;
      let sum = 0;
      let weight = 0;
      for (let py = Math.floor(y0); py < Math.ceil(y1); py++) {
        const wy = Math.min(py + 1, y1) - Math.max(py, y0);
        for (let px = Math.floor(x0); px < Math.ceil(x1); px++) {
          const wx = Math.min(px + 1, x1) - Math.max(px, x0);
          sum += src[py * sw + px] * wy * wx;
          weight += wy * wx;
        }
      }
      out[dy * dw + dx] = weight > 0 ? sum / weight : 0;
    }
  }
  return out;
}

function shiftZeroPad(arr: Float32Array, w: number, h: number, dy: number, dx: number): Float32Array {
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const sy = y - dy;
    if (sy < 0 || sy >= h) continue;
    for (let x = 0; x < w; x++) {
      const sx = x - dx;
      if (sx < 0 || sx >= w) continue;
      out[y * w + x] = arr[sy * w + sx];
    }
  }
  return out;
}

// app.py's canonicalize_digit_28x28: crop to the digit, resize the longer side
// to 20 keeping aspect, paste centered, then nudge to the center of mass
function canonicalize(tileSrc: { data: Float32Array; w: number; h: number } | null): Float32Array {
  const out = new Float32Array(H * H);
  if (!tileSrc) return out;
  const { data, w, h } = tileSrc;
  const b = bbox((i) => data[i] > 0.05, w, h);
  if (!b) return out;
  const pad = 2;
  const y1 = Math.max(0, b.yMin - pad);
  const x1 = Math.max(0, b.xMin - pad);
  const y2 = Math.min(h, b.yMax + 1 + pad);
  const x2 = Math.min(w, b.xMax + 1 + pad);
  const c = crop(data, w, y1, y2, x1, x2);

  let nh: number, nw: number;
  if (c.h >= c.w) {
    nh = 20;
    nw = Math.max(1, pythonRound(c.w * (20 / c.h)));
  } else {
    nw = 20;
    nh = Math.max(1, pythonRound(c.h * (20 / c.w)));
  }
  const small = resize(c.data, c.w, c.h, nw, nh);

  const top = Math.floor((H - nh) / 2);
  const left = Math.floor((H - nw) / 2);
  for (let y = 0; y < nh; y++) {
    for (let x = 0; x < nw; x++) out[(y + top) * H + (x + left)] = small[y * nw + x];
  }

  let total = 0, cy = 0, cx = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < H; x++) {
      const v = out[y * H + x];
      total += v;
      cy += y * v;
      cx += x * v;
    }
  }
  if (total > 1e-6) {
    const ideal = (H - 1) / 2;
    const dy = Math.max(-2, Math.min(2, pythonRound(ideal - cy / total)));
    const dx = Math.max(-2, Math.min(2, pythonRound(ideal - cx / total)));
    if (dy !== 0 || dx !== 0) return shiftZeroPad(out, H, H, dy, dx);
  }
  return out;
}

function connectedComponents(mask: Uint8Array, w: number, h: number) {
  const visited = new Uint8Array(w * h);
  const comps: { y1: number; y2: number; x1: number; x2: number; size: number }[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const start = y * w + x;
      if (!mask[start] || visited[start]) continue;
      visited[start] = 1;
      const stack = [start];
      let size = 0, y1 = y, y2 = y, x1 = x, x2 = x;
      while (stack.length) {
        const i = stack.pop()!;
        const iy = Math.floor(i / w);
        const ix = i % w;
        size++;
        if (iy < y1) y1 = iy;
        if (iy > y2) y2 = iy;
        if (ix < x1) x1 = ix;
        if (ix > x2) x2 = ix;
        const near = [i - w, i + w, i - 1, i + 1];
        if (iy === 0) near[0] = -1;
        if (iy === h - 1) near[1] = -1;
        if (ix === 0) near[2] = -1;
        if (ix === w - 1) near[3] = -1;
        for (const n of near) {
          if (n >= 0 && mask[n] && !visited[n]) {
            visited[n] = 1;
            stack.push(n);
          }
        }
      }
      comps.push({ y1, y2: y2 + 1, x1, x2: x2 + 1, size });
    }
  }
  return comps;
}

// gray: inverted grayscale (stroke = 255), row-major canvasW×canvasH.
// Returns the composed 28×56 input in [0,1], or null if the canvas is blank.
export function segmentCompose(gray: Float32Array, canvasW: number, canvasH: number): Float32Array | null {
  const gb = bbox((i) => gray[i] > 10, canvasW, canvasH);
  if (!gb) return null;
  const pad = 4;
  const y1 = Math.max(0, gb.yMin - pad);
  const x1 = Math.max(0, gb.xMin - pad);
  const y2 = Math.min(canvasH, gb.yMax + 1 + pad);
  const x2 = Math.min(canvasW, gb.xMax + 1 + pad);
  const g = crop(gray, canvasW, y1, y2, x1, x2);
  const mask = new Uint8Array(g.w * g.h);
  for (let i = 0; i < mask.length; i++) mask[i] = g.data[i] > 10 ? 1 : 0;

  // Valley split: the emptiest column in the middle half, if both sides have mass
  let split: number | null = null;
  if (g.w >= 8) {
    const colSums = new Array<number>(g.w).fill(0);
    for (let i = 0; i < mask.length; i++) if (mask[i]) colSums[i % g.w]++;
    let start = Math.max(1, Math.floor(g.w * 0.25));
    let end = Math.min(g.w - 1, Math.floor(g.w * 0.75));
    if (end <= start) {
      start = 1;
      end = g.w - 1;
    }
    let idx = start;
    for (let x = start; x < end; x++) if (colSums[x] < colSums[idx]) idx = x;
    let leftMass = 0;
    for (let x = 0; x < idx; x++) leftMass += colSums[x];
    let rightMass = 0;
    for (let x = idx; x < g.w; x++) rightMass += colSums[x];
    if (leftMass > 50 && rightMass > 50) split = idx;
  }

  let left: { data: Float32Array; w: number; h: number } | null = null;
  let right: { data: Float32Array; w: number; h: number } | null = null;
  if (split !== null) {
    const halves: [number, number][] = [
      [0, split],
      [split, g.w],
    ];
    for (let s = 0; s < 2; s++) {
      const [hx1, hx2] = halves[s];
      const area = crop(g.data, g.w, 0, g.h, hx1, hx2);
      const ab = bbox((i) => area.data[i] > 10, area.w, area.h);
      if (ab) {
        const tight = crop(area.data, area.w, ab.yMin, ab.yMax + 1, ab.xMin, ab.xMax + 1);
        if (s === 0) left = tight;
        else right = tight;
      }
    }
  } else {
    const comps = connectedComponents(mask, g.w, g.h);
    if (comps.length >= 2) {
      comps.sort((a, b) => b.size - a.size);
      const [a, b] = comps[0].x1 <= comps[1].x1 ? [comps[0], comps[1]] : [comps[1], comps[0]];
      left = crop(g.data, g.w, a.y1, a.y2, a.x1, a.x2);
      right = crop(g.data, g.w, b.y1, b.y2, b.x1, b.x2);
    } else {
      const mid = Math.floor(g.w / 2);
      left = crop(g.data, g.w, 0, g.h, 0, mid);
      right = crop(g.data, g.w, 0, g.h, mid, g.w);
    }
  }

  const norm = (t: { data: Float32Array; w: number; h: number } | null) => {
    if (!t) return null;
    const d = new Float32Array(t.data.length);
    for (let i = 0; i < d.length; i++) d[i] = t.data[i] / 255;
    return { data: d, w: t.w, h: t.h };
  };
  const leftTile = canonicalize(norm(left));
  const rightTile = canonicalize(norm(right));

  const composed = new Float32Array(H * W);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < H; x++) {
      composed[y * W + x] = leftTile[y * H + x];
      composed[y * W + x + H] = rightTile[y * H + x];
    }
  }
  return composed;
}

function dilate(arr: Float32Array): Float32Array {
  const out = new Float32Array(H * W);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const s = shiftZeroPad(arr, W, H, dy, dx);
      for (let i = 0; i < out.length; i++) if (s[i] > out[i]) out[i] = s[i];
    }
  }
  return out;
}

function erode(arr: Float32Array): Float32Array {
  const out = new Float32Array(H * W).fill(Infinity);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const s = shiftZeroPad(arr, W, H, dy, dx);
      for (let i = 0; i < out.length; i++) if (s[i] < out[i]) out[i] = s[i];
    }
  }
  return out;
}

// Auto-balance stroke mass toward the training set's mean intensity, then the
// space's fast TTA set: identity, 4 cardinal shifts, dilate, erode
export function buildVariants(composed: Float32Array, w: CnnWeights): Float32Array[] {
  let mass = 0;
  for (let i = 0; i < composed.length; i++) mass += composed[i];
  const massFraction = mass / (H * W);
  let balanced = composed;
  if (massFraction > 1e-6) {
    let targetMass = 0;
    for (let i = 0; i < w.mean.length; i++) targetMass += w.mean[i];
    targetMass /= w.mean.length;
    const scale = Math.max(0.6, Math.min(1.6, Math.sqrt(targetMass / massFraction)));
    balanced = new Float32Array(composed.length);
    for (let i = 0; i < composed.length; i++) {
      balanced[i] = Math.min(1, Math.max(0, composed[i] * scale));
    }
  }
  const shifts: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  return [
    balanced,
    ...shifts.map(([dy, dx]) => shiftZeroPad(balanced, W, H, dy, dx)),
    dilate(balanced),
    erode(balanced),
  ];
}

function standardize(arr: Float32Array, w: CnnWeights): Float32Array {
  const out = new Float32Array(H * W);
  for (let i = 0; i < out.length; i++) {
    const z = (arr[i] - w.mean[i]) / Math.max(w.std[i], 1e-8);
    out[i] = Math.max(-8, Math.min(8, z));
  }
  return out;
}

function conv3x3(
  input: Float32Array,
  inC: number,
  h: number,
  w: number,
  kernels: Float32Array,
  biases: Float32Array,
  outC: number,
): Float32Array {
  const out = new Float32Array(outC * h * w);
  for (let o = 0; o < outC; o++) {
    const kBase = o * inC * 9;
    const oBase = o * h * w;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = biases[o];
        for (let c = 0; c < inC; c++) {
          const cBase = c * h * w;
          const kcBase = kBase + c * 9;
          for (let ky = 0; ky < 3; ky++) {
            const sy = y + ky - 1;
            if (sy < 0 || sy >= h) continue;
            for (let kx = 0; kx < 3; kx++) {
              const sx = x + kx - 1;
              if (sx < 0 || sx >= w) continue;
              sum += kernels[kcBase + ky * 3 + kx] * input[cBase + sy * w + sx];
            }
          }
        }
        out[oBase + y * w + x] = sum > 0 ? sum : 0; // conv + ReLU fused
      }
    }
  }
  return out;
}

function maxpool2(input: Float32Array, c: number, h: number, w: number): Float32Array {
  const oh = h / 2;
  const ow = w / 2;
  const out = new Float32Array(c * oh * ow);
  for (let ch = 0; ch < c; ch++) {
    for (let y = 0; y < oh; y++) {
      for (let x = 0; x < ow; x++) {
        const base = ch * h * w + y * 2 * w + x * 2;
        out[ch * oh * ow + y * ow + x] = Math.max(
          input[base],
          input[base + 1],
          input[base + w],
          input[base + w + 1],
        );
      }
    }
  }
  return out;
}

function forwardOne(w: CnnWeights, z: Float32Array): Float32Array {
  const c1 = conv3x3(z, 1, H, W, w.conv1_W, w.conv1_b, 16);
  const p1 = maxpool2(c1, 16, H, W); // (16, 14, 28)
  const c2 = conv3x3(p1, 16, 14, 28, w.conv2_W, w.conv2_b, 32);
  const p2 = maxpool2(c2, 32, 14, 28); // (32, 7, 14) → 3136 channel-major

  const a1 = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    let s = w.fc1_b[i];
    const row = i * 3136;
    for (let j = 0; j < 3136; j++) s += w.fc1_W[row + j] * p2[j];
    a1[i] = s > 0 ? s : 0;
  }

  const logits = new Float32Array(100);
  let zMax = -Infinity;
  for (let i = 0; i < 100; i++) {
    let s = w.fc2_b[i];
    const row = i * 256;
    for (let j = 0; j < 256; j++) s += w.fc2_W[row + j] * a1[j];
    logits[i] = s;
    if (s > zMax) zMax = s;
  }
  const probs = new Float32Array(100);
  let sum = 0;
  for (let i = 0; i < 100; i++) {
    probs[i] = Math.exp(logits[i] - zMax);
    sum += probs[i];
  }
  for (let i = 0; i < 100; i++) probs[i] /= sum;
  return probs;
}

export function classify(
  w: CnnWeights,
  composed: Float32Array,
): { probs: number[]; pred: number } {
  const variants = buildVariants(composed, w);
  const avg = new Array<number>(100).fill(0);
  for (const v of variants) {
    const probs = forwardOne(w, standardize(v, w));
    for (let i = 0; i < 100; i++) avg[i] += probs[i] / variants.length;
  }
  let pred = 0;
  for (let i = 1; i < 100; i++) if (avg[i] > avg[pred]) pred = i;
  return { probs: avg, pred };
}
