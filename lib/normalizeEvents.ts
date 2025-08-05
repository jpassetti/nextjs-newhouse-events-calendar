// /lib/normalizeEvents.ts

/**
 * Normalize SU Localist API event data to preserve the full event structure.
 * Flattens .event nesting if present, but does not remap or filter fields.
 */
export function normalizeEvents(raw: any): any[] {
  const events = (raw?.data?.events || raw?.events || []).map((e: any) => e.event || e);
  return events;
}
