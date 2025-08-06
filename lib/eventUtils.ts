// /lib/eventUtils.ts
// Utility functions for event display formatting (shared by EventSlide and LegacyEventCard)

export function getDisplayTitle(title: string): string {
  if (!title) return '';
  if (title.startsWith('Newhouse School | ')) {
    return title.split(' | ').slice(1).join(' | ');
  }
  if (title.startsWith('Newhouse | ')) {
    return title.split(' | ').slice(1).join(' | ');
  }
  return title;
}

export function truncate(text: string, max = 300): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const apMonths = [
    'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
  ];
  const weekday = date.toLocaleString('en-US', { weekday: 'long', timeZone: 'America/New_York' });
  const monthIdx = date.getMonth();
  const month = apMonths[monthIdx];
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const isAM = hour < 12;
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const minStr = minute.toString().padStart(2, '0');
  const ampm = isAM ? 'a.m.' : 'p.m.';
  return `${weekday}, ${month} ${day}, ${hour12}:${minStr} ${ampm}`;
}
