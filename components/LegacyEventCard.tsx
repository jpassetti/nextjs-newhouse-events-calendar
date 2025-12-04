// Legacy-compatible event card for digital signage. Replace values as needed.
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import type { SUEvent } from '../types/SUEvent';
import { getDisplayTitle, truncate, formatDate, parseHtmlDescription, parseHtmlToReact } from '../lib/eventUtils';
import { getFormattedLocation } from '../lib/locationLookup';
import Icon from './Icon';

export interface LegacyEventCardProps {
  event: SUEvent;
  orientation?: 'portrait' | 'landscape';
}

export const LegacyEventCard: React.FC<LegacyEventCardProps> = ({ event, orientation = 'portrait' }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Fallbacks for missing data
  const imageUrl = event.photo_url || null;
  const title = getDisplayTitle(event.title);
  const dateStr = event?.event_instances?.[0]?.event_instance?.start || event?.first_date || '';
  const date = formatDate(dateStr);
  
  // Generate event URL with date in YYYY-MM-DD format and urlname
  const eventDate = dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
  const eventUrl = `https://newhouse.syracuse.edu/event/${eventDate}/${event.urlname}`;
  
  // Only truncate on portrait; show full description on landscape
  const rawDescription = event.description_text || event.description || '';
  const isTruncated = true; // Always truncate
  
  // Always truncate and parse to plain text
  const description = truncate(parseHtmlDescription(rawDescription));
  
  const formatted = event.room_number ? getFormattedLocation(event.room_number) : (event.location_name || '');

  // Generate QR code when component mounts or eventUrl changes
  useEffect(() => {
    if (qrCanvasRef.current && eventUrl) {
      QRCode.toCanvas(qrCanvasRef.current, eventUrl, {
        width: 150,
        margin: 1,
        color: {
          dark: '#000E54',
          light: '#FFFFFF'
        }
      }).catch(err => {
        console.error('QR Code generation failed:', err);
      });
    }
  }, [eventUrl]);

  return (
    <div className="event-card">
      <div className="event-image-container">
        <div className="event-image">
          <div className="event-image-inner">
            {imageUrl && <img src={imageUrl} alt={title} width="300" height="200" />}
          </div>
        </div>
        <canvas ref={qrCanvasRef} className="event-qr-code" />
      </div>
      <div className="event-details">
        <div className="event-details-inner">
          <h2 className={`event-title ${orientation === 'landscape' ? 'event-title--medium' : ''}`}>{title}</h2>
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
          {isTruncated && (
            <p className="event-qr-message">Scan QR code to view all event information.</p>
          )}
        </div>
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
};
