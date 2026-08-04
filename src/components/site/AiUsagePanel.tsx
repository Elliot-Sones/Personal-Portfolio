import { getAiUsage, formatTokens, formatCost, type AiUsageTool } from "@/lib/ai-usage";

const TOOLS: { key: "claude" | "codex" | "kimi"; label: string; color: string }[] = [
  { key: "claude", label: "Claude Code", color: "bg-claude" },
  { key: "codex", label: "Codex", color: "bg-codex" },
  { key: "kimi", label: "Kimi", color: "bg-kimi" },
];

function DayBars({ days }: { days: { date: string; claude: number; codex: number; kimi: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.claude + d.codex + d.kimi));
  return (
    <div className="flex h-full min-h-[120px] items-end gap-2">
      {days.map((d) => (
        <div
          key={d.date}
          className="group relative flex-1 flex flex-col-reverse gap-px h-full"
        >
          {TOOLS.map(({ key, color }) =>
            d[key] > 0 ? (
              <div
                key={key}
                className={`rounded-[2px] ${color} transition-opacity group-hover:opacity-80`}
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
    <div className="flex items-baseline gap-2">
      <i className={`inline-block h-2 w-2 shrink-0 rounded-[2px] ${color} self-center`} />
      <span className="w-[88px] shrink-0">{label}</span>
      <span>
        {formatTokens(tool.tokens)} · {tool.sessions} sessions
      </span>
      <b className="ml-auto font-medium text-ink">~{formatCost(tool.estCost)}</b>
    </div>
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
    <div className="site-card p-5">
      <div className="mb-4 flex items-center justify-between font-[family-name:var(--font-jbmono)] text-[10px] uppercase tracking-[0.16em] text-mute">
        <span>AI pair-programming</span>
        <span className="live-dot" aria-label="live" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
        {/* left: the number and the breakdown */}
        <div>
          <div className="stat-num text-[42px] leading-none">{formatTokens(total)}</div>
          <div className="mt-2 font-[family-name:var(--font-jbmono)] text-[10px] leading-[1.7] tracking-[0.04em] text-mute">
            tokens in the last 14 days (incl. cached context)
            <br />~{formatCost(totalCost)} at API rates
          </div>
          <div className="mb-3 mt-4 flex h-2.5 overflow-hidden rounded-[3px]">
            {tools.map(({ key, color, tool }) =>
              tool.tokens > 0 ? (
                <div key={key} className={color} style={{ width: `${(tool.tokens / total) * 100}%` }} />
              ) : null,
            )}
          </div>
          <div className="flex flex-col gap-1.5 font-[family-name:var(--font-jbmono)] text-[10.5px] text-inksoft">
            {tools.map(({ key, label, color, tool }) => (
              <ToolRow key={key} label={label} color={color} tool={tool} />
            ))}
          </div>
        </div>
        {/* right: the day chart */}
        <div className="flex flex-col">
          <div className="flex-1">
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
      </div>
    </div>
  );
}
