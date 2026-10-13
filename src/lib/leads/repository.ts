import "server-only";
import { neon } from "@neondatabase/serverless";
import { CONSENT_VERSION, LEAD_SOURCE, type LeadInput } from "./schema";

export type InsertResult = "created" | "duplicate";

// Minimal tagged-template executor, so tests can inject a fake.
export type Sql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

/** Returns null when DATABASE_URL is missing: callers must fail safely. */
export function getSql(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url) as unknown as Sql;
}

/**
 * Parameterized insert. Duplicate protection:
 *  - submission_key is UNIQUE (same form submitted twice / retried);
 *  - the same email within 10 minutes is not inserted again.
 */
export async function insertLead(sql: Sql, lead: LeadInput): Promise<InsertResult> {
  const rows = await sql`
    INSERT INTO catalogue_leads
      (submission_key, full_name, email, phone, company, project,
       consent_at, consent_version, source)
    SELECT
      ${lead.submissionKey}::uuid, ${lead.name}, ${lead.email},
      ${lead.phone || null}, ${lead.company || null}, ${lead.project},
      now(), ${CONSENT_VERSION}, ${LEAD_SOURCE}
    WHERE NOT EXISTS (
      SELECT 1 FROM catalogue_leads
      WHERE lower(email) = lower(${lead.email})
        AND created_at > now() - interval '10 minutes'
    )
    ON CONFLICT (submission_key) DO NOTHING
    RETURNING id`;
  return rows.length > 0 ? "created" : "duplicate";
}
