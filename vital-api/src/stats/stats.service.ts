import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  private monthPrefix(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  async overview() {
    const now = new Date();
    const prefix = this.monthPrefix(now);

    const [births, deaths, marriages, divorces] = await Promise.all([
      this.prisma.birth.findMany({
        select: { registration_date: true, kebele: true, created_at: true, status: true },
      }),
      this.prisma.death.findMany({
        select: {
          registration_date: true,
          kebele: true,
          cause_of_death: true,
          created_at: true,
          status: true,
        },
      }),
      this.prisma.marriage.findMany({
        select: { registration_date: true, kebele: true, created_at: true, status: true },
      }),
      this.prisma.divorce.findMany({
        select: { registration_date: true, kebele: true, created_at: true, status: true },
      }),
    ]);

    const isPending = (status: string | null | undefined) => (status ?? 'Pending') === 'Pending';
    const pendingBirths = births.filter((b) => isPending(b.status)).length;
    const pendingDeaths = deaths.filter((b) => isPending(b.status)).length;
    const pendingMarriages = marriages.filter((b) => isPending(b.status)).length;
    const pendingDivorces = divorces.filter((b) => isPending(b.status)).length;

    const inThisMonth = (regDate: string) => regDate.startsWith(prefix);

    const birthsThisMonth = births.filter((b) => inThisMonth(b.registration_date)).length;
    const deathsThisMonth = deaths.filter((b) => inThisMonth(b.registration_date)).length;
    const marriagesThisMonth = marriages.filter((b) => inThisMonth(b.registration_date)).length;
    const divorcesThisMonth = divorces.filter((b) => inThisMonth(b.registration_date)).length;

    const kebeleCounts: Record<string, number> = {};
    for (const r of [...births, ...deaths, ...marriages, ...divorces]) {
      kebeleCounts[r.kebele] = (kebeleCounts[r.kebele] ?? 0) + 1;
    }
    const topKebeles = Object.entries(kebeleCounts)
      .map(([kebele, count]) => ({ kebele, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const causeCounts: Record<string, number> = {};
    for (const d of deaths) {
      const c = d.cause_of_death.trim() || 'Unknown';
      causeCounts[c] = (causeCounts[c] ?? 0) + 1;
    }
    const topDeathCauses = Object.entries(causeCounts)
      .map(([cause, count]) => ({ cause, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const last6Months: { month: string; births: number; deaths: number; marriages: number; divorces: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mp = this.monthPrefix(d);
      last6Months.push({
        month: mp,
        births: births.filter((b) => b.registration_date.startsWith(mp)).length,
        deaths: deaths.filter((x) => x.registration_date.startsWith(mp)).length,
        marriages: marriages.filter((x) => x.registration_date.startsWith(mp)).length,
        divorces: divorces.filter((x) => x.registration_date.startsWith(mp)).length,
      });
    }

    return {
      totals: {
        births: births.length,
        deaths: deaths.length,
        marriages: marriages.length,
        divorces: divorces.length,
      },
      workflow: {
        pending: {
          births: pendingBirths,
          deaths: pendingDeaths,
          marriages: pendingMarriages,
          divorces: pendingDivorces,
        },
        totalPending: pendingBirths + pendingDeaths + pendingMarriages + pendingDivorces,
      },
      thisMonth: {
        month: prefix,
        births: birthsThisMonth,
        deaths: deathsThisMonth,
        marriages: marriagesThisMonth,
        divorces: divorcesThisMonth,
      },
      last6Months,
      topKebeles,
      topDeathCauses,
    };
  }
}
