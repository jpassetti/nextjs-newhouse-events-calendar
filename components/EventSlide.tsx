// /components/EventSlide.tsx

import React from 'react';

import type { SUEvent } from '../types/SUEvent';
import Icon from './Icon';
import { getFormattedLocation } from '../lib/locationLookup';
import { getDisplayTitle, truncate, formatDate as formatDateStr } from '../lib/eventUtils';
import Image from 'next/image';

interface EventSlideProps {
  event: SUEvent;
  orientation: 'portrait' | 'landscape';
}




// formatting helpers moved to lib/eventUtils.ts


export const EventSlide: React.FC<EventSlideProps> = ({ event, orientation }) => {
  // Fallback image or color block
  const imageUrl = event.photo_url || '';
  // Track window size for display
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  React.useEffect(() => {
    function updateDimensions() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const image = (
    <div
      className={`flex items-center justify-center w-full ${orientation === 'portrait' ? 'h-[50svh]' : 'h-full'} bg-[#000e54] rounded-lg`}
      style={{ position: 'relative' }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={getDisplayTitle(event.title)}
          className="object-contain max-h-[90%] max-w-[90%] drop-shadow-lg rounded-md"
          style={{ display: 'block', margin: '0 auto' }}
          width={500}
          height={500}
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
        {/* Screen dimensions in top right */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 12,
            fontSize: 16,
            color: '#888',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          {dimensions.width}x{dimensions.height}px
        </div>
        <h2 className="text-[clamp(1.5rem,4vw,3rem)] leading-tight mb-[2.5vmin] text-[#000e54]">{getDisplayTitle(event.title)}</h2>
        <h3 className="flex items-center gap-3 text-[clamp(1rem,2vw,1.3rem)] opacity-80 mb-[2.5vmin] font-bold min-h-[2.5em] text-[#000e54]">
          <Icon name="calendar" size="1.5em" />
          <span className="flex items-center">{formatDateStr(event?.event_instances?.[0]?.event_instance?.start || event?.first_date || '')}</span>
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
            {event.description_text || event.description || ''}
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
