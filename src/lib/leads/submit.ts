import { notifyNewLead, type NotifyResult } from "./notify";
import { insertLead, type InsertResult, type Sql } from "./repository";
import type { LeadInput } from "./schema";

export type SubmitResult = {
  status: InsertResult;
  /** "none" for duplicates: they are never notified. */
  notification: NotifyResult | "none";
};

/**
 * Persist first, notify second. The lead is already safe in the database when
 * the email is attempted, so an email problem never loses or hides a lead.
 * Only a freshly created row triggers a notification.
 */
export async function submitLead(
  sql: Sql,
  lead: LeadInput,
  notify: (lead: LeadInput) => Promise<NotifyResult> = notifyNewLead,
): Promise<SubmitResult> {
  const status = await insertLead(sql, lead);
  if (status !== "created") return { status, notification: "none" };
  return { status, notification: await notify(lead) };
}
