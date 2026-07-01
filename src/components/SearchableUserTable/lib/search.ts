import type { UserRecord } from '../../../types/data';

export function getSearchableValues(row: UserRecord) {
  return [
    String(row.id),
    row.fullName,
    row.email,
    row.phone,
    row.country,
    row.city,
    String(row.age),
    row.nationality,
  ];
}

export function matchesQuery(row: UserRecord, normalizedQuery: string) {
  if (normalizedQuery === '') {
    return false;
  }

  return getSearchableValues(row).some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}
