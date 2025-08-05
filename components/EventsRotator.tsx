// /components/EventsRotator.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SUEvent } from '../types/SUEvent';
import { EventSlide } from './EventSlide';

const DISPLAY_MS = 10_000;

function getOrientation() {
  if (typeof window === 'undefined') return 'landscape';
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

export const EventsRotator: React.FC = () => {
  const [events, setEvents] = useState<SUEvent[] | null>(null);
  const [index, setIndex] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(getOrientation());
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

  // Orientation listener
  useEffect(() => {
    function handleResize() {
      setOrientation(getOrientation());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!events) return <div className="flex items-center justify-center h-full w-full text-2xl">Loading…</div>;
  if (events.length === 0) return <div className="flex items-center justify-center h-full w-full text-2xl">No upcoming events</div>;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {error && <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-200 text-yellow-900 px-4 py-2 rounded z-10">{error}</div>}
      <AnimatePresence mode="wait">
        <motion.div
          key={events[index]?.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <EventSlide event={events[index]} orientation={orientation} />
        </motion.div>
      </AnimatePresence>
      {/* Pager dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 bg-black px-4 py-2 rounded-full">
        {events.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${i === index ? 'bg-[#f76900]' : 'bg-gray-300'} transition-colors`}
          />
        ))}
      </div>
    </div>
  );
};
