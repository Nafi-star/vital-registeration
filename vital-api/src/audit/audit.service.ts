import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: {
    action: string;
    entityType: string;
    entityId: string;
    actor?: string | null;
    details?: string | null;
  }) {
    await this.prisma.auditLog.create({
      data: {
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId,
        actor: input.actor ?? null,
        details: input.details ?? null,
      },
    });
  }
}
