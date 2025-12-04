import type { SUEvent } from '../types/SUEvent';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isEventWrapper(obj: unknown): obj is { event?: unknown } {
  return isRecord(obj) && 'event' in obj;
}

function looksLikeSUEvent(obj: unknown): obj is SUEvent {
  if (!isRecord(obj)) return false;
  return (typeof obj.id === 'number' || typeof obj.id === 'string') && typeof obj.title === 'string';
}

export function normalizeEvents(raw: unknown): SUEvent[] {
  // Handle shapes: { events: [...] } or { data: { events: [...] } }
  let candidate: unknown[] = [];
  if (isRecord(raw)) {
    if (Array.isArray(raw.events)) candidate = raw.events;
    else if (isRecord(raw.data) && Array.isArray(raw.data.events)) candidate = raw.data.events;
  }

  const events: SUEvent[] = [];
  for (const item of candidate) {
    if (isEventWrapper(item) && isRecord(item.event) && looksLikeSUEvent(item.event)) {
      events.push(item.event as SUEvent);
    } else if (looksLikeSUEvent(item)) {
      events.push(item as SUEvent);
    }
  }
  return events;
}
