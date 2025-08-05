// types/SUEvent.ts

export interface SUEventInstance {
  event_instance: {
    id: number;
    event_id: number;
    start: string;
    end: string;
    ranking: number;
    all_day: boolean;
    num_attending: number;
  };
}

export interface SUEventGeo {
  latitude: string | null;
  longitude: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
}

export interface SUEventDepartment {
  id: number;
  name: string;
}

export interface SUEventAudience {
  name: string;
  id: number;
}

export interface SUEventFilters {
  event_audience: SUEventAudience[];
}

export interface SUEventCustomFields {
  contact_name?: string;
  contact_email_address?: string;
  contact_phone_number?: string;
}

export interface SUEvent {
  id: number;
  title: string;
  url: string | null;
  updated_at: string;
  created_at: string;
  facebook_id: string | null;
  first_date: string;
  last_date: string;
  hashtag: string | null;
  urlname: string;
  user_id: number;
  directions: string | null;
  allows_reviews: boolean;
  allows_attendance: boolean;
  location: string | null;
  room_number: string | null;
  location_name: string | null;
  status: string;
  experience: string;
  stream_url: string | null;
  stream_info: string | null;
  stream_embed_code: string | null;
  created_by: number;
  updated_by: number;
  conference_event_id: number | null;
  kind: string;
  city_id: number | null;
  neighborhood_id: number | null;
  school_id: number | null;
  campus_id: number | null;
  recurring: boolean;
  free: boolean;
  private: boolean;
  verified: boolean;
  rejected: boolean;
  sponsored: boolean;
  venue_id: number | null;
  ticket_url: string | null;
  ticket_cost: string | null;
  has_register: boolean;
  keywords: string[];
  tags: string[];
  description_text: string | null;
  photo_id: number | null;
  detail_views: number;
  event_instances: SUEventInstance[];
  address: string | null;
  description: string | null;
  featured: boolean;
  geo: SUEventGeo;
  filters: SUEventFilters;
  custom_fields: SUEventCustomFields;
  localist_url: string;
  localist_ics_url: string;
  photo_url: string | null;
  venue_url: string | null;
  departments: SUEventDepartment[];
}

export interface SUEventWrapper {
  event: SUEvent;
}

export interface SUEventsResponse {
  events: SUEventWrapper[];
  page?: unknown;
  date?: unknown;
}
