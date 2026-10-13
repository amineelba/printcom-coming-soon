# Catalogue leads — backend setup, privacy and blockers

Endpoint: `POST /api/catalogue-leads` (`src/app/api/catalogue-leads/route.ts`).
Storage: a **dedicated Printcom Neon Postgres database**. Nothing has been provisioned: no Neon resource exists for this project yet, and no other database was touched.

## What the endpoint does
1. Same-origin check (`Origin`), `application/json` only, body ≤ 8 KB.
2. Best-effort rate limit: 5 requests / 10 min per IP (in memory, per serverless instance).
3. Server-side validation (`src/lib/leads/schema.ts`, shared with the form): required `name`, `email`, `project`, `consent === true`; length limits; control characters rejected; honeypot field `website` must be empty; `submissionKey` must be a UUID.
4. Parameterized insert (`src/lib/leads/repository.ts`, `@neondatabase/serverless` tagged template: values are never concatenated into SQL).
5. Duplicate protection: `submission_key` is UNIQUE (retry / double submit), and the same email is not inserted twice within 10 minutes. A duplicate answers 200 `{status:"duplicate"}`.

| Result | HTTP | Body |
|---|---|---|
| Saved | 201 | `{ok:true,status:"created"}` |
| Already saved | 200 | `{ok:true,status:"duplicate"}` |
| Invalid fields | 400 | `{ok:false,error:"validation",errors:{field:message}}` |
| Honeypot / bad key / bad JSON | 400 | `{ok:false,error:"bad_request"}` |
| Other origin | 403 | `{ok:false,error:"forbidden"}` |
| Too large / wrong content type | 413 / 415 | |
| Rate limited | 429 | `{ok:false,error:"rate_limited"}` + `Retry-After` |
| **`DATABASE_URL` missing or DB error** | **503** | `{ok:false,error:"unavailable"}` |

With no database the form shows an error and says the request was **not** saved. It never reports success. Errors are logged by name only, never with lead data.

## Database setup (owner approval required first)
1. In Neon, create a **new project dedicated to Printcom** (do not reuse another project). Pick an EU region close to Morocco; Neon holds personal data, so choose the region deliberately.
2. Run `db/migrations/0001_create_catalogue_leads.sql` in the Neon SQL editor (or `psql "$DATABASE_URL" -f db/migrations/0001_create_catalogue_leads.sql`). It is idempotent. Rollback: `DROP TABLE catalogue_leads;`.
3. Set `DATABASE_URL` (pooled connection string) as a **server-only** environment variable:
   - local: `.env.local` (see `.env.example`; `.env*` is git-ignored);
   - Vercel: Project `printcom-coming-soon` → Settings → Environment Variables, **Preview** first. Never prefix it with `NEXT_PUBLIC_`.
4. Redeploy the Preview and submit a test lead. Delete the test row afterwards.

Table `catalogue_leads`: `id` uuid, `submission_key` uuid unique, `full_name`, `email`, `phone`, `company`, `project`, `consent_at`, `consent_version` (`catalogue-2026-10-v1`), `source` (`coming-soon-catalogue`), `status` (`new`/`contacted`/`qualified`/`discarded`), `created_at`.

## Verification already done
- Migration + `insertLead` run against a real Postgres engine (PGlite, in a scratch folder, outside the repo): first insert, same-key retry, same-email duplicate, SQL-injection string stored as plain data, CHECK constraints, migration run twice.
- API behaviour with no `DATABASE_URL`: 503, never success.
- **Not verified:** a live Neon connection (no database exists yet).

## Privacy and consent
- Consent is required, timestamped (`consent_at`) and versioned. **If the consent wording in `CatalogueLead.tsx` changes, bump `CONSENT_VERSION` in `src/lib/leads/schema.ts`.**
- Collected: name, professional email, optional phone and company, project text. Used only to handle the request.
- No cookies, analytics or third-party scripts were added.

## Remaining production blockers
1. **Neon database** not created; `DATABASE_URL` not set anywhere. No lead can be saved until then.
2. **Privacy notice**: no privacy policy page exists and the popup links to none. Needed before public launch: controller identity, purposes, retention period, rights (access / rectification / deletion) and a contact. Check obligations under Moroccan law 09-08 / CNDP (declaration or authorization) with a qualified advisor.
3. **Retention and deletion process**: define how long leads are kept and how deletion requests are handled.
4. **Who reads the leads and how**: there is no admin screen or notification email. Leads sit in Neon until someone queries them. Decide the follow-up process (and add an owner-approved notification if wanted).
5. **Rate limiting**: the in-memory limiter is best effort only. Add a Vercel Firewall (WAF) rate-limit rule on `/api/catalogue-leads` before launch. Consider a CAPTCHA only if spam appears.
6. **The catalogue PDF does not exist.** The UI says so and offers no download. When it exists, decide the delivery mode (email after confirmation is safer than a public link) as a separate, approved task.
7. `contact@printcom.ma` must be a working mailbox (shown in the error message and used by the quote CTA).
