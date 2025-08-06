// /components/EventsRotator.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import type { SUEvent } from '../types/SUEvent';
import { LegacyEventCard } from './LegacyEventCard';

const DISPLAY_MS = 10_000;

export const EventsRotator: React.FC = () => {
  const [events, setEvents] = useState<SUEvent[] | null>(null);
  const [index, setIndex] = useState(0);
  // Removed unused orientation state
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch events with localStorage fallback
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setEvents(data);
        setError(null);
        localStorage.setItem('events', JSON.stringify(data));
      } catch {
        setError('Could not fetch events. Showing cached data if available.');
        const cached = localStorage.getItem('events');
        if (cached) setEvents(JSON.parse(cached));
        else setEvents([]);
      }
    }
    fetchEvents();
  }, []);

  // Rotation logic
  useEffect(() => {
    if (!events || events.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % events.length);
    }, DISPLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [events]);

  // Removed orientation effect

  if (!events) return <div style={{ textAlign: 'center', padding: 40, fontSize: 24 }}>Loading…</div>;
  if (events.length === 0) return <div style={{ textAlign: 'center', padding: 40, fontSize: 24 }}>No upcoming events</div>;

  return (
    <div>
      {error && (
        <div style={{ background: '#ffeeba', color: '#856404', padding: 10, borderRadius: 4, margin: '10px auto', maxWidth: 600, textAlign: 'center' }}>{error}</div>
      )}
      {/* Show just one event at a time, rotating */}
      <LegacyEventCard event={events[index]} />
    </div>
  );
};
