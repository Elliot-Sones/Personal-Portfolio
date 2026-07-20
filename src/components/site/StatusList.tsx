import type { StatusItem } from "@/lib/site-data";

const toneClass: Record<StatusItem["tone"], string> = {
  live: "badge badge-live",
  ship: "badge badge-ship",
  plain: "badge badge-plain",
};

export function StatusList({ items }: { items: StatusItem[] }) {
  return (
    <div className="mt-1.5">
      {items.map((item) => (
        <div key={item.title} className="border-t border-line py-3">
          <div className="flex items-baseline gap-2.5">
            <span className="font-[family-name:var(--font-fraunces)] text-[15.5px] text-ink">
              {item.title}
            </span>
            <span className={`ml-auto ${toneClass[item.tone]}`}>{item.badge}</span>
          </div>
          <p className="mt-1 font-[family-name:var(--font-jbmono)] text-[11px] leading-relaxed text-inksoft">
            {item.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
