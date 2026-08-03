export function SectionHeader({ marker, title }: { marker?: string; title: string }) {
  return (
    <div className="site-h">
      {marker && <b>{marker}</b>}
      {title}
    </div>
  );
}
