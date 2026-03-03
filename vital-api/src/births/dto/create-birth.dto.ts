export class CreateBirthDto {
  birth_regno: string;
  child_name: string;
  mother_name: string;
  father_name: string;
  date_of_birth: string;
  sex: 'Male' | 'Female';
  city: string;
  kebele: string;
  house_number: string;
  nationality: string;
  registration_date: string;
  created_by?: string;
}
