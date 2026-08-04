import type { WorkCard } from "@/lib/site-data";

function Tile({ w }: { w: WorkCard }) {
  if (w.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={w.logo}
        alt=""
        className={`h-9 w-9 shrink-0 rounded-[6px] border border-line object-contain p-1 ${
          w.logoDark ? "bg-[#151515]" : "bg-raised"
        }`}
      />
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-line bg-raised font-[family-name:var(--font-fraunces)] text-[16px] font-medium text-mute">
      {w.title.charAt(0).toUpperCase()}
    </span>
  );
}

function CardBody({ w }: { w: WorkCard }) {
  return (
    <>
      <Tile w={w} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-[family-name:var(--font-fraunces)] text-[16.5px] font-medium leading-snug text-ink">
          {w.title}
        </span>
        <span className="mt-0.5 block truncate font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.14em] text-mute">
          {w.org}
        </span>
      </span>
    </>
  );
}

export function WorkCards({ items }: { items: WorkCard[] }) {
  return (
    <div className="mt-3.5 flex flex-col gap-3">
      {items.map((w) =>
        w.link ? (
          <a
            key={w.title}
            href={w.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-[6px] border border-line bg-card px-4 py-3.5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-[2px] hover:border-ember hover:shadow-[0_3px_0_0_var(--color-line)]"
          >
            <CardBody w={w} />
            <span className="arrow-nudge text-ember opacity-0 group-hover:opacity-100">
              ↗
            </span>
          </a>
        ) : (
          <div
            key={w.title}
            className="flex items-center gap-3.5 rounded-[6px] border border-line bg-card px-4 py-3.5"
          >
            <CardBody w={w} />
          </div>
        ),
      )}
    </div>
  );
}
