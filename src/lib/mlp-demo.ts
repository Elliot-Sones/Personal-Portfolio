// Runs the from-scratch MLP (784 → 256 → 128 → 10) directly in the browser.
// Weights come from public/ml-from-scratch/mlp-weights.bin, exported from the
// exact archive/trained_model.npz the Hugging Face space uses. Preprocessing
// mirrors the space's app.py: invert, crop to the stroke bounding box with a
// small margin, pad to square, resize to 20×20, pad to 28×28, scale to [0,1],
// then standardize with the training mean/std stored alongside the weights.

export interface MlpWeights {
  W1: Float32Array; // (256, 784)
  b1: Float32Array; // (256)
  W2: Float32Array; // (128, 256)
  b2: Float32Array; // (128)
  W3: Float32Array; // (10, 128)
  b3: Float32Array; // (10)
  mean: Float32Array; // (784)
  std: Float32Array; // (784)
}

interface ManifestEntry {
  name: string;
  shape: number[];
}

export function parseWeights(buf: ArrayBuffer): MlpWeights {
  const view = new DataView(buf);
  const manifestLen = view.getUint32(0, true);
  const manifest: ManifestEntry[] = JSON.parse(
    new TextDecoder().decode(new Uint8Array(buf, 4, manifestLen)),
  );
  let offset = 4 + manifestLen;
  const tensors: Record<string, Float32Array> = {};
  for (const entry of manifest) {
    const count = entry.shape.reduce((a, b) => a * b, 1);
    tensors[entry.name] = new Float32Array(buf.slice(offset, offset + count * 4));
    offset += count * 4;
  }
  return tensors as unknown as MlpWeights;
}

// gray: inverted grayscale (stroke = 255, background = 0), row-major size×size.
// Returns the 28×28 model input in [0,1], or null if the canvas is blank.
export function preprocess(gray: Float32Array, size: number): Float32Array | null {
  let yMin = size, yMax = -1, xMin = size, xMax = -1;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (gray[y * size + x] > 10) {
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
        if (x < xMin) xMin = x;
        if (x > xMax) xMax = x;
      }
    }
  }
  if (yMax < 0) return null;

  const pad = Math.round(size / 70); // ≈ the 4px margin app.py adds at canvas scale
  yMin = Math.max(0, yMin - pad);
  xMin = Math.max(0, xMin - pad);
  yMax = Math.min(size - 1, yMax + pad);
  xMax = Math.min(size - 1, xMax + pad);

  const h = yMax - yMin + 1;
  const w = xMax - xMin + 1;
  const side = Math.max(h, w);
  const padTop = Math.floor((side - h) / 2);
  const padLeft = Math.floor((side - w) / 2);

  const square = new Float32Array(side * side);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      square[(y + padTop) * side + (x + padLeft)] = gray[(y + yMin) * size + (x + xMin)];
    }
  }

  // Area-average resize side×side → 20×20 (box filter)
  const resized = new Float32Array(20 * 20);
  const scale = side / 20;
  for (let dy = 0; dy < 20; dy++) {
    const y0 = dy * scale;
    const y1 = (dy + 1) * scale;
    for (let dx = 0; dx < 20; dx++) {
      const x0 = dx * scale;
      const x1 = (dx + 1) * scale;
      let sum = 0;
      let weight = 0;
      for (let sy = Math.floor(y0); sy < Math.ceil(y1); sy++) {
        const wy = Math.min(sy + 1, y1) - Math.max(sy, y0);
        for (let sx = Math.floor(x0); sx < Math.ceil(x1); sx++) {
          const wx = Math.min(sx + 1, x1) - Math.max(sx, x0);
          sum += square[sy * side + sx] * wy * wx;
          weight += wy * wx;
        }
      }
      resized[dy * 20 + dx] = weight > 0 ? sum / weight : 0;
    }
  }

  // Center into 28×28 with a 4px border, scale to [0,1]
  const arr28 = new Float32Array(28 * 28);
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      arr28[(y + 4) * 28 + (x + 4)] = resized[y * 20 + x] / 255;
    }
  }
  return arr28;
}

export function forward(
  w: MlpWeights,
  arr28: Float32Array,
): { probs: number[]; pred: number } {
  const x = new Float32Array(784);
  for (let i = 0; i < 784; i++) {
    x[i] = (arr28[i] - w.mean[i]) / (w.std[i] || 1);
  }

  const a1 = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    let z = w.b1[i];
    const row = i * 784;
    for (let j = 0; j < 784; j++) z += w.W1[row + j] * x[j];
    a1[i] = z > 0 ? z : 0;
  }

  const a2 = new Float32Array(128);
  for (let i = 0; i < 128; i++) {
    let z = w.b2[i];
    const row = i * 256;
    for (let j = 0; j < 256; j++) z += w.W2[row + j] * a1[j];
    a2[i] = z > 0 ? z : 0;
  }

  const z3 = new Float32Array(10);
  let zMax = -Infinity;
  for (let i = 0; i < 10; i++) {
    let z = w.b3[i];
    const row = i * 128;
    for (let j = 0; j < 128; j++) z += w.W3[row + j] * a2[j];
    z3[i] = z;
    if (z > zMax) zMax = z;
  }

  let sum = 0;
  const probs = new Array<number>(10);
  for (let i = 0; i < 10; i++) {
    probs[i] = Math.exp(z3[i] - zMax);
    sum += probs[i];
  }
  let pred = 0;
  for (let i = 0; i < 10; i++) {
    probs[i] /= sum;
    if (probs[i] > probs[pred]) pred = i;
  }
  return { probs, pred };
}
