import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathStatusDto } from './dto/update-death-status.dto';

@Injectable()
export class DeathsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDeathDto) {
    return this.prisma.death.create({
      data: {
        ...dto,
        status: 'Pending',
      },
    });
  }

  async findAll(status?: string) {
    return this.prisma.death.findMany({
      where: status ? { status } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.death.findUniqueOrThrow({
      where: { id },
    });
  }

  async updateStatus(id: string, dto: UpdateDeathStatusDto) {
    return this.prisma.death.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
