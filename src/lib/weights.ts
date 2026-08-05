// Shared loader for the from-scratch model weight bundles in
// public/ml-from-scratch/*.bin: a 4-byte little-endian manifest length,
// a JSON manifest of [{name, shape}], then the tensors as row-major float32.

interface ManifestEntry {
  name: string;
  shape: number[];
}

export function parseTensors(buf: ArrayBuffer): Record<string, Float32Array> {
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
  return tensors;
}
