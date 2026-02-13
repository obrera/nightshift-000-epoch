import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use("*", cors());

interface EpochResult {
  unix: number;
  unixMs: number;
  iso: string;
  utc: string;
  relative: string;
  date: { year: number; month: number; day: number; hour: number; minute: number; second: number };
}

function relative(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const abs = Math.abs(diff);
  const future = diff < 0;
  const s = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"} ${future ? "from now" : "ago"}`;

  if (abs < 60_000) return s(Math.floor(abs / 1000), "second");
  if (abs < 3_600_000) return s(Math.floor(abs / 60_000), "minute");
  if (abs < 86_400_000) return s(Math.floor(abs / 3_600_000), "hour");
  if (abs < 2_592_000_000) return s(Math.floor(abs / 86_400_000), "day");
  if (abs < 31_536_000_000) return s(Math.floor(abs / 2_592_000_000), "month");
  return s(Math.floor(abs / 31_536_000_000), "year");
}

function toResult(date: Date): EpochResult {
  return {
    unix: Math.floor(date.getTime() / 1000),
    unixMs: date.getTime(),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    relative: relative(date),
    date: {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
    },
  };
}

function parse(input: string): Date | null {
  // Try unix timestamp (seconds or ms)
  const num = Number(input);
  if (!isNaN(num)) {
    // If it looks like seconds (before year 2100 in seconds)
    if (num < 4_102_444_800) return new Date(num * 1000);
    return new Date(num);
  }
  // Try ISO / date string
  const d = new Date(input);
  if (!isNaN(d.getTime())) return d;
  return null;
}

// GET /api/now — current time
app.get("/api/now", (c) => c.json(toResult(new Date())));

// GET /api/parse?q=<input> — parse any timestamp
app.get("/api/parse", (c) => {
  const q = c.req.query("q");
  if (!q) return c.json({ error: "Missing ?q= parameter" }, 400);
  const date = parse(q);
  if (!date) return c.json({ error: `Could not parse: ${q}` }, 400);
  return c.json(toResult(date));
});

// GET /api/:input — shorthand
app.get("/api/:input", (c) => {
  const date = parse(c.req.param("input"));
  if (!date) return c.json({ error: "Could not parse input" }, 400);
  return c.json(toResult(date));
});

const port = Number(process.env.PORT) || 3001;
console.log(`🕐 Epoch API on http://localhost:${port}`);

export default { port, fetch: app.fetch };
