import { CreateBirthDto } from './create-birth.dto';

export type RecordStatus = 'Pending' | 'Approved' | 'Rejected';

/** Partial update; omitted fields keep existing values. Optional status. */
export type UpdateBirthDto = Partial<Omit<CreateBirthDto, 'birth_regno'>> & {
  status?: RecordStatus;
};
