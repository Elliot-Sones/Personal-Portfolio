#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const HOME = os.homedir();
const CLAUDE_DIR = path.join(HOME, ".claude", "projects");
const CODEX_DIR = path.join(HOME, ".codex", "sessions");
const KIMI_DIR = path.join(HOME, ".kimi-code", "sessions");
const OUT = path.join(process.cwd(), "data", "ai-usage.json");

// USD per 1M tokens { input, output } — ESTIMATES for API-equivalent cost.
// Elliot has subscriptions (flat), so these show what the usage would cost at
// metered API rates, not what he actually pays. Verify current pricing and edit.
// Cache tokens are priced at the standard multipliers: reads 0.1x, writes 1.25x.
const RATES = {
  claudeOpus: { input: 15, output: 75 },
  claudeSonnet: { input: 3, output: 15 },
  codex: { input: 1.25, output: 10 }, // gpt-5-codex-class
  kimi: { input: 0.6, output: 2.5 }, // moonshot k2/k3-class
};
const CACHE_READ_MULT = 0.1;
const CACHE_WRITE_MULT = 1.25;

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".jsonl")) yield p;
  }
}

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function dayKey(d) {
  return d.toISOString().slice(0, 10);
}

function blankStats() {
  return { tokens: 0, input: 0, output: 0, sessions: new Set(), byDay: new Map(), cost: 0 };
}

function currentMonth(d) {
  const now = new Date();
  return monthKey(d) === monthKey(now);
}

// Headline "tokens" matches the providers' own dashboards: fresh input + output
// + cache READS (metered, billed at 0.1x). Cache writes are excluded from the
// token count but included in the cost estimate at 1.25x.
function addTokens(stats, { input, output, cacheRead = 0, cacheWrite = 0, sessionId, timestamp, rate }) {
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime()) || !currentMonth(d)) return;
  const tokens = input + output + cacheRead;
  if (!tokens && !cacheWrite) return;
  stats.tokens += tokens;
  stats.input += input;
  stats.output += output;
  if (rate) {
    stats.cost +=
      (input / 1e6) * rate.input +
      (output / 1e6) * rate.output +
      (cacheRead / 1e6) * rate.input * CACHE_READ_MULT +
      (cacheWrite / 1e6) * rate.input * CACHE_WRITE_MULT;
  }
  if (sessionId) stats.sessions.add(sessionId);
  const k = dayKey(d);
  stats.byDay.set(k, (stats.byDay.get(k) ?? 0) + tokens);
}

function parseClaude() {
  const stats = blankStats();
  for (const file of walk(CLAUDE_DIR)) {
    let lines;
    try {
      lines = fs.readFileSync(file, "utf8").split("\n");
    } catch {
      continue;
    }
    for (const line of lines) {
      if (!line.includes('"usage"')) continue;
      try {
        const entry = JSON.parse(line);
        const u = entry?.message?.usage;
        if (!u) continue;
        const model = String(entry?.message?.model ?? "");
        addTokens(stats, {
          input: u.input_tokens ?? 0,
          output: u.output_tokens ?? 0,
          cacheRead: u.cache_read_input_tokens ?? 0,
          cacheWrite: u.cache_creation_input_tokens ?? 0,
          sessionId: entry.sessionId,
          timestamp: entry.timestamp,
          rate: model.includes("opus") ? RATES.claudeOpus : RATES.claudeSonnet,
        });
      } catch {
        /* skip malformed line */
      }
    }
  }
  return stats;
}

function parseCodex() {
  const stats = blankStats();
  // Files are rollout logs; agent swarms fork heavily (session_meta carries a
  // shared session_id + forked_from_id), and a forked file's cumulative totals
  // replay its parent's. So: per file take the max cumulative non-cache total,
  // then group by session_id and count each thread tree ONCE (its max),
  // attributed to the tree's latest day.
  const threads = new Map(); // session_id -> { input, output, tokens, lastDate }
  for (const file of walk(CODEX_DIR)) {
    let lines;
    try {
      lines = fs.readFileSync(file, "utf8").split("\n");
    } catch {
      continue;
    }
    let best = null; // snapshot with max non-cache total
    let lastDate = null;
    let sessionId = null;
    for (const line of lines) {
      if (!sessionId && line.includes('"session_meta"')) {
        try {
          sessionId = JSON.parse(line)?.payload?.session_id ?? null;
        } catch {
          /* keep looking */
        }
      }
      if (!line.includes('"token_count"')) continue;
      try {
        const entry = JSON.parse(line);
        // token_count events fire per streamed chunk; total_token_usage is the
        // session-cumulative counter. Headline tokens include cached input
        // (matches how the providers report usage); cost prices the cached
        // portion at the 0.1x cache-read rate.
        const total = entry?.payload?.info?.total_token_usage;
        if (!total) continue;
        const cached = total.cached_input_tokens ?? 0;
        const input = Math.max(0, (total.input_tokens ?? 0) - cached);
        const output = total.output_tokens ?? 0;
        if (!best || input + cached + output > best.input + best.cached + best.output) {
          best = { input, cached, output };
        }
        const d = new Date(entry?.timestamp);
        if (!Number.isNaN(d.getTime())) lastDate = d;
      } catch {
        /* skip malformed line */
      }
    }
    if (!best || !lastDate) continue;
    const key = sessionId ?? path.basename(file, ".jsonl");
    const prev = threads.get(key);
    threads.set(key, {
      input: Math.max(prev?.input ?? 0, best.input),
      cached: Math.max(prev?.cached ?? 0, best.cached),
      output: Math.max(prev?.output ?? 0, best.output),
      lastDate: !prev || lastDate > prev.lastDate ? lastDate : prev.lastDate,
    });
  }
  for (const [id, t] of threads) {
    if (!currentMonth(t.lastDate)) continue;
    stats.tokens += t.input + t.cached + t.output;
    stats.input += t.input;
    stats.output += t.output;
    stats.cost +=
      (t.input / 1e6) * RATES.codex.input +
      (t.output / 1e6) * RATES.codex.output +
      (t.cached / 1e6) * RATES.codex.input * CACHE_READ_MULT;
    stats.sessions.add(id);
    const k = dayKey(t.lastDate);
    stats.byDay.set(k, (stats.byDay.get(k) ?? 0) + t.input + t.cached + t.output);
  }
  return stats;
}

function parseKimi() {
  const stats = blankStats();
  // Kimi Code sessions live in <KIMI_DIR>/<workspace>/<session>/agents/*/wire.jsonl.
  // usage.record events are per-turn (not cumulative). Headline tokens follow the
  // same dashboard definition as Claude: inputOther + output + cache reads;
  // cache creation is costed at the write multiplier, not counted as tokens.
  for (const file of walk(KIMI_DIR)) {
    if (!file.endsWith("wire.jsonl")) continue;
    const sessionId = file.split(`${path.sep}sessions${path.sep}`)[1]?.split(path.sep)[1];
    let lines;
    try {
      lines = fs.readFileSync(file, "utf8").split("\n");
    } catch {
      continue;
    }
    for (const line of lines) {
      if (!line.includes('"usage.record"')) continue;
      try {
        const entry = JSON.parse(line);
        if (entry?.type !== "usage.record") continue;
        const u = entry?.usage;
        if (!u) continue;
        addTokens(stats, {
          input: u.inputOther ?? 0,
          output: u.output ?? 0,
          cacheRead: u.inputCacheRead ?? 0,
          cacheWrite: u.inputCacheCreation ?? 0,
          sessionId,
          timestamp: entry.time,
          rate: RATES.kimi,
        });
      } catch {
        /* skip malformed line */
      }
    }
  }
  return stats;
}

function last14Days(tools) {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    const row = { date: k };
    for (const [name, stats] of Object.entries(tools)) {
      row[name] = stats.byDay.get(k) ?? 0;
    }
    days.push(row);
  }
  return days;
}

function toolOut(stats) {
  return {
    tokens: stats.tokens,
    sessions: stats.sessions.size,
    inputTokens: stats.input,
    outputTokens: stats.output,
    estCost: Math.round(stats.cost * 100) / 100,
  };
}

const claude = parseClaude();
const codex = parseCodex();
const kimi = parseKimi();

const out = {
  generatedAt: new Date().toISOString(),
  month: monthKey(new Date()),
  claude: toolOut(claude),
  codex: toolOut(codex),
  kimi: toolOut(kimi),
  days: last14Days({ claude, codex, kimi }),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${OUT}`);
for (const [name, s] of Object.entries({ claude, codex, kimi })) {
  console.log(
    `${name.padEnd(7)} ${s.tokens.toLocaleString().padStart(12)} tokens, ` +
      `${String(s.sessions.size).padStart(3)} sessions, ~$${s.cost.toFixed(2)}`,
  );
}
