import { Module } from '@nestjs/common';
import { DivorcesController } from './divorces.controller';
import { DivorcesService } from './divorces.service';

@Module({
  controllers: [DivorcesController],
  providers: [DivorcesService],
})
export class DivorcesModule {}
