// /components/EventSlide.tsx

import React from 'react';
import { EventItem } from '../types/EventItem';
import Logo from './Logo';
import Icon from './Icon';
import { getFormattedLocation } from '../lib/locationLookup';

interface EventSlideProps {
  event: any;
  orientation: 'portrait' | 'landscape';
}

function formatDate(event: any) {
  // Prefer event_instances[0].event_instance.start, fallback to first_date
  const dateStr = event?.event_instances?.[0]?.event_instance?.start || event?.first_date;
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const apMonths = [
    'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
  ];
  const weekday = date.toLocaleString('en-US', { weekday: 'long', timeZone: 'America/New_York' });
  const monthIdx = date.getMonth();
  const month = apMonths[monthIdx];
  const day = date.getDate();
  let hour = date.getHours();
  const minute = date.getMinutes();
  const isAM = hour < 12;
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const minStr = minute.toString().padStart(2, '0');
  const ampm = isAM ? 'a.m.' : 'p.m.';
  return `${weekday}, ${month} ${day}, ${hour12}:${minStr} ${ampm}`;
}

function getDisplayTitle(title: string) {
  if (!title) return '';
  if (title.startsWith('Newhouse School | ')) {
    return title.split(' | ').slice(1).join(' | ');
  }
  if (title.startsWith('Newhouse | ')) {
    return title.split(' | ').slice(1).join(' | ');
  }
  return title;
}

function truncate(text: string, max = 300) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export const EventSlide: React.FC<EventSlideProps> = ({ event, orientation }) => {
//  console.log('EventSlide event data:', event);
  // Fallback image or color block
  const imageUrl = event.photo_url || event.imageUrl || event.image_url || '';
  const image = (
    <div
      className={`flex items-center justify-center w-full ${orientation === 'portrait' ? 'h-[50svh]' : 'h-full'} bg-[#000e54] rounded-lg`}
      style={{ position: 'relative' }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={getDisplayTitle(event.title)}
          className="object-contain max-h-[90%] max-w-[90%] drop-shadow-lg rounded-md"
          style={{ display: 'block', margin: '0 auto' }}
        />
      ) : (
        <span className="text-3xl text-gray-400">No Image</span>
      )}
    </div>
  );

  return (
    <div className={`flex ${orientation === 'portrait' ? 'flex-col' : 'flex-row'} w-full h-full gap-6`}>
      <div className={orientation === 'portrait' ? '' : 'w-1/2 h-full'}>{image}</div>
      <div className={`relative flex flex-col justify-center ${orientation === 'portrait' ? '' : 'w-1/2'} p-[3vmin]`}>
        <h2 className="text-[clamp(1.5rem,4vw,3rem)] leading-tight mb-[2.5vmin] text-[#000e54]">{getDisplayTitle(event.title)}</h2>
        <h3 className="flex items-center gap-3 text-[clamp(1rem,2vw,1.3rem)] opacity-80 mb-[2.5vmin] font-bold min-h-[2.5em] text-[#000e54]">
          <Icon name="calendar" size="1.5em" />
          <span className="flex items-center">{formatDate(event)}</span>
        </h3>
        {(() => {
          const formatted = event.room_number ? getFormattedLocation(event.room_number) : (event.location_name || '');
          if (!formatted) return null;
          return (
            <div className="flex items-start text-[clamp(1rem,2vw,1.3rem)] opacity-70 mb-[2.5vmin] font-normal text-[#000e54]">
              <Icon name="location" size="1.5em" className="mr-2 mt-1" />
              {event.room_number ? (
                <span dangerouslySetInnerHTML={{ __html: formatted }} />
              ) : (
                <span>{formatted}</span>
              )}
            </div>
          );
        })()}
        {(event.description_text || event.description) && (
          <div className="text-[clamp(1rem,2vw,1.2rem)] opacity-90 max-w-prose mb-0 text-[#000e54]">
            {truncate(event.description_text || event.description)}
          </div>
        )}
        {/* Gradient overlay for overflow content */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '20%',
            pointerEvents: 'none',
            zIndex: 20,
            background: 'linear-gradient(rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
          }}
        />
      </div>
    </div>
  );
};
