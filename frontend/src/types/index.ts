export interface Person {
    person_id: string;
    full_name: string;
    nationality: string;
    age: number;
  }
  
  export interface BirthRecord {
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
  }
  
  export interface DeathRecord {
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
    birth_regno?: string;
    registration_date: string;
  }
  
  export interface MarriageRecord {
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
  }
  
  export interface DivorceRecord {
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
  }
  