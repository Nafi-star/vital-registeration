import { BadRequestException } from '@nestjs/common';

/** CBTP: first/middle/last parts up to 15 characters each. */
export const NAME_PART_MAX = 15;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function assertIsoDate(field: string, value: string) {
  if (!ISO_DATE.test(value)) {
    throw new BadRequestException(`${field} must be in YYYY-MM-DD format`);
  }
  if (Number.isNaN(Date.parse(value))) {
    throw new BadRequestException(`${field} is not a valid calendar date`);
  }
}

export function parseIsoDate(value: string): number {
  assertIsoDate('Date', value);
  return Date.parse(value + 'T00:00:00.000Z');
}

export function assertDeathAfterBirth(dateOfBirth: string, dateOfDeath: string) {
  if (parseIsoDate(dateOfDeath) < parseIsoDate(dateOfBirth)) {
    throw new BadRequestException('Date of death cannot be before date of birth');
  }
}

export function assertDivorceAfterMarriage(dateOfMarriage: string, dateOfDivorce: string) {
  if (parseIsoDate(dateOfDivorce) < parseIsoDate(dateOfMarriage)) {
    throw new BadRequestException('Date of divorce cannot be before date of marriage');
  }
}

export function splitFullName(full: string): {
  first_name: string;
  middle_name?: string;
  last_name: string;
} {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { first_name: 'Unknown', last_name: 'Unknown' };
  }
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: '-' };
  }
  if (parts.length === 2) {
    return { first_name: parts[0], last_name: parts[1] };
  }
  return {
    first_name: parts[0],
    middle_name: parts.slice(1, -1).join(' '),
    last_name: parts[parts.length - 1]!,
  };
}

/** Approximate DOB when only age-at-event is known (Jan 1 of estimated birth year). */
export function approximateDobFromAgeAtDate(age: number, eventDateIso: string): string {
  assertIsoDate('Event date', eventDateIso);
  const y = new Date(eventDateIso + 'T00:00:00.000Z').getUTCFullYear() - age;
  return `${y}-01-01`;
}

export function assertMaxLen(field: string, value: string, max: number) {
  if (value.length > max) {
    throw new BadRequestException(`${field} must be at most ${max} characters`);
  }
}

export function normalizeRequester(raw: string): 'Husband' | 'Wife' | 'Mutual' {
  if (raw === 'Husband' || raw === 'Wife' || raw === 'Mutual') return raw;
  if (raw === 'Both') return 'Mutual';
  throw new BadRequestException('requester must be Husband, Wife, or Mutual');
}

export function joinNameParts(
  first: string,
  middle?: string | null,
  last?: string | null,
): string {
  const a = first?.trim() ?? '';
  const b = middle?.trim() ?? '';
  const c = last?.trim() ?? '';
  return [a, b, c].filter(Boolean).join(' ');
}

export function trimOrNull(v?: string | null): string | null {
  const t = v?.trim();
  return t ? t : null;
}

/** Required name part (first or last). */
export function assertNamePart(label: string, value: string) {
  const t = value?.trim() ?? '';
  if (!t) {
    throw new BadRequestException(`${label} is required`);
  }
  if (t.length > NAME_PART_MAX) {
    throw new BadRequestException(`${label} must be at most ${NAME_PART_MAX} characters`);
  }
}

/** Optional middle name — if present, max length applies. */
export function assertOptionalNamePart(label: string, value?: string | null) {
  const t = value?.trim() ?? '';
  if (!t) return;
  if (t.length > NAME_PART_MAX) {
    throw new BadRequestException(`${label} must be at most ${NAME_PART_MAX} characters`);
  }
}
