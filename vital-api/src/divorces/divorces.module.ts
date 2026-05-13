import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PersonsModule } from '../persons/persons.module';
import { AuthModule } from '../auth/auth.module';
import { DivorcesController } from './divorces.controller';
import { DivorcesService } from './divorces.service';

@Module({
  imports: [AuditModule, PersonsModule, AuthModule],
  controllers: [DivorcesController],
  providers: [DivorcesService],
})
export class DivorcesModule {}
