import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { POST } from "@/app/api/catalogue-leads/route";

// The route must still fail safely, with no database and no mail settings.
describe("POST /api/catalogue-leads (no DATABASE_URL)", () => {
  const saved = { ...process.env };
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.LEAD_SMTP_USER;
    delete process.env.LEAD_SMTP_PASSWORD;
    delete process.env.LEAD_NOTIFY_TO;
    mock.method(console, "error", () => {});
  });
  afterEach(() => {
    process.env = { ...saved };
    mock.restoreAll();
  });

  it("answers 503 and never a fake success", async () => {
    const res = await POST(
      new Request("http://localhost/api/catalogue-leads", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.9" },
        body: JSON.stringify({
          name: "Amina Benali",
          email: "amina@exemple.ma",
          project: "Brochures et cartes de visite",
          consent: true,
          submissionKey: "8f14e45f-ceea-4e6a-9d3b-0c1f5a2b7d11",
          website: "",
        }),
      }),
    );
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { ok: false, error: "unavailable" });
  });
});
