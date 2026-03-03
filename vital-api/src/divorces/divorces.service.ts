import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDivorceDto } from './dto/create-divorce.dto';
import { UpdateDivorceStatusDto } from './dto/update-divorce-status.dto';

@Injectable()
export class DivorcesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDivorceDto) {
    return this.prisma.divorce.create({
      data: {
        ...dto,
        status: 'Pending',
      },
    });
  }

  async findAll(status?: string) {
    return this.prisma.divorce.findMany({
      where: status ? { status } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.divorce.findUniqueOrThrow({
      where: { id },
    });
  }

  async updateStatus(id: string, dto: UpdateDivorceStatusDto) {
    return this.prisma.divorce.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
