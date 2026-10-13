import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BlueprintBackground } from "@/components/blueprint/BlueprintBackground";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CATALOGUE_SENDER, PRIVACY_CONTACT, privacyFacts } from "@/config/privacy";
import { isPrivacyPageVisible, pendingPrivacyFacts } from "@/lib/privacy";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Printcom",
  description: "Traitement des données personnelles du formulaire de demande de catalogue Printcom.",
  robots: { index: false, follow: false }, // text not yet validated by a legal advisor
};

const link =
  "text-[#1246c3] underline underline-offset-2 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1558db]";

/** A point Printcom has not settled yet: said openly, not hidden. */
function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-[#fff3cd] px-1.5 py-0.5 text-[#664d03]">
      <strong>Pas encore confirmé :</strong> {children}
    </span>
  );
}

function Fact({ value, pending }: { value: string | null; pending: string }) {
  return value ? <>{value}</> : <Pending>{pending}</Pending>;
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
  const hasPending = pendingPrivacyFacts().length > 0;
  const mail = (
    <a className={link} href={`mailto:${PRIVACY_CONTACT}`}>
      {PRIVACY_CONTACT}
    </a>
  );

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      <BlueprintBackground />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex flex-1 justify-center px-5 pb-12 pt-6">
          <article className="w-full max-w-[760px] rounded-[22px] border border-[#dbe3f3] bg-white p-[clamp(20px,4vw,40px)] text-pf-0 leading-[1.65] text-[#243252] shadow-[0_30px_110px_#00155f55]">
            <p>
              <Link href="/" className={link}>
                ← Retour au site
              </Link>
            </p>
            <h1 className="mt-4 text-pf-3 font-semibold leading-[1.15] text-[#11265c]">
              Politique de confidentialité
            </h1>
            <p className="mt-2 text-pf-sm text-[#526483]">
              Formulaire « Demander notre catalogue » du site Printcom.{" "}
              {f.validatedOn
                ? `Texte validé le ${f.validatedOn}.`
                : "Ce texte n’a pas encore été validé par un conseil juridique."}
            </p>

            <p role="note" className="mt-5 rounded-[10px] border border-[#e0c46c] bg-[#fff8e1] p-4 text-pf-sm text-[#664d03]">
              <strong>Publié en l’état.</strong> Cette page décrit le fonctionnement réel du
              formulaire.{" "}
              {hasPending
                ? "Certains points ne sont pas encore arrêtés par Printcom : ils sont signalés « Pas encore confirmé » et seront complétés. "
                : null}
              Elle ne constitue pas une déclaration de conformité à une réglementation.
            </p>

            <Section id="responsable" title="1. Responsable du traitement et contact">
              <p>
                Le responsable du traitement est{" "}
                <Fact value={f.controllerIdentity} pending="dénomination sociale et forme juridique" />
                {f.brand ? ` (marque ${f.brand})` : null}
                {f.registerNumber ? `, ${f.registerNumber}` : null}
                {f.ice ? `, ${f.ice}` : null}. Adresse :{" "}
                <Fact value={f.controllerAddress} pending="adresse postale du siège" />.
              </p>
              <p>Contact pour toute question sur vos données : {mail}.</p>
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
                <Pending>
                  ces journaux, ainsi que d’éventuels cookies déposés par l’hébergement ou le service
                  DNS/CDN, n’ont pas encore été vérifiés.
                </Pending>
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
                <Pending>cette base légale n’a pas encore été validée par un conseil juridique.</Pending>
              </p>
            </Section>

            <Section id="destinataires" title="4. Destinataires et prestataires techniques">
              <p>
                Les données sont accessibles aux personnes de l’équipe Printcom chargées de répondre
                aux demandes. Le catalogue est transmis manuellement par l’équipe, par email, depuis
                l’adresse {CATALOGUE_SENDER}.
              </p>
              <p>Prestataires techniques utilisés par le formulaire :</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Vercel : hébergement du site et du service qui reçoit le formulaire ;</li>
                <li>Neon : base de données PostgreSQL où la demande est enregistrée ;</li>
                <li>Titan : messagerie email utilisée pour notifier l’équipe Printcom et vous répondre ;</li>
                <li>
                  services DNS / réseau du nom de domaine.{" "}
                  <Pending>le nom des services effectivement utilisés n’a pas encore été confirmé.</Pending>
                </li>
              </ul>
              <p>
                Lieux de stockage et de traitement, y compris d’éventuels transferts hors du Maroc :{" "}
                <Fact value={f.dataLocations} pending="ces lieux n’ont pas encore été confirmés pour Vercel, Neon et Titan." />
              </p>
            </Section>

            <Section id="conservation" title="5. Conservation et suppression">
              <p>
                Durée de conservation :{" "}
                <Fact value={f.retention} pending="Printcom n’a pas encore fixé de durée de conservation précise. Elle sera indiquée ici dès qu’elle sera arrêtée." />
              </p>
              <p>
                En attendant, vous pouvez demander la suppression de votre demande à tout moment (voir
                section 6).
              </p>
            </Section>

            <Section id="droits" title="6. Vos droits : accès, rectification, suppression">
              <p>
                Vous pouvez demander l’accès aux données vous concernant, leur rectification ou leur
                suppression, et retirer votre consentement, en écrivant à {mail} en indiquant le nom
                et l’email utilisés dans le formulaire. Printcom peut vous demander de justifier votre
                identité.
              </p>
              <p>
                Printcom répond à ces demandes dans un délai de{" "}
                <Fact value={f.requestDeadline} pending="délai de réponse" />.
              </p>
              <p>
                Autorité de protection des données (CNDP) :{" "}
                <Fact value={f.authorityStatus} pending="Printcom n’a pas encore confirmé le statut de ses formalités auprès de la CNDP (déclaration ou autorisation) ni les voies de réclamation applicables." />
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
