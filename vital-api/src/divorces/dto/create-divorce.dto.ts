export class CreateDivorceDto {
  divorce_regno: string;
  husband_name: string;
  husband_age: number;
  husband_nationality: string;
  wife_name: string;
  wife_age: number;
  wife_nationality: string;
  date_of_divorce: string;
  requester: 'Husband' | 'Wife' | 'Both';
  city: string;
  kebele: string;
  house_number: string;
  registration_date: string;
  created_by?: string;
}
