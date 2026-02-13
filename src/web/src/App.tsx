import { useState, useEffect, useCallback } from "react";

interface EpochResult {
  unix: number;
  unixMs: number;
  iso: string;
  utc: string;
  relative: string;
  date: { year: number; month: number; day: number; hour: number; minute: number; second: number };
}

function Row({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div
      onClick={copy}
      className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 cursor-pointer transition group"
    >
      <span className="text-zinc-500 text-sm font-mono">{label}</span>
      <span className="font-mono text-zinc-100 group-hover:text-white">
        {copied ? <span className="text-emerald-400">copied!</span> : value}
      </span>
    </div>
  );
}

export function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<EpochResult | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch on load (now) and on input change
  const fetchResult = useCallback(async (q?: string) => {
    try {
      const url = q ? `/api/parse?q=${encodeURIComponent(q)}` : "/api/now";
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
        setError("");
      }
    } catch {
      setError("API unavailable");
      setResult(null);
    }
  }, []);

  useEffect(() => {
    fetchResult(input || undefined);
  }, [input, fetchResult]);

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-1">🕐 epoch</h1>
        <p className="text-zinc-500 text-sm">timestamp converter — click any value to copy</p>
      </div>

      {/* Live clock */}
      <div className="text-center mb-6">
        <span className="font-mono text-3xl text-emerald-400 tabular-nums">{now}</span>
        <p className="text-zinc-600 text-xs mt-1">current unix timestamp</p>
      </div>

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="paste a timestamp, date, or ISO string..."
        className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 mb-6"
      />

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      {result && (
        <div className="space-y-2">
          <Row label="unix" value={String(result.unix)} />
          <Row label="unix_ms" value={String(result.unixMs)} />
          <Row label="iso" value={result.iso} />
          <Row label="utc" value={result.utc} />
          <Row label="relative" value={result.relative} />
          <Row
            label="date"
            value={`${result.date.year}-${String(result.date.month).padStart(2, "0")}-${String(result.date.day).padStart(2, "0")} ${String(result.date.hour).padStart(2, "0")}:${String(result.date.minute).padStart(2, "0")}:${String(result.date.second).padStart(2, "0")}`}
          />
        </div>
      )}

      <footer className="text-center mt-12 text-zinc-700 text-xs">
        <a href="https://github.com/obrera/nightshift-000-epoch" className="hover:text-zinc-500">
          nightshift #000
        </a>{" "}
        — built by obrera 🐝
      </footer>
    </div>
  );
}
