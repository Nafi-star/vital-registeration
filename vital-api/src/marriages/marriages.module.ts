import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PersonsModule } from '../persons/persons.module';
import { AuthModule } from '../auth/auth.module';
import { MarriagesController } from './marriages.controller';
import { MarriagesService } from './marriages.service';

@Module({
  imports: [AuditModule, PersonsModule, AuthModule],
  controllers: [MarriagesController],
  providers: [MarriagesService],
})
export class MarriagesModule {}
