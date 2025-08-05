// /app/api/events/route.ts
import { NextResponse } from 'next/server';
import { normalizeEvents } from '../../../lib/normalizeEvents';
import { EventItem } from '../../../types/EventItem';

const EVENTS_API_URL = process.env.EVENTS_API_URL;

export async function GET() {
  if (!EVENTS_API_URL) {
    return NextResponse.json({ error: 'Missing EVENTS_API_URL' }, { status: 500 });
  }
  try {
  const res = await fetch(EVENTS_API_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Upstream error');
    const raw = await res.json();
    let events: any[] = normalizeEvents(raw);
    // Helper to get event start date string
    function getEventStart(ev: any): string {
      // Try event_instances[0].event_instance.start, then first_date, then start
      return (
        ev.event_instances?.[0]?.event_instance?.start ||
        ev.first_date ||
        ev.start ||
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
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch events' }, { status: 500 });
  }
}
