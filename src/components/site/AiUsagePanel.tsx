import { getAiUsage, formatTokens, formatCost, type AiUsageTool } from "@/lib/ai-usage";

const TOOLS: { key: "claude" | "codex" | "kimi"; label: string; color: string }[] = [
  { key: "claude", label: "Claude Code", color: "bg-claude" },
  { key: "codex", label: "Codex", color: "bg-codex" },
  { key: "kimi", label: "Kimi", color: "bg-kimi" },
];

function DayBars({ days }: { days: { date: string; claude: number; codex: number; kimi: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.claude + d.codex + d.kimi));
  return (
    <div className="flex h-full min-h-[90px] items-end gap-1.5">
      {days.map((d) => (
        <div
          key={d.date}
          className="group relative flex-1 flex flex-col-reverse gap-px h-full"
        >
          {TOOLS.map(({ key, color }) =>
            d[key] > 0 ? (
              <div
                key={key}
                className={`rounded-[1.5px] ${color} transition-opacity group-hover:opacity-80`}
                style={{ height: `${Math.max(2, (d[key] / max) * 100)}%` }}
              />
            ) : null,
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

function ToolRow({ label, color, tool }: { label: string; color: string; tool: AiUsageTool }) {
  return (
    <span>
      <i className={`inline-block w-2 h-2 rounded-[2px] ${color} mr-1.5 align-[-1px]`} />
      {label} · {formatTokens(tool.tokens)} · {tool.sessions} sessions ·{" "}
      <b className="font-medium text-ink">~{formatCost(tool.estCost)}</b>
    </span>
  );
}

export function AiUsagePanel() {
  const usage = getAiUsage();

  if (!usage) {
    return (
      <div className="site-card p-5">
        <div className="flex items-center justify-between font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-mute mb-2">
          <span>AI pair-programming</span>
        </div>
        <p className="font-[family-name:var(--font-jbmono)] text-[11px] text-faint">
          No usage data — run <code className="text-ember">npm run stats</code> locally.
        </p>
      </div>
    );
  }

  const tools = TOOLS.map((t) => ({ ...t, tool: usage[t.key] }));
  const total = tools.reduce((s, t) => s + t.tool.tokens, 0);
  const totalCost = tools.reduce((s, t) => s + t.tool.estCost, 0);
  const updated = new Date(usage.generatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const peak = usage.days.reduce(
    (best, d) => (d.claude + d.codex + d.kimi > best.claude + best.codex + best.kimi ? d : best),
    usage.days[0] ?? { date: "", claude: 0, codex: 0, kimi: 0 },
  );
  const peakLabel = peak.date
    ? `${formatTokens(peak.claude + peak.codex + peak.kimi)} on ${new Date(
        peak.date + "T00:00:00",
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : "—";

  return (
    <div className="site-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-mute mb-3">
        <span>AI pair-programming</span>
        <span className="live-dot" aria-label="live" />
      </div>
      <div className="stat-num text-[36px] leading-none">{formatTokens(total)}</div>
      <div className="mt-1.5 font-[family-name:var(--font-jbmono)] text-[10px] tracking-[0.04em] text-mute">
        tokens in the last 14 days (incl. cached context) · ~{formatCost(totalCost)} at API rates
      </div>
      <div className="mt-3 mb-2 flex h-3.5 overflow-hidden rounded-[3px]">
        {tools.map(({ key, color, tool }) =>
          tool.tokens > 0 ? (
            <div key={key} className={color} style={{ width: `${(tool.tokens / total) * 100}%` }} />
          ) : null,
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 font-[family-name:var(--font-jbmono)] text-[10.5px] text-inksoft">
        {tools.map(({ key, label, color, tool }) => (
          <ToolRow key={key} label={label} color={color} tool={tool} />
        ))}
      </div>
      <div className="mt-4 flex-1">
        <DayBars days={usage.days} />
      </div>
      <div className="mt-2 flex justify-between font-[family-name:var(--font-jbmono)] text-[9.5px] text-faint">
        <span>14 days ago</span>
        <span>
          tokens / day, stacked · peak {peakLabel} · updated {updated}
        </span>
        <span>today</span>
      </div>
    </div>
  );
}
