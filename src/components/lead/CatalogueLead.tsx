"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  LIMITS,
  validateLead,
  type LeadErrors,
  type LeadField,
} from "@/lib/leads/schema";
import { ACTION_SECONDARY } from "@/components/site/actions";

type Values = {
  name: string;
  email: string;
  phone: string;
  company: string;
  project: string;
  consent: boolean;
  website: string; // honeypot
};
type Phase = "idle" | "submitting" | "success" | "error";

const EMPTY: Values = {
  name: "",
  email: "",
  phone: "",
  company: "",
  project: "",
  consent: false,
  website: "",
};
const FIELD_ORDER: LeadField[] = ["name", "email", "phone", "company", "project", "consent"];

const MSG = {
  unavailable:
    "Le service est momentanément indisponible. Votre demande n’a pas été enregistrée. Vous pouvez nous écrire à contact@printcom.ma.",
  rateLimited: "Trop de tentatives. Merci de réessayer dans quelques minutes.",
  network:
    "Impossible de joindre le service. Vérifiez votre connexion : votre demande n’a pas été enregistrée.",
} as const;

const inputCls =
  "w-full min-w-0 rounded-[10px] border border-[#c8d4e5] bg-[#fafcff] px-3 py-[11px] text-pf-0 font-normal text-[#152647] placeholder:text-[#7a8aa3] focus-visible:border-[#1558db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1558db] aria-[invalid=true]:border-[#c0261f]";
const labelCls = "flex flex-col gap-[5px] text-pf-sm font-semibold text-[#17386d]";
const errCls = "text-pf-sm font-medium text-[#b3261e]";

export function CatalogueLead({ privacyHref }: { privacyHref?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<string>("");
  const inFlight = useRef(false);
  const uid = useId();

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [formError, setFormError] = useState("");
  const [outcome, setOutcome] = useState<"created" | "duplicate">("created");

  const id = (f: string) => `${uid}-${f}`;

  function open() {
    if (phase === "success") {
      setValues(EMPTY);
      setErrors({});
    }
    if (phase === "success" || !keyRef.current) keyRef.current = crypto.randomUUID();
    setPhase((p) => (p === "success" ? "idle" : p === "submitting" ? p : "idle"));
    setFormError("");
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.showModal();
    // Start on the first field (the browser would pick the close button).
    document.getElementById(id("name"))?.focus();
  }

  function close() {
    dialogRef.current?.close();
  }

  // Runs for close button, Escape and backdrop click alike.
  function onClosed() {
    document.documentElement.style.overflow = "";
  }

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);
  useEffect(() => {
    if (phase === "success") resultRef.current?.focus();
  }, [phase]);

  function set<K extends keyof Values>(key: K, v: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function focusFirst(errs: LeadErrors) {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) document.getElementById(id(first))?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current) return; // duplicate-submit guard
    setFormError("");

    const check = validateLead({ ...values, submissionKey: keyRef.current });
    if (!check.ok && Object.keys(check.errors).length > 0) {
      setErrors(check.errors);
      focusFirst(check.errors);
      return;
    }
    setErrors({});

    inFlight.current = true;
    setPhase("submitting");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch("/api/catalogue-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, submissionKey: keyRef.current }),
        signal: ctrl.signal,
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        status?: "created" | "duplicate";
        error?: string;
        errors?: LeadErrors;
      };
      if (res.ok && data.ok) {
        setOutcome(data.status === "duplicate" ? "duplicate" : "created");
        setPhase("success");
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setPhase("idle");
        focusFirst(data.errors);
      } else {
        setFormError(res.status === 429 ? MSG.rateLimited : MSG.unavailable);
        setPhase("error");
      }
    } catch {
      setFormError(MSG.network);
      setPhase("error");
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
    }
  }

  const busy = phase === "submitting";
  const fieldProps = (f: LeadField) => ({
    id: id(f),
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? id(`${f}-error`) : undefined,
  });
  const fieldError = (f: LeadField) =>
    errors[f] ? (
      <span id={id(`${f}-error`)} className={errCls}>
        {errors[f]}
      </span>
    ) : null;

  return (
    <>
      <button
        type="button"
        className={ACTION_SECONDARY}
        aria-haspopup="dialog"
        onClick={open}
      >
        Demander notre catalogue
        <span aria-hidden="true">→</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={id("title")}
        aria-describedby={id("intro")}
        onClose={onClosed}
        onClick={(e) => e.target === e.currentTarget && !busy && close()}
        className="m-auto max-h-[min(90dvh,800px)] outline-none w-full max-w-[min(95vw,495px)] overflow-auto rounded-[22px] border border-[#dbe3f3] bg-white p-0 text-left text-[#102655] shadow-[0_30px_110px_#00155f88] [text-shadow:none] backdrop:bg-[#000c41]/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-[clamp(20px,4vw,32px)]">
          <button
            type="button"
            onClick={close}
            aria-label="Fermer le formulaire"
            className="absolute right-[15px] top-3.5 grid size-[33px] cursor-pointer place-items-center rounded-full bg-[#edf2fa] text-[22px] leading-none text-[#153876] hover:bg-[#dfe8f6] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1558db]"
          >
            <span aria-hidden="true">×</span>
          </button>

          <h2 id={id("title")} className="mb-2.5 pr-10 text-pf-2 font-semibold leading-[1.2] text-[#11265c]">
            Demandez notre catalogue
          </h2>
          <p id={id("intro")} className="mb-[19px] text-pf-0 leading-normal text-[#576781]">
            Laissez-nous vos coordonnées : notre équipe reviendra vers vous par email pour vous
            transmettre le catalogue.
          </p>

          {phase === "success" ? (
            <div
              ref={resultRef}
              tabIndex={-1}
              role="status"
              className="rounded-[10px] border border-[#95d0ac] bg-[#effcf3] p-4 text-pf-0 leading-normal text-[#155931] outline-none"
            >
              <p>
                {outcome === "duplicate"
                  ? "Votre demande a déjà été enregistrée. "
                  : "Votre demande a bien été enregistrée. "}
                Notre équipe reviendra vers vous par email pour vous transmettre le catalogue.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-4 cursor-pointer rounded-full bg-[#1246c3] px-6 py-3 text-pf-0 font-semibold text-white hover:bg-[#0a379e] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1558db]"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-[13px] min-[481px]:grid-cols-2">
              <div className={labelCls}>
                <label htmlFor={id("name")}>Nom complet *</label>
                <input {...fieldProps("name")} className={inputCls} name="name" autoComplete="name" required maxLength={LIMITS.name.max} placeholder="Votre nom" value={values.name} onChange={(e) => set("name", e.target.value)} />
                {fieldError("name")}
              </div>
              <div className={labelCls}>
                <label htmlFor={id("email")}>Email professionnel *</label>
                <input {...fieldProps("email")} className={inputCls} name="email" type="email" autoComplete="email" required maxLength={LIMITS.email.max} placeholder="vous@entreprise.ma" value={values.email} onChange={(e) => set("email", e.target.value)} />
                {fieldError("email")}
              </div>
              <div className={labelCls}>
                <label htmlFor={id("phone")}>Téléphone</label>
                <input {...fieldProps("phone")} className={inputCls} name="phone" type="tel" autoComplete="tel" maxLength={LIMITS.phone.max} placeholder="+212 …" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
                {fieldError("phone")}
              </div>
              <div className={labelCls}>
                <label htmlFor={id("company")}>Entreprise</label>
                <input {...fieldProps("company")} className={inputCls} name="company" autoComplete="organization" maxLength={LIMITS.company.max} placeholder="Votre entreprise" value={values.company} onChange={(e) => set("company", e.target.value)} />
                {fieldError("company")}
              </div>
              <div className={`${labelCls} min-[481px]:col-span-2`}>
                <label htmlFor={id("project")}>Votre projet *</label>
                <textarea {...fieldProps("project")} className={`${inputCls} min-h-[85px] resize-y`} name="project" required maxLength={LIMITS.project.max} placeholder="Ex. Packaging, cartes de visite, brochures…" value={values.project} onChange={(e) => set("project", e.target.value)} />
                {fieldError("project")}
              </div>

              {/* Honeypot: invisible to people and assistive tech, bots fill it. */}
              <div aria-hidden="true" className="absolute -left-[9999px] size-0 overflow-hidden">
                <label>
                  Ne pas remplir
                  <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={(e) => set("website", e.target.value)} />
                </label>
              </div>

              <div className="flex flex-col gap-1 min-[481px]:col-span-2">
                <div className="flex items-start gap-[9px] text-pf-sm leading-[1.45] text-[#526483]">
                  <input
                    id={id("consent")}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={
                      errors.consent ? `${id("consent-help")} ${id("consent-error")}` : id("consent-help")
                    }
                    type="checkbox"
                    name="consent"
                    required
                    checked={values.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    className="mt-[3px] size-4 shrink-0 accent-[#0a45cd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1558db]"
                  />
                  <label htmlFor={id("consent")}>
                    J’accepte que Printcom utilise les informations saisies pour répondre à ma demande
                    de catalogue et me recontacter à ce sujet. *
                  </label>
                </div>
                <p id={id("consent-help")} className="pl-[25px] text-pf-sm leading-[1.45] text-[#526483]">
                  Cette case ne concerne que votre demande : elle ne vous inscrit à aucune
                  communication commerciale, et aucun email promotionnel ne vous sera envoyé sans
                  votre accord distinct.
                  {privacyHref ? (
                    <>
                      {" "}
                      <a
                        href={privacyHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#1246c3] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1558db]"
                      >
                        Lire la politique de confidentialité
                        <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                      </a>
                      .
                    </>
                  ) : null}
                </p>
                <div className="pl-[25px]">{fieldError("consent")}</div>
              </div>

              <div aria-live="polite" className="min-[481px]:col-span-2">
                {formError ? (
                  <p role="alert" className="rounded-[10px] border border-[#e5a5a0] bg-[#fdf0ef] p-3 text-pf-sm leading-normal text-[#8a1f19]">
                    {formError}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={busy}
                aria-busy={busy}
                className="cursor-pointer rounded-full bg-[#1246c3] px-6 py-3.5 text-pf-0 font-semibold text-white hover:bg-[#0a379e] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1558db] disabled:cursor-progress disabled:opacity-70 min-[481px]:col-span-2"
              >
                {busy ? "Envoi en cours…" : "Envoyer ma demande"}
              </button>
              <p className="text-center text-pf-sm leading-normal text-[#66758a] min-[481px]:col-span-2">
                Vos données ne servent qu’à traiter cette demande.
              </p>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
