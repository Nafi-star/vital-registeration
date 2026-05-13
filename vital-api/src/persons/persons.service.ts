import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SequenceService } from '../lib/sequence.service';
import {
  assertNamePart,
  assertOptionalNamePart,
  splitFullName,
  trimOrNull,
} from '../lib/vital-helpers';

@Injectable()
export class PersonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sequences: SequenceService,
  ) {}

  async createFromFullName(input: {
    fullName: string;
    nationality: string;
    dateOfBirth: string;
    gender: string;
    city: string;
    kebele: string;
    houseNumber?: string | null;
  }) {
    const { first_name, middle_name, last_name } = splitFullName(input.fullName);
    const person_public_id = await this.sequences.nextPersonPublicId();
    return this.prisma.person.create({
      data: {
        person_public_id,
        first_name,
        middle_name: middle_name ?? null,
        last_name,
        nationality: input.nationality,
        date_of_birth: input.dateOfBirth,
        gender: input.gender,
        city: input.city,
        kebele: input.kebele,
        house_number: input.houseNumber?.trim() ? input.houseNumber : null,
      },
    });
  }

  async createFromStructured(input: {
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    nationality: string;
    dateOfBirth: string;
    gender: string;
    city: string;
    kebele: string;
    houseNumber?: string | null;
  }) {
    assertNamePart('First name', input.first_name);
    assertOptionalNamePart('Middle name', input.middle_name);
    assertNamePart('Last name', input.last_name);
    const person_public_id = await this.sequences.nextPersonPublicId();
    return this.prisma.person.create({
      data: {
        person_public_id,
        first_name: input.first_name.trim(),
        middle_name: trimOrNull(input.middle_name),
        last_name: input.last_name.trim(),
        nationality: input.nationality,
        date_of_birth: input.dateOfBirth,
        gender: input.gender,
        city: input.city,
        kebele: input.kebele,
        house_number: input.houseNumber?.trim() ? input.houseNumber : null,
      },
    });
  }

  async updateStructuredPerson(
    personId: string,
    input: {
      first_name: string;
      middle_name?: string | null;
      last_name: string;
      nationality?: string;
      dateOfBirth?: string;
      gender?: string;
      city?: string;
      kebele?: string;
      houseNumber?: string | null;
    },
  ) {
    assertNamePart('First name', input.first_name);
    assertOptionalNamePart('Middle name', input.middle_name);
    assertNamePart('Last name', input.last_name);
    return this.prisma.person.update({
      where: { id: personId },
      data: {
        first_name: input.first_name.trim(),
        middle_name: trimOrNull(input.middle_name),
        last_name: input.last_name.trim(),
        ...(input.nationality != null && { nationality: input.nationality }),
        ...(input.dateOfBirth != null && { date_of_birth: input.dateOfBirth }),
        ...(input.gender != null && { gender: input.gender }),
        ...(input.city != null && { city: input.city }),
        ...(input.kebele != null && { kebele: input.kebele }),
        ...(input.houseNumber !== undefined && {
          house_number: input.houseNumber?.trim() ? input.houseNumber : null,
        }),
      },
    });
  }

  async updateFromFullName(
    personId: string,
    fullName: string,
    extra: {
      nationality: string;
      dateOfBirth: string;
      gender: string;
      city: string;
      kebele: string;
      houseNumber?: string | null;
    },
  ) {
    const { first_name, middle_name, last_name } = splitFullName(fullName);
    return this.prisma.person.update({
      where: { id: personId },
      data: {
        first_name,
        middle_name: middle_name ?? null,
        last_name,
        nationality: extra.nationality,
        date_of_birth: extra.dateOfBirth,
        gender: extra.gender,
        city: extra.city,
        kebele: extra.kebele,
        house_number: extra.houseNumber?.trim() ? extra.houseNumber : null,
      },
    });
  }

  async searchByNameOrId(q: string) {
    const term = q.trim();
    if (!term) return [];
    return this.prisma.person.findMany({
      where: {
        OR: [
          { person_public_id: { contains: term, mode: 'insensitive' } },
          { first_name: { contains: term, mode: 'insensitive' } },
          { middle_name: { contains: term, mode: 'insensitive' } },
          { last_name: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: 50,
      orderBy: { created_at: 'desc' },
    });
  }

  async getHistoryByPublicId(personPublicId: string) {
    const person = await this.prisma.person.findUnique({
      where: { person_public_id: personPublicId },
      include: {
        birth_as_child: true,
        death_as_deceased: true,
        marriages_husband: true,
        marriages_wife: true,
        divorces_husband: true,
        divorces_wife: true,
      },
    });
    if (!person) {
      throw new NotFoundException(`Person ${personPublicId} not found`);
    }
    return person;
  }
}
