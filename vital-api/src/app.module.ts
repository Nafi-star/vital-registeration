import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BirthsModule } from './births/births.module';
import { DeathsModule } from './deaths/deaths.module';
import { MarriagesModule } from './marriages/marriages.module';
import { DivorcesModule } from './divorces/divorces.module';
import { PersonsModule } from './persons/persons.module';
import { StatsModule } from './stats/stats.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 200,
      },
    ]),
    PrismaModule,
    BirthsModule,
    DeathsModule,
    MarriagesModule,
    DivorcesModule,
    PersonsModule,
    StatsModule,
    AuditModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
