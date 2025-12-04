import type { SUEvent } from '../types/SUEvent';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isEventWrapper(obj: unknown): obj is { event?: unknown } {
  return isRecord(obj) && 'event' in obj;
}

function looksLikeSUEvent(obj: unknown): obj is SUEvent {
  if (!isRecord(obj)) return false;
  return (typeof (obj as any).id === 'number' || typeof (obj as any).id === 'string') && typeof (obj as any).title === 'string';
}

export function normalizeEvents(raw: unknown): SUEvent[] {
  // Handle shapes: { events: [...] } or { data: { events: [...] } }
  let candidate: unknown[] = [];
  if (isRecord(raw)) {
    if (Array.isArray((raw as any).events)) candidate = (raw as any).events;
    else if (isRecord((raw as any).data) && Array.isArray(((raw as any).data as any).events)) candidate = ((raw as any).data as any).events;
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
