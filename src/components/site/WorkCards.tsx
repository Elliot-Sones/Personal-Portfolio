import type { WorkCard } from "@/lib/site-data";

const toneClass: Record<WorkCard["tone"], string> = {
  live: "badge badge-live",
  ship: "badge badge-ship",
  plain: "badge badge-plain",
};

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
      <div className="flex items-center justify-between">
        <Tile w={w} />
        <span className={toneClass[w.tone]}>{w.badge}</span>
      </div>
      <div className="mt-3 font-[family-name:var(--font-fraunces)] text-[17.5px] font-medium leading-snug text-ink">
        {w.title}
      </div>
      <div className="mt-1 font-[family-name:var(--font-jbmono)] text-[9.5px] uppercase tracking-[0.14em] text-mute">
        {w.org}
      </div>
      <p className="mt-2 font-[family-name:var(--font-jbmono)] text-[11.5px] leading-[1.65] text-inksoft">
        {w.detail}
      </p>
      {w.since && (
        <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[9.5px] text-faint">
          since {w.since}
        </div>
      )}
    </>
  );
}

export function WorkCards({ items }: { items: WorkCard[] }) {
  return (
    <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((w) =>
        w.link ? (
          <a
            key={w.title}
            href={w.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[6px] border border-line bg-card p-4 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-[2px] hover:border-ember hover:shadow-[0_3px_0_0_var(--color-line)]"
          >
            <CardBody w={w} />
          </a>
        ) : (
          <div key={w.title} className="rounded-[6px] border border-line bg-card p-4">
            <CardBody w={w} />
          </div>
        ),
      )}
    </div>
  );
}
