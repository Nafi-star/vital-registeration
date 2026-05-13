import { BadRequestException, Injectable } from '@nestjs/common';
import { Birth } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBirthDto } from './dto/create-birth.dto';
import { UpdateBirthDto } from './dto/update-birth.dto';
import { UpdateBirthStatusDto } from './dto/update-birth-status.dto';
import { AuditService } from '../audit/audit.service';
import { PersonsService } from '../persons/persons.service';
import { SequenceService } from '../lib/sequence.service';
import {
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
export class BirthsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly persons: PersonsService,
    private readonly sequences: SequenceService,
  ) {}

  private resolveBirthNames(dto: CreateBirthDto) {
    const cf = dto.child_first_name?.trim();
    const cl = dto.child_last_name?.trim();
    const mf = dto.mother_first_name?.trim();
    const ml = dto.mother_last_name?.trim();
    const ff = dto.father_first_name?.trim();
    const fl = dto.father_last_name?.trim();

    if (cf && cl && mf && ml && ff && fl) {
      assertNamePart('Child first name', cf);
      assertOptionalNamePart('Child middle name', dto.child_middle_name);
      assertNamePart('Child last name', cl);
      assertNamePart('Mother first name', mf);
      assertOptionalNamePart('Mother middle name', dto.mother_middle_name);
      assertNamePart('Mother last name', ml);
      assertNamePart('Father first name', ff);
      assertOptionalNamePart('Father middle name', dto.father_middle_name);
      assertNamePart('Father last name', fl);

      return {
        child_name: joinNameParts(cf, dto.child_middle_name, cl),
        mother_name: joinNameParts(mf, dto.mother_middle_name, ml),
        father_name: joinNameParts(ff, dto.father_middle_name, fl),
        child_first_name: cf,
        child_middle_name: trimOrNull(dto.child_middle_name),
        child_last_name: cl,
        mother_first_name: mf,
        mother_middle_name: trimOrNull(dto.mother_middle_name),
        mother_last_name: ml,
        father_first_name: ff,
        father_middle_name: trimOrNull(dto.father_middle_name),
        father_last_name: fl,
      };
    }

    const cn = dto.child_name?.trim();
    const mn = dto.mother_name?.trim();
    const fn = dto.father_name?.trim();
    if (cn && mn && fn) {
      assertMaxLen('child_name', cn, 100);
      assertMaxLen('mother_name', mn, 100);
      assertMaxLen('father_name', fn, 100);
      return {
        child_name: cn,
        mother_name: mn,
        father_name: fn,
        child_first_name: null as string | null,
        child_middle_name: null as string | null,
        child_last_name: null as string | null,
        mother_first_name: null as string | null,
        mother_middle_name: null as string | null,
        mother_last_name: null as string | null,
        father_first_name: null as string | null,
        father_middle_name: null as string | null,
        father_last_name: null as string | null,
      };
    }

    throw new BadRequestException(
      'Provide structured first and last names for child, mother, and father (middle names optional), or legacy full names for each.',
    );
  }

  private mergeBirth(prev: Birth, patch: UpdateBirthDto): CreateBirthDto {
    return {
      child_first_name: coalesce(patch.child_first_name, prev.child_first_name),
      child_middle_name: coalesce(patch.child_middle_name, prev.child_middle_name),
      child_last_name: coalesce(patch.child_last_name, prev.child_last_name),
      mother_first_name: coalesce(patch.mother_first_name, prev.mother_first_name),
      mother_middle_name: coalesce(patch.mother_middle_name, prev.mother_middle_name),
      mother_last_name: coalesce(patch.mother_last_name, prev.mother_last_name),
      father_first_name: coalesce(patch.father_first_name, prev.father_first_name),
      father_middle_name: coalesce(patch.father_middle_name, prev.father_middle_name),
      father_last_name: coalesce(patch.father_last_name, prev.father_last_name),
      child_name: coalesce(patch.child_name, prev.child_name),
      mother_name: coalesce(patch.mother_name, prev.mother_name),
      father_name: coalesce(patch.father_name, prev.father_name),
      date_of_birth: patch.date_of_birth ?? prev.date_of_birth,
      sex: (patch.sex ?? prev.sex) as 'Male' | 'Female',
      city: patch.city ?? prev.city,
      kebele: patch.kebele ?? prev.kebele,
      house_number: patch.house_number !== undefined ? patch.house_number : prev.house_number,
      nationality: patch.nationality ?? prev.nationality,
      registration_date: patch.registration_date ?? prev.registration_date,
      created_by: patch.created_by ?? prev.created_by ?? undefined,
    };
  }

  async create(dto: CreateBirthDto) {
    assertIsoDate('date_of_birth', dto.date_of_birth);
    assertIsoDate('registration_date', dto.registration_date);
    assertMaxLen('nationality', dto.nationality, 15);
    assertMaxLen('city', dto.city, 50);
    assertMaxLen('kebele', dto.kebele, 50);

    const names = this.resolveBirthNames(dto);
    const birth_regno = await this.sequences.nextBirthRegno();

    const child = names.child_first_name
      ? await this.persons.createFromStructured({
          first_name: names.child_first_name,
          middle_name: names.child_middle_name,
          last_name: names.child_last_name!,
          nationality: dto.nationality,
          dateOfBirth: dto.date_of_birth,
          gender: dto.sex,
          city: dto.city,
          kebele: dto.kebele,
          houseNumber: optionalHouse(dto.house_number),
        })
      : await this.persons.createFromFullName({
          fullName: names.child_name,
          nationality: dto.nationality,
          dateOfBirth: dto.date_of_birth,
          gender: dto.sex,
          city: dto.city,
          kebele: dto.kebele,
          houseNumber: optionalHouse(dto.house_number),
        });

    const created = await this.prisma.birth.create({
      data: {
        birth_regno,
        child_name: names.child_name,
        mother_name: names.mother_name,
        father_name: names.father_name,
        child_first_name: names.child_first_name,
        child_middle_name: names.child_middle_name,
        child_last_name: names.child_last_name,
        mother_first_name: names.mother_first_name,
        mother_middle_name: names.mother_middle_name,
        mother_last_name: names.mother_last_name,
        father_first_name: names.father_first_name,
        father_middle_name: names.father_middle_name,
        father_last_name: names.father_last_name,
        date_of_birth: dto.date_of_birth,
        sex: dto.sex,
        city: dto.city,
        kebele: dto.kebele,
        house_number: optionalHouse(dto.house_number),
        nationality: dto.nationality,
        registration_date: dto.registration_date,
        created_by: dto.created_by ?? null,
        status: 'Pending',
        child_person_id: child.id,
      },
    });

    await this.audit.log({
      action: 'CREATE_BIRTH',
      entityType: 'Birth',
      entityId: created.id,
      actor: dto.created_by ?? null,
      details: JSON.stringify({ birth_regno }),
    });

    return created;
  }

  async update(id: string, dto: UpdateBirthDto, actor?: string | null) {
    const prev = await this.findOne(id);
    const merged = this.mergeBirth(prev, dto);
    const names = this.resolveBirthNames(merged);

    const updated = await this.prisma.birth.update({
      where: { id },
      data: {
        child_name: names.child_name,
        mother_name: names.mother_name,
        father_name: names.father_name,
        child_first_name: names.child_first_name,
        child_middle_name: names.child_middle_name,
        child_last_name: names.child_last_name,
        mother_first_name: names.mother_first_name,
        mother_middle_name: names.mother_middle_name,
        mother_last_name: names.mother_last_name,
        father_first_name: names.father_first_name,
        father_middle_name: names.father_middle_name,
        father_last_name: names.father_last_name,
        date_of_birth: merged.date_of_birth,
        sex: merged.sex,
        city: merged.city,
        kebele: merged.kebele,
        house_number: optionalHouse(merged.house_number),
        nationality: merged.nationality,
        registration_date: merged.registration_date,
        ...(dto.status != null && { status: dto.status }),
      },
    });

    if (prev.child_person_id) {
      if (names.child_first_name && names.child_last_name) {
        await this.persons.updateStructuredPerson(prev.child_person_id, {
          first_name: names.child_first_name,
          middle_name: names.child_middle_name,
          last_name: names.child_last_name,
          nationality: merged.nationality,
          dateOfBirth: merged.date_of_birth,
          gender: merged.sex,
          city: merged.city,
          kebele: merged.kebele,
          houseNumber: optionalHouse(merged.house_number),
        });
      } else {
        await this.persons.updateFromFullName(prev.child_person_id, names.child_name, {
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
      action: 'UPDATE_BIRTH',
      entityType: 'Birth',
      entityId: id,
      actor: actor ?? dto.created_by ?? prev.created_by ?? null,
      details: JSON.stringify({ birth_regno: prev.birth_regno, patch: dto }),
    });

    return updated;
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

  async updateStatus(id: string, dto: UpdateBirthStatusDto, actor?: string | null) {
    const updated = await this.prisma.birth.update({
      where: { id },
      data: { status: dto.status },
    });
    await this.audit.log({
      action: 'UPDATE_BIRTH_STATUS',
      entityType: 'Birth',
      entityId: id,
      actor: actor ?? null,
      details: dto.status,
    });
    return updated;
  }
}
