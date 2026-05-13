export class CreateDeathDto {
  /** Ignored when present; server assigns D{year}{seq}. */
  death_regno?: string;

  deceased_first_name?: string;
  deceased_middle_name?: string | null;
  deceased_last_name?: string;

  /** Legacy full name if structured parts not used. */
  name?: string;

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
  created_by?: string;
}
