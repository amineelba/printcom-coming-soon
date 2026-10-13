import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { PrivacyFacts } from "@/config/privacy";
import { privacyFacts } from "@/config/privacy";
import { CONSENT_VERSION, validateLead } from "@/lib/leads/schema";
import { isPrivacyPageVisible, missingPrivacyFacts } from "@/lib/privacy";

const COMPLETE: PrivacyFacts = {
  controllerIdentity: "x",
  controllerAddress: "x",
  retention: "x",
  dataLocations: "x",
  authorityStatus: "x",
  requestDeadline: "x",
  validatedOn: "2026-10-20",
};

describe("privacy page visibility", () => {
  it("ships with every owner-only fact unconfirmed (nothing invented)", () => {
    assert.equal(missingPrivacyFacts(privacyFacts).length, Object.keys(privacyFacts).length);
  });
  it("is hidden by default", () => {
    assert.equal(isPrivacyPageVisible({}, COMPLETE), false);
    assert.equal(isPrivacyPageVisible({ PRIVACY_PAGE_ENABLED: "false" }, COMPLETE), false);
    assert.equal(isPrivacyPageVisible({ PRIVACY_PAGE_ENABLED: "1" }, COMPLETE), false);
  });
  it("production stays hidden while any fact is missing, even with the flag on", () => {
    const env = { PRIVACY_PAGE_ENABLED: "true", VERCEL_ENV: "production" };
    assert.equal(isPrivacyPageVisible(env, privacyFacts), false);
    assert.equal(isPrivacyPageVisible(env, { ...COMPLETE, retention: " " }), false);
  });
  it("production shows the page once the flag is on and every fact is filled", () => {
    assert.equal(
      isPrivacyPageVisible({ PRIVACY_PAGE_ENABLED: "true", VERCEL_ENV: "production" }, COMPLETE),
      true,
    );
  });
  it("preview/dev can show the flagged draft with the flag on", () => {
    assert.equal(isPrivacyPageVisible({ PRIVACY_PAGE_ENABLED: "true", VERCEL_ENV: "preview" }, privacyFacts), true);
    assert.equal(isPrivacyPageVisible({ PRIVACY_PAGE_ENABLED: "true" }, privacyFacts), true);
  });
});

describe("consent", () => {
  it("consent version was bumped with the new wording", () => {
    assert.equal(CONSENT_VERSION, "catalogue-2026-10-v2");
  });
  it("server still requires consent and never infers marketing consent", () => {
    const base = {
      name: "Amina Benali",
      email: "amina@exemple.ma",
      project: "Brochures et cartes de visite",
      submissionKey: "8f14e45f-ceea-4e6a-9d3b-0c1f5a2b7d11",
      website: "",
    };
    const refused = validateLead({ ...base, consent: false });
    assert.equal(refused.ok, false);
    assert.ok(!refused.ok && refused.errors.consent);
    const ok = validateLead({ ...base, consent: true });
    assert.equal(ok.ok, true);
    assert.ok(ok.ok && !("marketing" in ok.value) && !("marketingConsent" in ok.value));
  });
});

describe("catalogue request wording (no download promise)", () => {
  const src = readFileSync(new URL("../src/components/lead/CatalogueLead.tsx", import.meta.url), "utf8");
  it("uses the approved request wording", () => {
    for (const t of [
      "Demander notre catalogue",
      "Demandez notre catalogue",
      "Envoyer ma demande",
      "Votre demande a bien été enregistrée.",
      "Notre équipe reviendra vers vous par email pour vous transmettre le catalogue.",
    ]) assert.ok(src.includes(t), t);
  });
  it("no longer says download or instant delivery", () => {
    for (const t of ["Télécharger", "Obtenir mon catalogue", "Recevez notre catalogue", "téléchargement"]) {
      assert.ok(!src.includes(t), t);
    }
  });
});
