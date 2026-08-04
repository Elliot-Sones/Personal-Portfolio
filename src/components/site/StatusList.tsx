import Link from "next/link";
import type { StatusItem } from "@/lib/site-data";

const toneClass: Record<StatusItem["tone"], string> = {
  live: "badge badge-live",
  ship: "badge badge-ship",
  plain: "badge badge-plain",
};

function Row({ item }: { item: StatusItem }) {
  return (
    <>
      <div className="flex items-baseline gap-2.5">
        <span className="font-[family-name:var(--font-fraunces)] text-[17px] font-medium text-ink">
          {item.href ? <span className="u-draw">{item.title}</span> : item.title}
        </span>
        {item.href && (
          <span className="arrow-nudge text-ember opacity-0 group-hover:opacity-100">→</span>
        )}
        <span className={`ml-auto ${toneClass[item.tone]}`}>{item.badge}</span>
      </div>
      <p className="mt-1 font-[family-name:var(--font-jbmono)] text-[11.5px] leading-[1.65] text-inksoft">
        {item.detail}
      </p>
    </>
  );
}

export function StatusList({ items }: { items: StatusItem[] }) {
  return (
    <div className="mt-1.5">
      {items.map((item) =>
        item.href ? (
          <Link
            key={item.title}
            href={item.href}
            className="group block border-t border-line py-3.5"
          >
            <Row item={item} />
          </Link>
        ) : (
          <div key={item.title} className="border-t border-line py-3.5">
            <Row item={item} />
          </div>
        ),
      )}
    </div>
  );
}
