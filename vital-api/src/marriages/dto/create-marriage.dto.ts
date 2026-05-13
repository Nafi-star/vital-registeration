export class CreateMarriageDto {
  marriage_regno?: string;

  husband_first_name?: string;
  husband_middle_name?: string | null;
  husband_last_name?: string;
  husband_name?: string;

  husband_age: number;
  husband_nationality: string;

  wife_first_name?: string;
  wife_middle_name?: string | null;
  wife_last_name?: string;
  wife_name?: string;

  wife_age: number;
  wife_nationality: string;
  date_of_marriage: string;
  city: string;
  kebele: string;
  house_number?: string | null;
  registration_date: string;
  created_by?: string;
}
