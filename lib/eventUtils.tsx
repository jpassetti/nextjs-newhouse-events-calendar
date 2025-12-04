import React from 'react';
import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from 'html-react-parser';
import {
  Paragraph,
  Heading,
  Link,
  UnorderedList,
  OrderedList,
  ListItem,
  Span,
  Strong,
  Emphasis,
  Break,
} from '@/components/Html';

// Parse HTML description to plain text (strips all tags)
export function parseHtmlDescription(html: string): string {
  if (typeof html !== 'string' || !html.trim()) return '';
  
  // Remove HTML tags and decode entities
  return html
    .replace(/<[^>]*>/g, ' ')  // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')    // Replace non-breaking spaces
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')       // Collapse multiple whitespace
    .trim();
}

// Parse HTML description to React elements
// Preserves structure with p, ul, li, span, h1-h6, a, br, strong, em, etc.
export function parseHtmlToReact(html: string): React.ReactNode {
  if (typeof html !== 'string' || !html.trim()) return null;
  
  try {
    const options: HTMLReactParserOptions = {
      replace: (domNode) => {
        if (!(domNode instanceof Element)) return;

        const { name, attribs, children } = domNode;

        // Handle headings h1-h6
        if (name === 'h1') {
          return <Heading level={1}>{domToReact(children as DOMNode[], options)}</Heading>;
        }
        if (name === 'h2') {
          return <Heading level={2}>{domToReact(children as DOMNode[], options)}</Heading>;
        }
        if (name === 'h3') {
          return <Heading level={3}>{domToReact(children as DOMNode[], options)}</Heading>;
        }
        if (name === 'h4') {
          return <Heading level={4}>{domToReact(children as DOMNode[], options)}</Heading>;
        }
        if (name === 'h5') {
          return <Heading level={5}>{domToReact(children as DOMNode[], options)}</Heading>;
        }
        if (name === 'h6') {
          return <Heading level={6}>{domToReact(children as DOMNode[], options)}</Heading>;
        }

        // Handle paragraphs
        if (name === 'p') {
          return <Paragraph>{domToReact(children as DOMNode[], options)}</Paragraph>;
        }

        // Handle unordered lists
        if (name === 'ul') {
          return <UnorderedList>{domToReact(children as DOMNode[], options)}</UnorderedList>;
        }

        // Handle ordered lists
        if (name === 'ol') {
          return <OrderedList>{domToReact(children as DOMNode[], options)}</OrderedList>;
        }

        // Handle list items
        if (name === 'li') {
          return <ListItem>{domToReact(children as DOMNode[], options)}</ListItem>;
        }

        // Handle links
        if (name === 'a') {
          return (
            <Link href={attribs?.href} target={attribs?.target} rel={attribs?.rel}>
              {domToReact(children as DOMNode[], options)}
            </Link>
          );
        }

        // Handle strong/bold
        if (name === 'strong' || name === 'b') {
          return <Strong>{domToReact(children as DOMNode[], options)}</Strong>;
        }

        // Handle emphasis/italic
        if (name === 'em' || name === 'i') {
          return <Emphasis>{domToReact(children as DOMNode[], options)}</Emphasis>;
        }

        // Handle spans
        if (name === 'span') {
          return <Span>{domToReact(children as DOMNode[], options)}</Span>;
        }

        // Handle line breaks
        if (name === 'br') {
          return <Break />;
        }
      },
    };

    return parse(html, options);
  } catch {
    // Fallback to plain text on parse error
    return parseHtmlDescription(html);
  }
}

const AP_MONTHS = [
  '',
  'Jan.', 'Feb.', 'March', 'April', 'May', 'June',
  'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'
];

export function formatAPDate(dateInput: string | Date): string {
  let date: Date;
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, d] = dateInput.split('-').map(Number);
    date = new Date(y, m - 1, d);
  } else {
    date = dateInput instanceof Date ? dateInput : new Date(String(dateInput));
  }
  const weekday = date.toLocaleString('en-US', { weekday: 'long' });
  const month = AP_MONTHS[date.getMonth() + 1] || AP_MONTHS[date.getMonth()];
  const day = date.getDate();
  return `${weekday}, ${month} ${day}`;
}

export const formatAPTime = (dateInput: Date | string): string => {
  const date = dateInput instanceof Date ? dateInput : new Date(String(dateInput));
  let h = date.getHours();
  const m = date.getMinutes();
  const isAM = h < 12;
  h = h % 12;
  if (h === 0) h = 12;
  const period = isAM ? 'a.m.' : 'p.m.';
  return m === 0 ? `${h} ${period}` : `${h}:${m.toString().padStart(2, '0')} ${period}`;
};

export const formatAPTimeRange = (startDate: Date | string, endDate: Date | string): string => {
  const formatTime = (dArg: Date | string) => {
    const d = dArg instanceof Date ? dArg : new Date(String(dArg));
    let h = d.getHours();
    const m = d.getMinutes();
    const period = h < 12 ? 'a.m.' : 'p.m.';
    h = h % 12;
    if (h === 0) h = 12;
    const timeStr = m === 0 ? `${h}` : `${h}:${m.toString().padStart(2, '0')}`;
    return { timeStr, period };
  };
  const s = formatTime(startDate);
  const e = formatTime(endDate);
  if (s.period === e.period) {
    return `${s.timeStr}-${e.timeStr} ${e.period}`;
  }
  return `${s.timeStr} ${s.period}-${e.timeStr} ${e.period}`;
};

export const stripTitlePrefix = (title?: string): string => {
  if (!title) return '';
  return String(title).replace(/^Newhouse School \| /, '').replace(/^Newhouse \| /, '');
};

export function nameToSlug(name?: string): string {
  if (!name) return '';
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['",.()]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export async function fetchDirectoryPersonByContactName(contactName?: string, options: { baseUrl?: string; timeoutMs?: number } = {}) {
  if (!contactName || typeof contactName !== 'string') return null;
  const baseUrl = options.baseUrl || 'https://resources.newhouse.syr.edu/directory/wp-json/wp/v2/directory';
  const timeoutMs = options.timeoutMs ?? 6000;

  const cleaned = contactName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = cleaned.split(' ');
  const removeSuffixes = (arr: string[]) => arr.filter((p) => !/^jr\.?|sr\.?|ii|iii|iv|v$/i.test(p));
  const core = removeSuffixes(parts);
  const first = core[0] || '';
  const last = core.length > 1 ? core[core.length - 1] : '';
  const candidates = Array.from(new Set([
    nameToSlug(`${first} ${last}`),
    last && first ? nameToSlug(`${last} ${first}`) : '',
    nameToSlug(cleaned),
  ].filter(Boolean)));

  const fetchWithTimeout = async (url: string) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) return null;
      return res.json();
    } catch {
      clearTimeout(id);
      return null;
    }
  };

  for (const slug of candidates) {
    const url = `${baseUrl}?slug=${encodeURIComponent(slug)}&_fields=id,title,slug,meta`;
    const data = await fetchWithTimeout(url);
    if (Array.isArray(data) && data.length > 0) {
      const person = data[0] as unknown as Record<string, unknown>;
      const meta = (person?.meta as Record<string, unknown>)?.person_meta as Record<string, unknown> || {};
      const displayName = ((meta?.name as Record<string, unknown>)?.display_name as string) || ((person?.title as Record<string, unknown>)?.rendered as string) || contactName;
      const email = ((meta?.email as Record<string, unknown>)?.address as string) || (meta?.email as string) || ((meta?.contact as Record<string, unknown>)?.email as string) || null;
      const phone = ((meta?.phone as Record<string, unknown>)?.number as string) || (meta?.phone as string) || ((meta?.contact as Record<string, unknown>)?.phone as string) || null;
      const image = (((meta?.images as Record<string, unknown>)?.profile_image as Record<string, unknown>)?.src as string) || null;
      return { name: displayName, email, phone, image, raw: person };
    }
  }

  return null;
}
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

export function truncate(text: string, max = 500): string {
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
  const ampm = isAM ? 'a.m.' : 'p.m.';
  
  // AP style: omit minutes if :00
  const timeStr = minute === 0 ? `${hour12} ${ampm}` : `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  
  return `${weekday}, ${month} ${day}, ${timeStr}`;
}
