import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BirthsModule } from './births/births.module';
import { DeathsModule } from './deaths/deaths.module';
import { MarriagesModule } from './marriages/marriages.module';
import { DivorcesModule } from './divorces/divorces.module';

@Module({
  imports: [
    PrismaModule,
    BirthsModule,
    DeathsModule,
    MarriagesModule,
    DivorcesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
