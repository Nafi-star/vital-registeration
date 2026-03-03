import { Module } from '@nestjs/common';
import { MarriagesController } from './marriages.controller';
import { MarriagesService } from './marriages.service';

@Module({
  controllers: [MarriagesController],
  providers: [MarriagesService],
})
export class MarriagesModule {}
