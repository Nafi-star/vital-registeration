import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarriageDto } from './dto/create-marriage.dto';
import { UpdateMarriageStatusDto } from './dto/update-marriage-status.dto';

@Injectable()
export class MarriagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMarriageDto) {
    return this.prisma.marriage.create({
      data: {
        ...dto,
        status: 'Pending',
      },
    });
  }

  async findAll(status?: string) {
    return this.prisma.marriage.findMany({
      where: status ? { status } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.marriage.findUniqueOrThrow({
      where: { id },
    });
  }

  async updateStatus(id: string, dto: UpdateMarriageStatusDto) {
    return this.prisma.marriage.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
