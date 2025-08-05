// /app/api/events/route.ts
import { NextResponse } from 'next/server';
import type { SUEvent, SUEventWrapper, SUEventsResponse } from '../../../types/SUEvent';

const EVENTS_API_URL = process.env.EVENTS_API_URL;

export async function GET() {
  if (!EVENTS_API_URL) {
    return NextResponse.json({ error: 'Missing EVENTS_API_URL' }, { status: 500 });
  }
  try {
  const res = await fetch(EVENTS_API_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Upstream error');
    const raw = await res.json();
  // raw is SUEventsResponse
  const suEventsResponse = raw as SUEventsResponse;
  let events: SUEvent[] = (suEventsResponse.events || []).map((e: SUEventWrapper) => e.event);
    // Helper to get event start date string
    function getEventStart(ev: SUEvent): string {
      return (
        ev.event_instances?.[0]?.event_instance?.start ||
        ev.first_date ||
        ''
      );
    }
    const now = new Date();
    events = events.filter(e => {
      const start = getEventStart(e);
      return start && new Date(start) > now;
    });
    events.sort((a, b) => {
      const aStart = new Date(getEventStart(a)).getTime();
      const bStart = new Date(getEventStart(b)).getTime();
      return aStart - bStart;
    });
    events = events.slice(0, 6);
    return NextResponse.json(events);
  } catch (e: unknown) {
    let message = 'Failed to fetch events';
    if (
      typeof e === 'object' &&
      e !== null &&
      'message' in e &&
      typeof (e as Record<string, unknown>).message === 'string'
    ) {
      message = (e as { message: string }).message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
