import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('limit') limit?: string) {    const n = Math.min(500, Math.max(1, parseInt(limit ?? '100', 10) || 100));
    return this.prisma.auditLog.findMany({
      take: n,
      orderBy: { created_at: 'desc' },
    });
  }
}
