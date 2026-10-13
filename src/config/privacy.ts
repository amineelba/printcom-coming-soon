// Facts for /politique-de-confidentialite that ONLY the owner can supply.
// `null` = not confirmed yet: the page flags it, and the page stays hidden in
// production until every entry is filled (see src/lib/privacy.ts).
// Never fill these from guesses: wrong legal information is worse than none.

export type PrivacyFacts = {
  /** Legal name and form of the company, e.g. exactly as on its registration. */
  controllerIdentity: string | null;
  /** Registered postal address. */
  controllerAddress: string | null;
  /** How long lead data is kept, and when it is deleted. */
  retention: string | null;
  /** Where Vercel / Neon / Titan process and store the data (regions, transfers). */
  dataLocations: string | null;
  /** Declaration / authorization status with the data-protection authority (CNDP), if any. */
  authorityStatus: string | null;
  /** Response time promised for access / deletion requests. */
  requestDeadline: string | null;
  /** Date this text was last validated by the owner (YYYY-MM-DD). */
  validatedOn: string | null;
};

export const privacyFacts: PrivacyFacts = {
  controllerIdentity: null,
  controllerAddress: null,
  retention: null,
  dataLocations: null,
  authorityStatus: null,
  requestDeadline: null,
  validatedOn: null,
};

export const PRIVACY_CONTACT = "contact@printcom.ma";
