-- Printcom coming-soon: catalogue leads.
-- Apply to the DEDICATED Printcom Neon database only (see docs/BACKEND_SETUP.md).
-- Idempotent: safe to run twice.

CREATE TABLE IF NOT EXISTS catalogue_leads (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_key  uuid        NOT NULL UNIQUE,
  full_name       text        NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email           text        NOT NULL CHECK (char_length(email) <= 254),
  phone           text        CHECK (phone IS NULL OR char_length(phone) <= 40),
  company         text        CHECK (company IS NULL OR char_length(company) <= 120),
  project         text        NOT NULL CHECK (char_length(project) BETWEEN 10 AND 2000),
  consent_at      timestamptz NOT NULL,
  consent_version text        NOT NULL,
  source          text        NOT NULL DEFAULT 'coming-soon-catalogue',
  status          text        NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'contacted', 'qualified', 'discarded')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS catalogue_leads_created_at_idx
  ON catalogue_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS catalogue_leads_email_idx
  ON catalogue_leads (lower(email), created_at DESC);

-- Rollback: DROP TABLE catalogue_leads;
