import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SequenceService } from '../lib/sequence.service';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PersonsController],
  providers: [PersonsService, SequenceService],
  exports: [PersonsService, SequenceService],
})
export class PersonsModule {}
