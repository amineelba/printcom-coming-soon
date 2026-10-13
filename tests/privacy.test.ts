import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { PrivacyFacts } from "@/config/privacy";
import { privacyFacts, REQUIRED_FOR_PUBLICATION } from "@/config/privacy";
import { CONSENT_VERSION, validateLead } from "@/lib/leads/schema";
import {
  isPrivacyPageVisible,
  missingRequiredPrivacyFacts,
  pendingPrivacyFacts,
} from "@/lib/privacy";

const NONE = Object.fromEntries(Object.keys(privacyFacts).map((k) => [k, null])) as PrivacyFacts;

describe("privacy facts: only what the owner confirmed", () => {
  it("contains exactly the owner-confirmed identity facts", () => {
    assert.equal(privacyFacts.controllerIdentity, "Global Communication Corporate SARL AU");
    assert.equal(privacyFacts.registerNumber, "RC Nador n° 30317");
    assert.equal(privacyFacts.ice, "ICE 003852720000039");
    assert.equal(
      privacyFacts.controllerAddress,
      "10 Rue Dar El Bayda, Quartier Hassan, 10000 Rabat, Maroc",
    );
    assert.equal(privacyFacts.requestDeadline, "30 jours");
  });
  it("keeps the unconfirmed facts unset (nothing invented)", () => {
    for (const k of ["retention", "dataLocations", "authorityStatus", "validatedOn"] as const) {
      assert.equal(privacyFacts[k], null, k);
    }
    assert.deepEqual(pendingPrivacyFacts().sort(), [
      "authorityStatus",
      "dataLocations",
      "retention",
      "validatedOn",
    ]);
  });
});

describe("privacy page visibility", () => {
  it("is visible with the confirmed facts, even while other points are pending", () => {
    assert.equal(isPrivacyPageVisible({}, privacyFacts), true);
    assert.deepEqual(missingRequiredPrivacyFacts(privacyFacts), []);
  });
  it("is hidden when a required fact is missing", () => {
    for (const k of REQUIRED_FOR_PUBLICATION) {
      assert.equal(isPrivacyPageVisible({}, { ...privacyFacts, [k]: " " }), false, k);
    }
    assert.equal(isPrivacyPageVisible({}, NONE), false);
  });
  it("kill switch PRIVACY_PAGE_DISABLED=true hides it", () => {
    assert.equal(isPrivacyPageVisible({ PRIVACY_PAGE_DISABLED: "true" }, privacyFacts), false);
    assert.equal(isPrivacyPageVisible({ PRIVACY_PAGE_DISABLED: "false" }, privacyFacts), true);
  });
});

describe("page text does not claim compliance or invent facts", () => {
  const src = readFileSync(
    new URL("../src/app/politique-de-confidentialite/page.tsx", import.meta.url),
    "utf8",
  );
  it("states it is not a compliance statement", () => {
    assert.ok(src.includes("ne constitue pas une déclaration de conformité"));
    assert.ok(src.includes("n’a pas encore été validé par un conseil juridique"));
  });
  it("never asserts conformity, CNDP registration or a retention period", () => {
    for (const bad of [/conforme à la loi/i, /conforme au rgpd/i, /enregistré auprès de la cndp/i, /déclar[ée]+ (à|auprès de) la cndp/i, /\b\d+ (mois|ans)\b/]) {
      assert.ok(!bad.test(src), String(bad));
    }
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
