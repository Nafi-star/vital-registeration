/**
 * Join structured name parts for display / legacy composite fields.
 */
export function joinNameParts(
  first?: string | null,
  middle?: string | null,
  last?: string | null,
): string {
  return [first, middle, last].map((s) => s?.trim()).filter(Boolean).join(' ');
}

/** Split a full name into Ethiopian-style first / middle / last (best-effort). */
export function splitFullName(full: string): {
  first_name: string;
  middle_name: string;
  last_name: string;
} {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: '', middle_name: '', last_name: '' };
  if (parts.length === 1) return { first_name: parts[0]!, middle_name: '', last_name: '-' };
  if (parts.length === 2) return { first_name: parts[0]!, middle_name: '', last_name: parts[1]! };
  return {
    first_name: parts[0]!,
    middle_name: parts.slice(1, -1).join(' '),
    last_name: parts[parts.length - 1]!,
  };
}

export function displayChildName(r: {
  child_first_name?: string | null;
  child_middle_name?: string | null;
  child_last_name?: string | null;
  child_name: string;
}): string {
  const j = joinNameParts(r.child_first_name, r.child_middle_name, r.child_last_name);
  return j || r.child_name;
}

export function displayMotherName(r: {
  mother_first_name?: string | null;
  mother_middle_name?: string | null;
  mother_last_name?: string | null;
  mother_name: string;
}): string {
  const j = joinNameParts(r.mother_first_name, r.mother_middle_name, r.mother_last_name);
  return j || r.mother_name;
}

export function displayFatherName(r: {
  father_first_name?: string | null;
  father_middle_name?: string | null;
  father_last_name?: string | null;
  father_name: string;
}): string {
  const j = joinNameParts(r.father_first_name, r.father_middle_name, r.father_last_name);
  return j || r.father_name;
}

export function displayDeceasedName(r: {
  deceased_first_name?: string | null;
  deceased_middle_name?: string | null;
  deceased_last_name?: string | null;
  name: string;
}): string {
  const j = joinNameParts(r.deceased_first_name, r.deceased_middle_name, r.deceased_last_name);
  return j || r.name;
}

export function displaySpouseName(side: 'husband' | 'wife', r: object): string {
  const row = r as Record<string, unknown>;
  const f = row[`${side}_first_name`];
  const m = row[`${side}_middle_name`];
  const l = row[`${side}_last_name`];
  const legacy = row[`${side}_name`];
  const j = joinNameParts(
    typeof f === 'string' ? f : null,
    typeof m === 'string' ? m : null,
    typeof l === 'string' ? l : null,
  );
  return j || (typeof legacy === 'string' ? legacy : '');
}
