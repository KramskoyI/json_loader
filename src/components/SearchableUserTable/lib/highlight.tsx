import type { ReactNode } from 'react';

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function renderHighlightedText(value: string, normalizedQuery: string): ReactNode {
  if (normalizedQuery === '') {
    return value;
  }

  const parts = value.split(new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi'));

  return parts.map((part, index) => {
    if (part.toLowerCase() === normalizedQuery) {
      return (
        <mark key={`${part}-${index}`} className="ui-searchable__highlight">
          {part}
        </mark>
      );
    }

    return part;
  });
}
