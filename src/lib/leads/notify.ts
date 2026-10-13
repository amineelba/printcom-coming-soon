// Email notification for a NEW catalogue lead (Titan SMTP via Nodemailer).
// Server only: imported solely by the API route. Never imports lead data into logs.

import nodemailer from "nodemailer";
import type { LeadInput } from "./schema";

export type NotifyResult = "sent" | "skipped" | "failed";

export type MailMessage = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};
export type MailTransport = { sendMail(message: MailMessage): Promise<unknown> };

type Env = Record<string, string | undefined>;
type MailConfig = { user: string; password: string; to: string };

export type NotifyDeps = {
  env?: Env;
  createTransport?: (config: MailConfig) => MailTransport;
  timeoutMs?: number;
};

const SMTP_HOST = "smtp.titan.email";
const SMTP_PORT = 465; // implicit TLS (SSL)
const DEFAULT_TIMEOUT_MS = 12_000;

function readConfig(env: Env): MailConfig | null {
  const user = env.LEAD_SMTP_USER?.trim();
  const password = env.LEAD_SMTP_PASSWORD;
  const to = env.LEAD_NOTIFY_TO?.trim();
  return user && password && to ? { user, password, to } : null;
}

function defaultTransport({ user, password }: MailConfig): MailTransport {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user, pass: password },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
  });
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function buildMessage(lead: LeadInput, config: MailConfig): MailMessage {
  const rows: [string, string][] = [
    ["Nom", lead.name],
    ["Email", lead.email],
    ["Téléphone", lead.phone || "—"],
    ["Entreprise", lead.company || "—"],
    ["Projet", lead.project],
  ];
  const text =
    "Nouvelle demande de catalogue (site en construction)\n\n" +
    rows.map(([k, v]) => `${k} : ${v}`).join("\n") +
    "\n\nRépondez à cet email pour écrire directement au prospect.\n" +
    "Aucun catalogue n'a été envoyé automatiquement.\n";
  const html =
    "<p><strong>Nouvelle demande de catalogue</strong> (site en construction)</p><table>" +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:2px 12px 2px 0;vertical-align:top"><strong>${k}</strong></td>` +
          `<td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    "</table><p>Répondez à cet email pour écrire directement au prospect.<br>" +
    "Aucun catalogue n'a été envoyé automatiquement.</p>";

  return {
    from: `Printcom <${config.user}>`, // Titan only accepts the authenticated mailbox
    to: config.to,
    replyTo: lead.email,
    subject: `Nouvelle demande de catalogue — ${oneLine(lead.name)}`,
    text,
    html,
  };
}

/**
 * Sends the notification and waits for the SMTP result. Never throws and never
 * logs personal data or secrets: a failure only logs an error code.
 */
export async function notifyNewLead(
  lead: LeadInput,
  deps: NotifyDeps = {},
): Promise<NotifyResult> {
  const config = readConfig(deps.env ?? process.env);
  if (!config) {
    console.error("catalogue-leads: notification skipped (mail settings missing)");
    return "skipped";
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const transport = (deps.createTransport ?? defaultTransport)(config);
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(Object.assign(new Error("timeout"), { code: "ETIMEDOUT" })),
        deps.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      );
    });
    await Promise.race([transport.sendMail(buildMessage(lead, config)), timeout]);
    return "sent";
  } catch (err) {
    // Error code only: SMTP error messages can echo addresses.
    const code =
      err && typeof err === "object" && "code" in err && typeof err.code === "string"
        ? err.code
        : err instanceof Error
          ? err.name
          : "unknown";
    console.error("catalogue-leads: notification failed", code);
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}
