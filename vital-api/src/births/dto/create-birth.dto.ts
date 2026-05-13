export class CreateBirthDto {
  /** Ignored when present; server assigns B{year}{seq}. */
  birth_regno?: string;

  /** Structured names (preferred; CBTP 15 chars per part). */
  child_first_name?: string;
  child_middle_name?: string | null;
  child_last_name?: string;
  mother_first_name?: string;
  mother_middle_name?: string | null;
  mother_last_name?: string;
  father_first_name?: string;
  father_middle_name?: string | null;
  father_last_name?: string;

  /** Legacy full-line names (optional if structured parts are provided). */
  child_name?: string;
  mother_name?: string;
  father_name?: string;

  date_of_birth: string;
  sex: 'Male' | 'Female';
  city: string;
  kebele: string;
  house_number?: string | null;
  nationality: string;
  registration_date: string;
  created_by?: string;
}
