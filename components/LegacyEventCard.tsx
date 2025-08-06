// Legacy-compatible event card for digital signage. Replace values as needed.
import React from 'react';
import type { SUEvent } from '../types/SUEvent';
import { getDisplayTitle, truncate, formatDate } from '../lib/eventUtils';
import { getFormattedLocation } from '../lib/locationLookup';
import Icon from './Icon';

export interface LegacyEventCardProps {
  event: SUEvent;
}

export const LegacyEventCard: React.FC<LegacyEventCardProps> = ({ event }) => {
  // Fallbacks for missing data
  const imageUrl = event.photo_url || 'https://via.placeholder.com/300x200';
  const title = getDisplayTitle(event.title);
  const dateStr = event?.event_instances?.[0]?.event_instance?.start || event?.first_date || '';
  const date = formatDate(dateStr);
  // Removed unused 'location' variable
  const description = truncate(event.description_text || event.description || '');
 const formatted = event.room_number ? getFormattedLocation(event.room_number) : (event.location_name || '');

  return (
    <div className="event-card">
      <div className="event-image">
        <div className="event-image-inner">
          <img src={imageUrl} alt={title} width="300" height="200" />
        </div>
      </div>
      <div className="event-details">
        <div className="event-details-inner">
          <h2 className="event-title">{title}</h2>
          <div className="event-date-location-wrapper">
          <div className="event-date">
            <span className="event-icon-box"><Icon name="calendar" size={32} /></span>
            <span className="event-date-text">{date}</span>
          </div>
          {event.room_number && (
            <div className="event-location">
              <span className="event-icon-box"><Icon name="location" size={32} /></span>
              <span className="event-location-text">
                {event.room_number && <span dangerouslySetInnerHTML={{ __html: formatted }} />}
              </span>
            </div>
          )}
          </div>
          {description && (
            <div className="event-description">
              {description}
            </div>
          )}
        </div>
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
};
