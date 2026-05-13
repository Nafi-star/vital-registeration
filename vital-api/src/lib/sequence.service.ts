import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SequenceService {
  constructor(private readonly prisma: PrismaService) {}

  private async nextSequentialRegno(
    prefix: string,
    fetchRegs: () => Promise<string[]>,
  ): Promise<string> {
    const rows = await fetchRegs();
    let max = 0;
    for (const reg of rows) {
      if (!reg.startsWith(prefix)) continue;
      const suffix = reg.slice(prefix.length);
      const n = parseInt(suffix, 10);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
    return `${prefix}${String(max + 1).padStart(4, '0')}`;
  }

  async nextBirthRegno(): Promise<string> {
    const prefix = `B${new Date().getFullYear()}`;
    return this.nextSequentialRegno(prefix, async () => {
      const rows = await this.prisma.birth.findMany({
        where: { birth_regno: { startsWith: prefix } },
        select: { birth_regno: true },
      });
      return rows.map((r) => r.birth_regno);
    });
  }

  async nextDeathRegno(): Promise<string> {
    const prefix = `D${new Date().getFullYear()}`;
    return this.nextSequentialRegno(prefix, async () => {
      const rows = await this.prisma.death.findMany({
        where: { death_regno: { startsWith: prefix } },
        select: { death_regno: true },
      });
      return rows.map((r) => r.death_regno);
    });
  }

  async nextMarriageRegno(): Promise<string> {
    const prefix = `M${new Date().getFullYear()}`;
    return this.nextSequentialRegno(prefix, async () => {
      const rows = await this.prisma.marriage.findMany({
        where: { marriage_regno: { startsWith: prefix } },
        select: { marriage_regno: true },
      });
      return rows.map((r) => r.marriage_regno);
    });
  }

  async nextDivorceRegno(): Promise<string> {
    const prefix = `DV${new Date().getFullYear()}`;
    return this.nextSequentialRegno(prefix, async () => {
      const rows = await this.prisma.divorce.findMany({
        where: { divorce_regno: { startsWith: prefix } },
        select: { divorce_regno: true },
      });
      return rows.map((r) => r.divorce_regno);
    });
  }

  async nextPersonPublicId(): Promise<string> {
    const prefix = `P${new Date().getFullYear()}`;
    return this.nextSequentialRegno(prefix, async () => {
      const rows = await this.prisma.person.findMany({
        where: { person_public_id: { startsWith: prefix } },
        select: { person_public_id: true },
      });
      return rows.map((r) => r.person_public_id);
    });
  }
}
