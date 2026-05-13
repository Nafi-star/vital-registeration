export type RecordStatus = 'Pending' | 'Approved' | 'Rejected';

export interface RecordMeta {
  id?: string;
  status?: RecordStatus;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

/** CBTP-style structured names (≤15 chars per part in UI); legacy composite kept for search. */
export interface BirthRecord extends RecordMeta {
  birth_regno: string;
  child_first_name?: string | null;
  child_middle_name?: string | null;
  child_last_name?: string | null;
  mother_first_name?: string | null;
  mother_middle_name?: string | null;
  mother_last_name?: string | null;
  father_first_name?: string | null;
  father_middle_name?: string | null;
  father_last_name?: string | null;
  child_name: string;
  mother_name: string;
  father_name: string;
  date_of_birth: string;
  sex: 'Male' | 'Female';
  city: string;
  kebele: string;
  house_number?: string | null;
  nationality: string;
  registration_date: string;
}

export interface DeathRecord extends RecordMeta {
  death_regno: string;
  deceased_first_name?: string | null;
  deceased_middle_name?: string | null;
  deceased_last_name?: string | null;
  name: string;
  date_of_birth: string;
  date_of_death: string;
  cause_of_death: string;
  sex: 'Male' | 'Female';
  city: string;
  kebele: string;
  house_number?: string | null;
  nationality: string;
  registration_date: string;
  birth_regno?: string;
}

export interface MarriageRecord extends RecordMeta {
  marriage_regno: string;
  husband_first_name?: string | null;
  husband_middle_name?: string | null;
  husband_last_name?: string | null;
  husband_name: string;
  husband_age: number;
  husband_nationality: string;
  wife_first_name?: string | null;
  wife_middle_name?: string | null;
  wife_last_name?: string | null;
  wife_name: string;
  wife_age: number;
  wife_nationality: string;
  date_of_marriage: string;
  city: string;
  kebele: string;
  house_number?: string | null;
  registration_date: string;
}

export interface DivorceRecord extends RecordMeta {
  divorce_regno: string;
  husband_first_name?: string | null;
  husband_middle_name?: string | null;
  husband_last_name?: string | null;
  husband_name: string;
  husband_age: number;
  husband_nationality: string;
  wife_first_name?: string | null;
  wife_middle_name?: string | null;
  wife_last_name?: string | null;
  wife_name: string;
  wife_age: number;
  wife_nationality: string;
  date_of_divorce: string;
  requester: 'Husband' | 'Wife' | 'Mutual' | 'Both';
  city: string;
  kebele: string;
  house_number?: string | null;
  registration_date: string;
  marriage_id?: string | null;
}

export type BirthCreatePayload = Omit<
  BirthRecord,
  'id' | 'status' | 'created_at' | 'updated_at' | 'birth_regno'
> & { birth_regno?: string };

export type DeathCreatePayload = Omit<
  DeathRecord,
  'id' | 'status' | 'created_at' | 'updated_at' | 'death_regno'
> & { death_regno?: string };

export type MarriageCreatePayload = Omit<
  MarriageRecord,
  'id' | 'status' | 'created_at' | 'updated_at' | 'marriage_regno'
> & { marriage_regno?: string };

export type DivorceCreatePayload = Omit<
  DivorceRecord,
  'id' | 'status' | 'created_at' | 'updated_at' | 'divorce_regno'
> & { divorce_regno?: string };

export type BirthUpdatePayload = Partial<BirthCreatePayload> & { status?: RecordStatus };
export type DeathUpdatePayload = Partial<DeathCreatePayload> & { status?: RecordStatus };
export type MarriageUpdatePayload = Partial<MarriageCreatePayload> & { status?: RecordStatus };
export type DivorceUpdatePayload = Partial<DivorceCreatePayload> & { status?: RecordStatus };

export interface StatsOverview {
  totals: { births: number; deaths: number; marriages: number; divorces: number };
  /** Counts of records still in Pending status (office workflow). */
  workflow?: {
    pending: { births: number; deaths: number; marriages: number; divorces: number };
    totalPending: number;
  };
  thisMonth: {
    month: string;
    births: number;
    deaths: number;
    marriages: number;
    divorces: number;
  };
  last6Months: {
    month: string;
    births: number;
    deaths: number;
    marriages: number;
    divorces: number;
  }[];
  topKebeles: { kebele: string; count: number }[];
  topDeathCauses: { cause: string; count: number }[];
}

export interface PersonMaster {
  id: string;
  person_public_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  nationality: string;
  date_of_birth: string;
  gender: string;
  city: string;
  kebele: string;
  house_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string | null;
  created_at: string;
}
