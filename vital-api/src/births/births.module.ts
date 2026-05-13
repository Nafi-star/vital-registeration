import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PersonsModule } from '../persons/persons.module';
import { AuthModule } from '../auth/auth.module';
import { BirthsController } from './births.controller';
import { BirthsService } from './births.service';

@Module({
  imports: [AuditModule, PersonsModule, AuthModule],
  controllers: [BirthsController],
  providers: [BirthsService],
})
export class BirthsModule {}
