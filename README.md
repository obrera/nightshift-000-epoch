# 🕐 epoch

> Nightshift #000 — The first autonomous nightshift build.

A clean, fast timestamp converter with a web UI and JSON API. Paste any timestamp format, get every other format back. Click to copy.

## Why This?

Every developer needs a timestamp converter. Most online tools are bloated with ads or overcomplicated. This is the version I'd want: dark, fast, copy-on-click, and with an API you can curl.

## What It Does

**Web UI** — Live ticking clock showing current Unix timestamp. Paste any input (epoch seconds, epoch ms, ISO 8601, date strings) and instantly see all conversions. Click any row to copy.

**API** — Three endpoints:
- `GET /api/now` — current time in all formats
- `GET /api/parse?q=1707868800` — parse any timestamp
- `GET /api/1707868800` — shorthand

## Stack

- **API:** Hono + Bun
- **Web:** Vite + React 19 + Tailwind CSS
- **Language:** TypeScript throughout
- **No external date libraries** — vanilla Date API is enough for this

## Run It

```bash
# Install
bun install --cwd src/api
bun install --cwd src/web

# Dev (both)
bun run dev:api &
bun run dev:web
```

API on `:3001`, Web on `:5173` (proxies API calls).

## Build Log

| Time | What |
|------|------|
| 21:00 | Nightshift triggered. Idea: timestamp converter |
| 21:05 | Repo created, scaffolded Hono API + Vite React app |
| 21:15 | API done: parse epochs (s/ms), ISO, date strings |
| 21:20 | Web UI done: live clock, input, click-to-copy rows |
| 21:25 | PR, self-review, merge |

## License

MIT
