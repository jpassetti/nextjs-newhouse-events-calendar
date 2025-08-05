import type { EventItem } from '../types/EventItem';
// /lib/normalizeEvents.ts

/**
 * Normalize SU Localist API event data to preserve the full event structure.
 * Flattens .event nesting if present, but does not remap or filter fields.
 */
export function normalizeEvents(raw: unknown): EventItem[] {
  let eventsArr: unknown[] = [];
  if (
    typeof raw === 'object' && raw !== null &&
    'data' in raw &&
    typeof (raw as { data?: unknown }).data === 'object' &&
    (raw as { data?: unknown }).data !== null &&
    'events' in (raw as { data: { events?: unknown } }).data!
  ) {
    eventsArr = ((raw as { data: { events: unknown[] } }).data.events);
  } else if (
    typeof raw === 'object' && raw !== null &&
    'events' in raw
  ) {
    eventsArr = ((raw as { events: unknown[] }).events);
  }
  const events = eventsArr.map((e: unknown) => {
    if (typeof e === 'object' && e !== null && 'event' in e) {
      return (e as { event: unknown }).event;
    }
    return e;
  });
  return events as EventItem[];
}
