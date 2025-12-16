// /components/EventsRotator.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { toDataURL } from 'qrcode';
import type { SUEvent } from '../types/SUEvent';
import { LegacyEventCard } from './LegacyEventCard';

const DISPLAY_MS = 10_000;

export const EventsRotator: React.FC = () => {
  const [events, setEvents] = useState<SUEvent[] | null>(null);
  const [index, setIndex] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'landscape';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [noEventsQr, setNoEventsQr] = useState<string>('');

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

  // Rotation logic: only run when in portrait mode. In landscape we'll show three static cards.
  useEffect(() => {
    if (!events || events.length === 0) return;
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (orientation === 'portrait') {
      // Start rotating in portrait
      intervalRef.current = setInterval(() => {
        setIndex(i => (i + 1) % events.length);
      }, DISPLAY_MS);
    } else {
      // Ensure index is 0 so landscape shows the first three consistently
      setIndex(0);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [events, orientation]);

  // Orientation listener
  useEffect(() => {
    function handleResize() {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate QR for no-events screen (client-side)
  useEffect(() => {
    let mounted = true;
    async function gen() {
      try {
        const dataUrl = await toDataURL('https://newhouse.syracuse.edu', { width: 300 });
        if (mounted) setNoEventsQr(dataUrl);
      } catch (e) {
        // ignore - we'll fall back to empty
      }
    }
    gen();
    return () => {
      mounted = false;
    };
  }, []);

  if (!events) return <div style={{ textAlign: 'center', padding: 40, fontSize: 24 }}>Loading…</div>;
  if (events.length === 0)
    return (
      <div className="no-events-screen">
        <div className="no-events-inner">
          <h2 className="no-events-title">No upcoming events</h2>
          <p className="no-events-text">Check back soon or visit <em>newhouse.syracuse.edu</em>.</p>
          <div className="event-qr-code no-events-qr">
            {noEventsQr ? (
              <img src={noEventsQr} alt="QR code to Newhouse website" />
            ) : (
              <div style={{ width: 160, height: 160, margin: '0 auto' }} />
            )}
          </div>
        </div>
      </div>
    );

  // Determine number of cards to show on landscape
  const cardsToShow = orientation === 'portrait' ? 1 : Math.min(events.length, 3);
  const landscapeClass = orientation === 'landscape' ? `landscape-cards-${cardsToShow}` : '';

  return (
    <div>
      {error && (
        <div style={{ background: '#ffeeba', color: '#856404', padding: 10, borderRadius: 4, margin: '10px auto', maxWidth: 600, textAlign: 'center' }}>{error}</div>
      )}
      {orientation === 'portrait' ? (
        <LegacyEventCard event={events[index]} orientation={orientation} />
      ) : (
        <div className="landscape-layout">
          <div className="landscape-banner">
            <img src="/upcoming-events.svg" alt="Upcoming events" />
          </div>
          <div className={`landscape-rotator ${landscapeClass}`}>
            {Array.from({ length: cardsToShow }).map((_, i) => (
              <div key={i} className="landscape-card-wrapper">
                <LegacyEventCard event={events[i]} orientation={orientation} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
