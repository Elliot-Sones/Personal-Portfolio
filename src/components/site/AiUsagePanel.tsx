import { getAiUsage, formatTokens, formatCost } from "@/lib/ai-usage";

const TOOLS: { key: "claude" | "codex" | "kimi"; label: string; color: string }[] = [
  { key: "claude", label: "Claude Code", color: "bg-claude" },
  { key: "codex", label: "Codex", color: "bg-codex" },
  { key: "kimi", label: "Kimi", color: "bg-kimi" },
];

function DayBars({ days }: { days: { date: string; claude: number; codex: number; kimi: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.claude + d.codex + d.kimi));
  return (
    <div className="flex h-16 items-end gap-1.5">
      {days.map((d) => (
        <div key={d.date} className="group relative flex h-full flex-1 flex-col-reverse gap-px">
          {TOOLS.map(({ key, color }) =>
            d[key] > 0 ? (
              <div
                key={key}
                className={`rounded-[1.5px] ${color} transition-opacity group-hover:opacity-80`}
                style={{ height: `${Math.max(2, (d[key] / max) * 100)}%` }}
              />
            ) : null,
          )}
          {d.claude + d.codex + d.kimi === 0 && (
            <div className="h-[2px] rounded-[1.5px] bg-line" />
          )}
          <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-ink px-2 py-1 font-[family-name:var(--font-jbmono)] text-[9px] text-paper shadow-md group-hover:block">
            {formatTokens(d.claude + d.codex + d.kimi)} ·{" "}
            {new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AiUsagePanel() {
  const usage = getAiUsage();

  if (!usage) {
    return (
      <p className="mt-4 font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
        No usage data — run <code className="text-ember">npm run stats</code> locally.
      </p>
    );
  }

  const tools = TOOLS.map((t) => ({ ...t, tool: usage[t.key] }));
  const total = tools.reduce((s, t) => s + t.tool.tokens, 0);
  const totalCost = tools.reduce((s, t) => s + t.tool.estCost, 0);
  const updated = new Date(usage.generatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="stat-num text-[40px] leading-none">{formatTokens(total)}</span>
        <span className="font-[family-name:var(--font-jbmono)] text-[10.5px] text-mute">
          tokens in the last 14 days · ~{formatCost(totalCost)} at API rates
        </span>
        <span className="ml-auto hidden gap-4 font-[family-name:var(--font-jbmono)] text-[10px] text-inksoft sm:flex">
          {tools
            .filter(({ tool }) => tool.tokens > 0)
            .map(({ key, label, color, tool }) => (
              <span key={key}>
                <i className={`mr-1.5 inline-block h-2 w-2 rounded-[2px] align-[-1px] ${color}`} />
                {label} · {formatTokens(tool.tokens)}
              </span>
            ))}
        </span>
      </div>
      <div className="mt-5">
        <DayBars days={usage.days} />
      </div>
      <div className="mt-2 flex justify-between font-[family-name:var(--font-jbmono)] text-[9px] text-faint">
        <span>14 days ago</span>
        <span>updated {updated}</span>
        <span>today</span>
      </div>
    </div>
  );
}
