import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuditService } from './audit.service';
import { AuditLogsController } from './audit-logs.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AuditLogsController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
