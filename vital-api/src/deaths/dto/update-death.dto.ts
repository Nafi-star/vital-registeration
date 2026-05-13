import { CreateDeathDto } from './create-death.dto';

export type RecordStatus = 'Pending' | 'Approved' | 'Rejected';

export type UpdateDeathDto = Partial<Omit<CreateDeathDto, 'death_regno'>> & {
  status?: RecordStatus;
};
