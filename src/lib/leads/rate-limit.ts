import "server-only";

// Best-effort, per-instance sliding window. On serverless each instance has its
// own memory, so this only blunts bursts. Real protection for production must
// also use a Vercel Firewall / WAF rate-limit rule (see docs/BACKEND_SETUP.md).

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const MAX_KEYS = 5000;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}
