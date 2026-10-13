import {
  privacyFacts,
  REQUIRED_FOR_PUBLICATION,
  type PrivacyFacts,
} from "@/config/privacy";

export const PRIVACY_PATH = "/politique-de-confidentialite";

type Env = Record<string, string | undefined>;

const isMissing = (v: string | null | undefined) => !v?.trim();

/** Facts still unconfirmed (shown on the page as "not yet confirmed"). */
export function pendingPrivacyFacts(facts: PrivacyFacts = privacyFacts): (keyof PrivacyFacts)[] {
  return (Object.keys(facts) as (keyof PrivacyFacts)[]).filter((k) => isMissing(facts[k]));
}

/** Facts without which the page must not be published at all. */
export function missingRequiredPrivacyFacts(
  facts: PrivacyFacts = privacyFacts,
): (keyof PrivacyFacts)[] {
  return REQUIRED_FOR_PUBLICATION.filter((k) => isMissing(facts[k]));
}

/**
 * The privacy page, and the link to it in the form, are visible when the
 * controller identity, address and request deadline are filled in. Facts that
 * are still unknown are disclosed on the page, not hidden. `PRIVACY_PAGE_DISABLED=true`
 * is a kill switch (read at build time: redeploy after changing it).
 */
export function isPrivacyPageVisible(
  env: Env = process.env,
  facts: PrivacyFacts = privacyFacts,
): boolean {
  if (env.PRIVACY_PAGE_DISABLED === "true") return false;
  return missingRequiredPrivacyFacts(facts).length === 0;
}
