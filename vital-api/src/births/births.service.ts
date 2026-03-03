import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBirthDto } from './dto/create-birth.dto';
import { UpdateBirthStatusDto } from './dto/update-birth-status.dto';

@Injectable()
export class BirthsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBirthDto) {
    return this.prisma.birth.create({
      data: {
        ...dto,
        status: 'Pending',
      },
    });
  }

  async findAll(status?: string) {
    return this.prisma.birth.findMany({
      where: status ? { status } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.birth.findUniqueOrThrow({
      where: { id },
    });
  }

  async updateStatus(id: string, dto: UpdateBirthStatusDto) {
    return this.prisma.birth.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
