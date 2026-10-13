import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import type { MailMessage } from "@/lib/leads/notify";
import { notifyNewLead } from "@/lib/leads/notify";
import type { Sql } from "@/lib/leads/repository";
import type { LeadInput } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit";

const SECRET = "s3cret-smtp-password";
const ENV = {
  LEAD_SMTP_USER: "notifier@printcom.ma",
  LEAD_SMTP_PASSWORD: SECRET,
  LEAD_NOTIFY_TO: "contact@printcom.ma",
};
const LEAD: LeadInput = {
  name: "Amina Benali",
  email: "amina@exemple-entreprise.ma",
  phone: "+212 600 000 000",
  company: "Atelier <b>Benali</b>",
  project: "500 brochures A4\nplus des cartes de visite",
  consent: true,
  submissionKey: "8f14e45f-ceea-4e6a-9d3b-0c1f5a2b7d11",
  website: "",
};

// Fake tagged-template SQL: INSERT ... RETURNING id yields a row when "created".
const sqlReturning = (rows: Record<string, unknown>[]) => {
  const calls: string[] = [];
  const sql = (async (strings: TemplateStringsArray) => {
    calls.push(strings.join("?"));
    return rows;
  }) as Sql;
  return { sql, calls };
};

let logged: string[];
beforeEach(() => {
  logged = [];
  mock.method(console, "error", (...args: unknown[]) => void logged.push(args.map(String).join(" ")));
});
afterEach(() => mock.restoreAll());

const fakeTransport = (impl: (m: MailMessage) => Promise<unknown>) => {
  const sent: MailMessage[] = [];
  const createTransport = mock.fn(() => ({
    sendMail: async (m: MailMessage) => {
      sent.push(m);
      return impl(m);
    },
  }));
  return { sent, createTransport };
};

describe("catalogue lead notification", () => {
  it("new lead: inserts, then emails contact@ with Reply-To = prospect, no attachment", async () => {
    const { sql, calls } = sqlReturning([{ id: "uuid-1" }]);
    const t = fakeTransport(async () => ({ accepted: ["contact@printcom.ma"] }));
    const result = await submitLead(sql, LEAD, (lead) =>
      notifyNewLead(lead, { env: ENV, createTransport: t.createTransport }),
    );

    assert.deepEqual(result, { status: "created", notification: "sent" });
    assert.equal(calls.length, 1);
    assert.equal(t.sent.length, 1);
    const mail = t.sent[0];
    assert.equal(mail.to, "contact@printcom.ma");
    assert.equal(mail.replyTo, LEAD.email);
    assert.equal(mail.from, "Printcom <notifier@printcom.ma>");
    for (const v of [LEAD.name, LEAD.email, LEAD.phone, LEAD.company, "500 brochures A4"]) {
      assert.ok(mail.text.includes(v), `text contains ${v}`);
    }
    assert.ok(mail.html.includes("Atelier &lt;b&gt;Benali&lt;/b&gt;"), "html is escaped");
    assert.ok(!("attachments" in mail), "no attachment, no automatic catalogue");
    assert.ok(!mail.text.includes(SECRET) && !mail.html.includes(SECRET));
    assert.deepEqual(logged, []);
  });

  it("uses Titan SMTP over SSL by default (smtp.titan.email:465)", async () => {
    const mod = await import("nodemailer");
    const spy = mock.method(mod.default, "createTransport", () => ({
      sendMail: async () => ({}),
    }) as never);
    assert.equal(await notifyNewLead(LEAD, { env: ENV }), "sent");
    const opts = spy.mock.calls[0].arguments[0] as Record<string, unknown>;
    assert.equal(opts.host, "smtp.titan.email");
    assert.equal(opts.port, 465);
    assert.equal(opts.secure, true);
  });

  it("duplicate: never notified, no transport created", async () => {
    const { sql } = sqlReturning([]); // ON CONFLICT / NOT EXISTS -> no row returned
    const t = fakeTransport(async () => ({}));
    const result = await submitLead(sql, LEAD, (lead) =>
      notifyNewLead(lead, { env: ENV, createTransport: t.createTransport }),
    );

    assert.deepEqual(result, { status: "duplicate", notification: "none" });
    assert.equal(t.createTransport.mock.callCount(), 0);
    assert.equal(t.sent.length, 0);
  });

  it("SMTP failure: lead stays saved, result is success-shaped, log has no personal data or secrets", async () => {
    const { sql, calls } = sqlReturning([{ id: "uuid-2" }]);
    const t = fakeTransport(async () => {
      throw Object.assign(
        new Error(`550 5.1.1 <${LEAD.email}> rejected for ${LEAD.name} using ${SECRET}`),
        { code: "EAUTH" },
      );
    });
    const result = await submitLead(sql, LEAD, (lead) =>
      notifyNewLead(lead, { env: ENV, createTransport: t.createTransport }),
    );

    assert.deepEqual(result, { status: "created", notification: "failed" });
    assert.equal(calls.length, 1, "the INSERT happened before the email");
    assert.equal(logged.length, 1);
    assert.match(logged[0], /notification failed EAUTH/);
    const all = logged.join("\n");
    for (const forbidden of [SECRET, LEAD.email, LEAD.name, LEAD.phone, "Benali", "500 brochures"]) {
      assert.ok(!all.includes(forbidden), `log must not contain ${forbidden}`);
    }
  });

  it("SMTP hang: gives up after the timeout and keeps the lead", async () => {
    const { sql } = sqlReturning([{ id: "uuid-3" }]);
    const t = fakeTransport(() => new Promise(() => {})); // never settles
    const result = await submitLead(sql, LEAD, (lead) =>
      notifyNewLead(lead, { env: ENV, createTransport: t.createTransport, timeoutMs: 20 }),
    );
    assert.deepEqual(result, { status: "created", notification: "failed" });
    assert.match(logged.join(), /ETIMEDOUT/);
  });

  for (const missing of ["LEAD_SMTP_USER", "LEAD_SMTP_PASSWORD", "LEAD_NOTIFY_TO"] as const) {
    it(`missing ${missing}: skips the email, keeps the lead, logs no secret`, async () => {
      const { sql, calls } = sqlReturning([{ id: "uuid-4" }]);
      const t = fakeTransport(async () => ({}));
      const env: Record<string, string | undefined> = { ...ENV, [missing]: undefined };
      const result = await submitLead(sql, LEAD, (lead) =>
        notifyNewLead(lead, { env, createTransport: t.createTransport }),
      );

      assert.deepEqual(result, { status: "created", notification: "skipped" });
      assert.equal(calls.length, 1);
      assert.equal(t.createTransport.mock.callCount(), 0);
      assert.equal(logged.length, 1);
      assert.ok(!logged.join().includes(SECRET));
      assert.ok(!logged.join().includes(LEAD.email));
    });
  }
});
