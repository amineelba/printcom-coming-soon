import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BlueprintBackground } from "@/components/blueprint/BlueprintBackground";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PRIVACY_CONTACT, privacyFacts } from "@/config/privacy";
import { isPrivacyPageVisible, missingPrivacyFacts } from "@/lib/privacy";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Printcom",
  description: "Traitement des données personnelles du formulaire de demande de catalogue Printcom.",
  robots: { index: false, follow: false }, // until the owner validates the text
};

/** Visible flag for a fact only the owner can confirm. */
function ToConfirm({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-[#fff3cd] px-1.5 py-0.5 text-[#664d03]">
      <strong>À confirmer par Printcom :</strong> {children}
    </span>
  );
}

function Fact({ value, missing }: { value: string | null; missing: string }) {
  return value ? <>{value}</> : <ToConfirm>{missing}</ToConfirm>;
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-8">
      <h2 id={id} className="text-pf-1 font-semibold text-[#11265c]">
        {title}
      </h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  if (!isPrivacyPageVisible()) notFound();

  const f = privacyFacts;
  const draft = missingPrivacyFacts().length > 0;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      <BlueprintBackground />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex flex-1 justify-center px-5 pb-12 pt-6">
          <article className="w-full max-w-[760px] rounded-[22px] border border-[#dbe3f3] bg-white p-[clamp(20px,4vw,40px)] text-pf-0 leading-[1.65] text-[#243252] shadow-[0_30px_110px_#00155f55]">
            <p>
              <Link href="/" className="text-[#1246c3] underline underline-offset-2 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1558db]">
                ← Retour au site
              </Link>
            </p>
            <h1 className="mt-4 text-pf-3 font-semibold leading-[1.15] text-[#11265c]">
              Politique de confidentialité
            </h1>
            <p className="mt-2 text-pf-sm text-[#526483]">
              Formulaire « Demander notre catalogue » du site Printcom en construction.
              {f.validatedOn ? ` Dernière validation : ${f.validatedOn}.` : null}
            </p>

            {draft ? (
              <p role="note" className="mt-5 rounded-[10px] border border-[#e0c46c] bg-[#fff8e1] p-4 text-pf-sm text-[#664d03]">
                <strong>Version de travail, non validée.</strong> Les mentions marquées « À confirmer
                par Printcom » doivent être complétées et vérifiées par le propriétaire (idéalement
                avec un conseil juridique) avant toute publication. Ce texte décrit le
                fonctionnement réel du formulaire ; il ne constitue pas une garantie de conformité
                légale.
              </p>
            ) : null}

            <Section id="responsable" title="1. Responsable du traitement et contact">
              <p>
                Le responsable du traitement est Printcom :{" "}
                <Fact value={f.controllerIdentity} missing="dénomination sociale et forme juridique" />
                {". "}
                Adresse :{" "}
                <Fact value={f.controllerAddress} missing="adresse postale du siège" />
                {"."}
              </p>
              <p>
                Contact pour toute question sur vos données :{" "}
                <a className="text-[#1246c3] underline underline-offset-2" href={`mailto:${PRIVACY_CONTACT}`}>
                  {PRIVACY_CONTACT}
                </a>
                .
              </p>
            </Section>

            <Section id="donnees" title="2. Données personnelles collectées par le formulaire">
              <ul className="list-disc space-y-1 pl-5">
                <li>Nom complet (obligatoire)</li>
                <li>Adresse email professionnelle (obligatoire)</li>
                <li>Numéro de téléphone (facultatif)</li>
                <li>Entreprise (facultatif)</li>
                <li>Description de votre projet (obligatoire)</li>
                <li>
                  Données techniques d’enregistrement : date et version du consentement, identifiant
                  de la demande, origine de la demande, statut de traitement.
                </li>
              </ul>
              <p>
                Le formulaire n’enregistre pas votre adresse IP dans la base de données de demandes.
                Les services techniques listés ci-dessous peuvent toutefois conserver des journaux
                techniques de connexion.{" "}
                <ToConfirm>vérifier ces journaux et d’éventuels cookies déposés par l’hébergement ou le service DNS/CDN.</ToConfirm>
              </p>
            </Section>

            <Section id="finalites" title="3. Finalités et base du traitement">
              <p>
                Vos données sont utilisées pour traiter votre demande de catalogue et vous recontacter
                par email à ce sujet. Le traitement repose sur votre consentement, exprimé en cochant
                la case du formulaire.
              </p>
              <p>
                Cette demande ne vous inscrit à aucune communication commerciale : Printcom
                n’utilisera pas ces données pour vous envoyer des offres promotionnelles ou une lettre
                d’information sans votre accord distinct.
              </p>
              <p>
                <ToConfirm>confirmation de la base légale par le propriétaire / son conseil.</ToConfirm>
              </p>
            </Section>

            <Section id="destinataires" title="4. Destinataires et prestataires techniques">
              <p>
                Les données sont accessibles aux personnes de l’équipe Printcom chargées de répondre
                aux demandes. Le catalogue est transmis manuellement par l’équipe, par email.
              </p>
              <p>Prestataires techniques utilisés par le formulaire :</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Vercel : hébergement du site et du service qui reçoit le formulaire ;</li>
                <li>Neon : base de données PostgreSQL où la demande est enregistrée ;</li>
                <li>Titan : messagerie email utilisée pour notifier l’équipe Printcom et vous répondre ;</li>
                <li>
                  services DNS / réseau du nom de domaine.{" "}
                  <ToConfirm>nom du ou des services effectivement utilisés en production.</ToConfirm>
                </li>
              </ul>
              <p>
                Localisation du stockage et transferts éventuels hors du Maroc :{" "}
                <Fact value={f.dataLocations} missing="régions d’hébergement de Vercel, Neon et Titan, et encadrement des transferts" />
              </p>
            </Section>

            <Section id="conservation" title="5. Conservation et suppression">
              <p>
                Durée de conservation :{" "}
                <Fact value={f.retention} missing="durée précise et moment de la suppression des demandes" />
              </p>
              <p>
                Vous pouvez demander la suppression de votre demande à tout moment (voir section 6).
              </p>
            </Section>

            <Section id="droits" title="6. Vos droits : accès, rectification, suppression">
              <p>
                Vous pouvez demander l’accès aux données vous concernant, leur rectification ou leur
                suppression, et retirer votre consentement, en écrivant à{" "}
                <a className="text-[#1246c3] underline underline-offset-2" href={`mailto:${PRIVACY_CONTACT}`}>
                  {PRIVACY_CONTACT}
                </a>{" "}
                en indiquant le nom et l’email utilisés dans le formulaire. Printcom peut vous demander
                de justifier votre identité.
              </p>
              <p>
                Délai de réponse :{" "}
                <Fact value={f.requestDeadline} missing="délai de réponse aux demandes" />
              </p>
              <p>
                Autorité de protection des données (CNDP) :{" "}
                <Fact value={f.authorityStatus} missing="statut de la déclaration ou autorisation, et mention du droit de réclamation, selon la loi applicable" />
              </p>
            </Section>

            <Section id="securite" title="7. Sécurité">
              <p>
                Le formulaire est transmis via une connexion chiffrée (HTTPS), les données sont
                contrôlées côté serveur avant enregistrement et l’accès à la base est protégé par des
                identifiants réservés à Printcom. Aucune mesure de sécurité ne peut toutefois être
                garantie absolue.
              </p>
            </Section>
          </article>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
