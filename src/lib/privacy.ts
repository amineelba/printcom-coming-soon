import { privacyFacts, type PrivacyFacts } from "@/config/privacy";

export const PRIVACY_PATH = "/politique-de-confidentialite";

type Env = Record<string, string | undefined>;

export function missingPrivacyFacts(facts: PrivacyFacts = privacyFacts): (keyof PrivacyFacts)[] {
  return (Object.keys(facts) as (keyof PrivacyFacts)[]).filter((k) => !facts[k]?.trim());
}

/**
 * The privacy page (and the link to it in the form) is visible only when:
 *  - PRIVACY_PAGE_ENABLED === "true" (server-only flag, off by default), and
 *  - in production, every owner-supplied fact is filled in.
 * Previews/dev with the flag on may show the draft with its "to confirm" flags.
 * Read at build time: redeploy after changing the flag.
 */
export function isPrivacyPageVisible(
  env: Env = process.env,
  facts: PrivacyFacts = privacyFacts,
): boolean {
  if (env.PRIVACY_PAGE_ENABLED !== "true") return false;
  if (env.VERCEL_ENV === "production" && missingPrivacyFacts(facts).length > 0) return false;
  return true;
}
