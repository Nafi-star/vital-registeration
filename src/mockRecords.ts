import { BirthRecord, DeathRecord, MarriageRecord, DivorceRecord } from './types';

const now = new Date().toISOString();

export const initialBirthRecords: BirthRecord[] = [
  {
    birth_regno: 'BRT-001',
    child_name: 'Abebe Kebede',
    mother_name: 'Almaz Tadesse',
    father_name: 'Kebede Worku',
    date_of_birth: '2025-01-15',
    sex: 'Male',
    city: 'Jimma',
    kebele: 'Hermata Merkato',
    house_number: '123',
    nationality: 'Ethiopian',
    registration_date: '2025-01-20',
    status: 'Approved',
    created_at: now,
    updated_at: now,
  },
  {
    birth_regno: 'BRT-002',
    child_name: 'Hanna Tesfaye',
    mother_name: 'Tigist Alemayehu',
    father_name: 'Tesfaye Bekele',
    date_of_birth: '2025-02-10',
    sex: 'Female',
    city: 'Jimma',
    kebele: 'Hermata Merkato',
    house_number: '456',
    nationality: 'Ethiopian',
    registration_date: '2025-02-15',
    status: 'Pending',
    created_at: now,
    updated_at: now,
  },
];

export const initialDeathRecords: DeathRecord[] = [
  {
    death_regno: 'DTH-001',
    name: 'Girma Haile',
    date_of_birth: '1950-05-20',
    date_of_death: '2025-01-10',
    cause_of_death: 'Natural causes',
    sex: 'Male',
    city: 'Jimma',
    kebele: 'Hermata Merkato',
    house_number: '789',
    nationality: 'Ethiopian',
    registration_date: '2025-01-12',
    status: 'Approved',
    created_at: now,
    updated_at: now,
  },
];

export const initialMarriageRecords: MarriageRecord[] = [
  {
    marriage_regno: 'MAR-001',
    husband_name: 'Samuel Desta',
    husband_age: 28,
    husband_nationality: 'Ethiopian',
    wife_name: 'Meron Yohannes',
    wife_age: 25,
    wife_nationality: 'Ethiopian',
    date_of_marriage: '2024-12-25',
    city: 'Jimma',
    kebele: 'Hermata Merkato',
    house_number: '321',
    registration_date: '2024-12-26',
    status: 'Approved',
    created_at: now,
    updated_at: now,
  },
];

export const initialDivorceRecords: DivorceRecord[] = [
  {
    divorce_regno: 'DIV-001',
    husband_name: 'Daniel Mulugeta',
    husband_age: 35,
    husband_nationality: 'Ethiopian',
    wife_name: 'Sara Tekle',
    wife_age: 32,
    wife_nationality: 'Ethiopian',
    date_of_divorce: '2025-01-05',
    requester: 'Both',
    city: 'Jimma',
    kebele: 'Hermata Merkato',
    house_number: '654',
    registration_date: '2025-01-07',
    status: 'Pending',
    created_at: now,
    updated_at: now,
  },
];

