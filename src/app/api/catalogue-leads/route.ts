import { insertLead, getSql } from "@/lib/leads/repository";
import { isRateLimited } from "@/lib/leads/rate-limit";
import { validateLead } from "@/lib/leads/schema";

const MAX_BODY_BYTES = 8 * 1024;

const json = (body: Record<string, unknown>, status: number, headers?: HeadersInit) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

function clientKey(request: Request): string {
  // Vercel sets x-forwarded-for; the first entry is the client.
  const xff = request.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  // Same-origin browsers only (light CSRF / abuse guard).
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ ok: false, error: "forbidden" }, 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "bad_request" }, 415);
  }

  if (isRateLimited(clientKey(request))) {
    return json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": "600" });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const result = validateLead(body);
  if (!result.ok) {
    if (result.honeypot || result.badKey) {
      return json({ ok: false, error: "bad_request" }, 400);
    }
    return json({ ok: false, error: "validation", errors: result.errors }, 400);
  }

  // No database configured: never pretend the lead was saved.
  const sql = getSql();
  if (!sql) return json({ ok: false, error: "unavailable" }, 503);

  try {
    const status = await insertLead(sql, result.value);
    return json({ ok: true, status }, status === "created" ? 201 : 200);
  } catch (err) {
    // Log the error kind only: never lead data.
    console.error("catalogue-leads: insert failed", err instanceof Error ? err.name : "unknown");
    return json({ ok: false, error: "unavailable" }, 503);
  }
}
