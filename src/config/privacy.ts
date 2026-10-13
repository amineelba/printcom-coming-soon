// Facts for /politique-de-confidentialite. `null` = NOT confirmed by the owner:
// the public page then says so plainly ("pas encore confirmé") instead of
// guessing. Never fill an entry from a guess: wrong legal information is worse
// than an honest "not yet".

export type PrivacyFacts = {
  /** Legal entity, as supplied by the owner. */
  controllerIdentity: string | null;
  /** Trade name / brand. */
  brand: string | null;
  /** Commercial register (RC) as supplied by the owner. */
  registerNumber: string | null;
  /** ICE number as supplied by the owner. */
  ice: string | null;
  /** Registered postal address. */
  controllerAddress: string | null;
  /** Response time for access / rectification / deletion requests. */
  requestDeadline: string | null;
  /** How long lead data is kept, and when it is deleted. */
  retention: string | null;
  /** Where Vercel / Neon / Titan process and store the data, and any transfer. */
  dataLocations: string | null;
  /** Declaration / authorization status with the data-protection authority (CNDP). */
  authorityStatus: string | null;
  /** Date the text was validated by the owner or a legal advisor (YYYY-MM-DD). */
  validatedOn: string | null;
};

/** Facts the page cannot be published without: who is responsible and how to exercise rights. */
export const REQUIRED_FOR_PUBLICATION: (keyof PrivacyFacts)[] = [
  "controllerIdentity",
  "controllerAddress",
  "requestDeadline",
];

export const privacyFacts: PrivacyFacts = {
  // Confirmed by the owner (message of 2026-10, Sprint 5):
  controllerIdentity: "Global Communication Corporate SARL AU",
  brand: "Printcom.ma",
  registerNumber: "RC Nador n° 30317",
  ice: "ICE 003852720000039",
  controllerAddress: "10 Rue Dar El Bayda, Quartier Hassan, 10000 Rabat, Maroc",
  requestDeadline: "30 jours",
  // Not confirmed yet: shown publicly as pending.
  retention: null,
  dataLocations: null,
  authorityStatus: null,
  validatedOn: null,
};

export const PRIVACY_CONTACT = "contact@printcom.ma";
export const CATALOGUE_SENDER = "sales@printcom.ma";
