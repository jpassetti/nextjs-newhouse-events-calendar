

export interface LocationInfo {
  room: string | null;
}


// A lookup map for common rooms and their official names/buildings
export interface RoomLookupEntry {
  room_number: string | number;
  room_name: string;
  room_building: string;
}

const ROOM_LOOKUP: RoomLookupEntry[] = [
  {
    room_number: 140,
    room_name: 'Joyce Hergenhan Auditorium',
    room_building: 'Newhouse 3',
  },
  {
    room_number: 251,
    room_name: 'Costas Corner',
    room_building: 'Newhouse 3',
  },
  {
    room_number: 252,
    room_name: 'Kramer War Room',
    room_building: 'Newhouse 3',
  },
  {
    room_number: 253,
    room_name: 'Sports Media Center',
    room_building: 'Newhouse 3',
  },
  {
    room_number: 316,
    room_name: 'Undergraduate Advising and Records Office',
    room_building: '315/316 Newhouse 3',
  },
  {
    room_number: 318,
    room_name: 'Horvitz Academic Programs Suite',
    room_building: '318 Newhouse 3',
  },
  {
    room_number: '',
    room_name: 'Goldstein Auditorium',
    room_building: 'Schine Student Center',
  },
];

/**
 * Accepts a room_number string (e.g. "food.com, Room 244"), parses the number, and looks up official info.
 * If no match, returns the original room_number as-is.
 */
export function getFormattedLocation(room: string | null): string {
  if (!room || room === 'None' || room === '') return '';

  // Try to extract a number from room (e.g. "food.com, Room 244" -> 244)
  let lookupRoom: number | null = null;
  const match = room.match(/(\d{3,})/); // match 3+ digit room numbers
  if (match) {
    lookupRoom = parseInt(match[1], 10);
  } else if (/^\d+$/.test(room)) {
    lookupRoom = parseInt(room, 10);
  }

  if (lookupRoom !== null) {
    const entry = ROOM_LOOKUP.find(e => e.room_number === lookupRoom);
    if (entry) {
      return `${entry.room_name}${entry.room_building ? `<br />${entry.room_number} ${entry.room_building}` : ''}`;
    }
  }

  // fallback: display room_number as-is
  return room;
}
