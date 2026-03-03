export class CreateMarriageDto {
  marriage_regno: string;
  husband_name: string;
  husband_age: number;
  husband_nationality: string;
  wife_name: string;
  wife_age: number;
  wife_nationality: string;
  date_of_marriage: string;
  city: string;
  kebele: string;
  house_number: string;
  registration_date: string;
  created_by?: string;
}
