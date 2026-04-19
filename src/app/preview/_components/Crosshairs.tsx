export function Crosshairs({
  size = 10,
  color = "rgba(244, 234, 213, 0.35)",
  thickness = 1,
}: {
  size?: number;
  color?: string;
  thickness?: number;
}) {
  const style = { width: size, height: size };
  const s = `${thickness}px solid ${color}`;
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0"
        style={{ ...style, borderLeft: s, borderTop: s }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0"
        style={{ ...style, borderRight: s, borderTop: s }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0"
        style={{ ...style, borderLeft: s, borderBottom: s }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0"
        style={{ ...style, borderRight: s, borderBottom: s }}
      />
    </>
  );
}
