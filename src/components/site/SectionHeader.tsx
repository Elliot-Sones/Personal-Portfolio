import type { ReactNode } from "react";

export function SectionHeader({
  marker,
  title,
  right,
}: {
  marker?: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="site-h">
      {marker && <b>{marker}</b>}
      {title}
      {right && <span className="shrink-0">{right}</span>}
    </div>
  );
}
