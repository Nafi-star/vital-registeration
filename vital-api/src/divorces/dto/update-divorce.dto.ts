import { CreateDivorceDto } from './create-divorce.dto';

export type RecordStatus = 'Pending' | 'Approved' | 'Rejected';

export type UpdateDivorceDto = Partial<Omit<CreateDivorceDto, 'divorce_regno'>> & {
  status?: RecordStatus;
};
