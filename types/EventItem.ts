// /types/EventItem.ts
export type EventItem = {
  id: string;
  title: string;
  startsAt: string;   // ISO
  endsAt?: string;    // ISO
  location?: string;
  imageUrl?: string;  // hero or representative image if available
  url?: string;       // details page
  room_number?: string;
  location_name?: string;
};
