export class CreateDeathDto {
  death_regno: string;
  name: string;
  date_of_birth: string;
  date_of_death: string;
  cause_of_death: string;
  sex: 'Male' | 'Female';
  city: string;
  kebele: string;
  house_number: string;
  nationality: string;
  registration_date: string;
  birth_regno?: string;
  created_by?: string;
}
