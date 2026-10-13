// Shared by the lead form (client) and POST /api/catalogue-leads (server).
// The server never trusts the client: it always re-runs validateLead.

// Bump whenever the consent wording or its help text in CatalogueLead.tsx changes.
// v1: "J'accepte d'être recontacté(e) par Printcom au sujet de cette demande."
// v2: processing consent for the catalogue request only; explicit "no marketing" statement.
export const CONSENT_VERSION = "catalogue-2026-10-v2";
export const LEAD_SOURCE = "coming-soon-catalogue";

export const LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 254 },
  phone: { max: 40 },
  company: { max: 120 },
  project: { min: 10, max: 2000 },
} as const;

export type LeadField =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "project"
  | "consent";

export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  project: string;
  consent: boolean;
  submissionKey: string;
  website: string; // honeypot: must stay empty
};

export type LeadErrors = Partial<Record<LeadField, string>>;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_RE = /^[0-9+()\-.\s]+$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Control characters are rejected (newlines/tabs allowed only in `project`).
const CONTROL_RE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateLead(
  raw: unknown,
):
  | { ok: true; value: LeadInput }
  | { ok: false; errors: LeadErrors; honeypot: boolean; badKey: boolean } {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const value: LeadInput = {
    name: str(o.name),
    email: str(o.email),
    phone: str(o.phone),
    company: str(o.company),
    project: str(o.project),
    consent: o.consent === true,
    submissionKey: str(o.submissionKey),
    website: typeof o.website === "string" ? o.website : "",
  };

  const errors: LeadErrors = {};
  const { name, email, phone, company, project } = value;

  if (!name) errors.name = "Indiquez votre nom complet.";
  else if (name.length < LIMITS.name.min || name.length > LIMITS.name.max)
    errors.name = `Le nom doit contenir entre ${LIMITS.name.min} et ${LIMITS.name.max} caractères.`;
  else if (CONTROL_RE.test(name) || /[\r\n\t]/.test(name))
    errors.name = "Le nom contient des caractères non valides.";

  if (!email) errors.email = "Indiquez votre email professionnel.";
  else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email))
    errors.email = "Indiquez une adresse email valide.";

  if (phone) {
    if (phone.length > LIMITS.phone.max || !PHONE_RE.test(phone))
      errors.phone = "Indiquez un numéro de téléphone valide.";
  }

  if (company) {
    if (company.length > LIMITS.company.max)
      errors.company = `Maximum ${LIMITS.company.max} caractères.`;
    else if (CONTROL_RE.test(company) || /[\r\n\t]/.test(company))
      errors.company = "Ce champ contient des caractères non valides.";
  }

  if (!project) errors.project = "Décrivez brièvement votre projet.";
  else if (project.length < LIMITS.project.min)
    errors.project = `Décrivez votre projet en au moins ${LIMITS.project.min} caractères.`;
  else if (project.length > LIMITS.project.max)
    errors.project = `Maximum ${LIMITS.project.max} caractères.`;
  else if (CONTROL_RE.test(project))
    errors.project = "Ce champ contient des caractères non valides.";

  if (!value.consent) errors.consent = "Votre accord est nécessaire pour envoyer la demande.";

  const badKey = !UUID_RE.test(value.submissionKey);
  const honeypot = value.website !== "";
  if (Object.keys(errors).length > 0 || badKey || honeypot) {
    return { ok: false, errors, honeypot, badKey };
  }
  return { ok: true, value };
}
