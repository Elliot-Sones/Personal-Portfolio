import fs from "node:fs";
import path from "node:path";

export interface AiUsageTool {
  tokens: number;
  sessions: number;
  inputTokens: number;
  outputTokens: number;
  estCost: number;
}

export interface AiUsageDay {
  date: string;
  claude: number;
  codex: number;
  kimi: number;
}

export interface AiUsage {
  generatedAt: string;
  month: string;
  claude: AiUsageTool;
  codex: AiUsageTool;
  kimi: AiUsageTool;
  days: AiUsageDay[];
}

export function getAiUsage(): AiUsage | null {
  try {
    const p = path.join(process.cwd(), "data", "ai-usage.json");
    return JSON.parse(fs.readFileSync(p, "utf8")) as AiUsage;
  } catch {
    return null;
  }
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatCost(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
}
