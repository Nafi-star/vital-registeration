import { Module } from '@nestjs/common';
import { BirthsController } from './births.controller';
import { BirthsService } from './births.service';

@Module({
  controllers: [BirthsController],
  providers: [BirthsService],
})
export class BirthsModule {}
