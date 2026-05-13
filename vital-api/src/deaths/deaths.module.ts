import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PersonsModule } from '../persons/persons.module';
import { AuthModule } from '../auth/auth.module';
import { DeathsController } from './deaths.controller';
import { DeathsService } from './deaths.service';

@Module({
  imports: [AuditModule, PersonsModule, AuthModule],
  controllers: [DeathsController],
  providers: [DeathsService],
})
export class DeathsModule {}
