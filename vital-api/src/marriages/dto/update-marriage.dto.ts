import { CreateMarriageDto } from './create-marriage.dto';

export type RecordStatus = 'Pending' | 'Approved' | 'Rejected';

export type UpdateMarriageDto = Partial<Omit<CreateMarriageDto, 'marriage_regno'>> & {
  status?: RecordStatus;
};
