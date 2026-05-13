import { BadRequestException, Injectable } from '@nestjs/common';
import { Death } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathDto } from './dto/update-death.dto';
import { UpdateDeathStatusDto } from './dto/update-death-status.dto';
import { AuditService } from '../audit/audit.service';
import { PersonsService } from '../persons/persons.service';
import { SequenceService } from '../lib/sequence.service';
import {
  assertDeathAfterBirth,
  assertIsoDate,
  assertMaxLen,
  assertNamePart,
  assertOptionalNamePart,
  joinNameParts,
  trimOrNull,
} from '../lib/vital-helpers';

const optionalHouse = (v?: string | null) => (v && v.trim() ? v.trim() : null);

function coalesce<T>(patch: T | undefined, prev: T | null | undefined): T | undefined {
  return patch !== undefined ? patch : prev ?? undefined;
}

@Injectable()
export class DeathsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly persons: PersonsService,
    private readonly sequences: SequenceService,
  ) {}

  private resolveDeceased(dto: CreateDeathDto) {
    const f = dto.deceased_first_name?.trim();
    const l = dto.deceased_last_name?.trim();
    if (f && l) {
      assertNamePart('Deceased first name', f);
      assertOptionalNamePart('Deceased middle name', dto.deceased_middle_name);
      assertNamePart('Deceased last name', l);
      const name = joinNameParts(f, dto.deceased_middle_name, l);
      return {
        name,
        deceased_first_name: f,
        deceased_middle_name: trimOrNull(dto.deceased_middle_name),
        deceased_last_name: l,
      };
    }
    const n = dto.name?.trim();
    if (n) {
      assertMaxLen('name', n, 100);
      return {
        name: n,
        deceased_first_name: null as string | null,
        deceased_middle_name: null as string | null,
        deceased_last_name: null as string | null,
      };
    }
    throw new BadRequestException(
      'Provide deceased first and last name (middle optional) or a full legal name.',
    );
  }

  private mergeDeath(prev: Death, patch: UpdateDeathDto): CreateDeathDto {
    return {
      deceased_first_name: coalesce(patch.deceased_first_name, prev.deceased_first_name),
      deceased_middle_name: coalesce(patch.deceased_middle_name, prev.deceased_middle_name),
      deceased_last_name: coalesce(patch.deceased_last_name, prev.deceased_last_name),
      name: coalesce(patch.name, prev.name),
      date_of_birth: patch.date_of_birth ?? prev.date_of_birth,
      date_of_death: patch.date_of_death ?? prev.date_of_death,
      cause_of_death: patch.cause_of_death ?? prev.cause_of_death,
      sex: (patch.sex ?? prev.sex) as 'Male' | 'Female',
      city: patch.city ?? prev.city,
      kebele: patch.kebele ?? prev.kebele,
      house_number: patch.house_number !== undefined ? patch.house_number : prev.house_number,
      nationality: patch.nationality ?? prev.nationality,
      registration_date: patch.registration_date ?? prev.registration_date,
      birth_regno: patch.birth_regno !== undefined ? patch.birth_regno : prev.birth_regno ?? undefined,
      created_by: patch.created_by ?? prev.created_by ?? undefined,
    };
  }

  async create(dto: CreateDeathDto) {
    assertIsoDate('date_of_birth', dto.date_of_birth);
    assertIsoDate('date_of_death', dto.date_of_death);
    assertIsoDate('registration_date', dto.registration_date);
    assertDeathAfterBirth(dto.date_of_birth, dto.date_of_death);
    assertMaxLen('cause_of_death', dto.cause_of_death, 20);
    assertMaxLen('nationality', dto.nationality, 15);

    const dec = this.resolveDeceased(dto);
    const death_regno = await this.sequences.nextDeathRegno();

    let deceased_person_id: string | null = null;
    if (dto.birth_regno) {
      const birth = await this.prisma.birth.findUnique({
        where: { birth_regno: dto.birth_regno },
        select: { child_person_id: true },
      });
      if (birth?.child_person_id) {
        deceased_person_id = birth.child_person_id;
      }
    }
    if (!deceased_person_id) {
      const p = dec.deceased_first_name
        ? await this.persons.createFromStructured({
            first_name: dec.deceased_first_name,
            middle_name: dec.deceased_middle_name,
            last_name: dec.deceased_last_name!,
            nationality: dto.nationality,
            dateOfBirth: dto.date_of_birth,
            gender: dto.sex,
            city: dto.city,
            kebele: dto.kebele,
            houseNumber: optionalHouse(dto.house_number),
          })
        : await this.persons.createFromFullName({
            fullName: dec.name,
            nationality: dto.nationality,
            dateOfBirth: dto.date_of_birth,
            gender: dto.sex,
            city: dto.city,
            kebele: dto.kebele,
            houseNumber: optionalHouse(dto.house_number),
          });
      deceased_person_id = p.id;
    }

    const created = await this.prisma.death.create({
      data: {
        death_regno,
        name: dec.name,
        deceased_first_name: dec.deceased_first_name,
        deceased_middle_name: dec.deceased_middle_name,
        deceased_last_name: dec.deceased_last_name,
        date_of_birth: dto.date_of_birth,
        date_of_death: dto.date_of_death,
        cause_of_death: dto.cause_of_death,
        sex: dto.sex,
        city: dto.city,
        kebele: dto.kebele,
        house_number: optionalHouse(dto.house_number),
        nationality: dto.nationality,
        registration_date: dto.registration_date,
        birth_regno: dto.birth_regno ?? null,
        created_by: dto.created_by ?? null,
        status: 'Pending',
        deceased_person_id,
      },
    });

    await this.audit.log({
      action: 'CREATE_DEATH',
      entityType: 'Death',
      entityId: created.id,
      actor: dto.created_by ?? null,
      details: JSON.stringify({ death_regno }),
    });

    return created;
  }

  async update(id: string, dto: UpdateDeathDto, actor?: string | null) {
    const prev = await this.findOne(id);
    const merged = this.mergeDeath(prev, dto);
    const dec = this.resolveDeceased(merged);

    const updated = await this.prisma.death.update({
      where: { id },
      data: {
        name: dec.name,
        deceased_first_name: dec.deceased_first_name,
        deceased_middle_name: dec.deceased_middle_name,
        deceased_last_name: dec.deceased_last_name,
        date_of_birth: merged.date_of_birth,
        date_of_death: merged.date_of_death,
        cause_of_death: merged.cause_of_death,
        sex: merged.sex,
        city: merged.city,
        kebele: merged.kebele,
        house_number: optionalHouse(merged.house_number),
        nationality: merged.nationality,
        registration_date: merged.registration_date,
        birth_regno: merged.birth_regno ?? null,
        ...(dto.status != null && { status: dto.status }),
      },
    });

    if (prev.deceased_person_id) {
      if (dec.deceased_first_name && dec.deceased_last_name) {
        await this.persons.updateStructuredPerson(prev.deceased_person_id, {
          first_name: dec.deceased_first_name,
          middle_name: dec.deceased_middle_name,
          last_name: dec.deceased_last_name,
          nationality: merged.nationality,
          dateOfBirth: merged.date_of_birth,
          gender: merged.sex,
          city: merged.city,
          kebele: merged.kebele,
          houseNumber: optionalHouse(merged.house_number),
        });
      } else {
        await this.persons.updateFromFullName(prev.deceased_person_id, dec.name, {
          nationality: merged.nationality,
          dateOfBirth: merged.date_of_birth,
          gender: merged.sex,
          city: merged.city,
          kebele: merged.kebele,
          houseNumber: optionalHouse(merged.house_number),
        });
      }
    }

    await this.audit.log({
      action: 'UPDATE_DEATH',
      entityType: 'Death',
      entityId: id,
      actor: actor ?? dto.created_by ?? prev.created_by ?? null,
      details: JSON.stringify({ death_regno: prev.death_regno, patch: dto }),
    });

    return updated;
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

  async updateStatus(id: string, dto: UpdateDeathStatusDto, actor?: string | null) {
    const updated = await this.prisma.death.update({
      where: { id },
      data: { status: dto.status },
    });
    await this.audit.log({
      action: 'UPDATE_DEATH_STATUS',
      entityType: 'Death',
      entityId: id,
      actor: actor ?? null,
      details: dto.status,
    });
    return updated;
  }
}
