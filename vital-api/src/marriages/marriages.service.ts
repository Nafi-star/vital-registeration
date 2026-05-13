import { BadRequestException, Injectable } from '@nestjs/common';
import { Marriage } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarriageDto } from './dto/create-marriage.dto';
import { UpdateMarriageDto } from './dto/update-marriage.dto';
import { UpdateMarriageStatusDto } from './dto/update-marriage-status.dto';
import { AuditService } from '../audit/audit.service';
import { PersonsService } from '../persons/persons.service';
import { SequenceService } from '../lib/sequence.service';
import {
  approximateDobFromAgeAtDate,
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

type Party = 'husband' | 'wife';

@Injectable()
export class MarriagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly persons: PersonsService,
    private readonly sequences: SequenceService,
  ) {}

  private resolveParty(
    side: Party,
    dto: CreateMarriageDto,
  ): { full: string; first: string | null; middle: string | null; last: string | null } {
    const first = dto[`${side}_first_name`]?.trim();
    const last = dto[`${side}_last_name`]?.trim();
    const legacy = dto[`${side}_name`]?.trim();
    const middle = dto[`${side}_middle_name` as keyof CreateMarriageDto] as string | null | undefined;
    if (first && last) {
      assertNamePart(`${side} first name`, first);
      assertOptionalNamePart(`${side} middle name`, middle);
      assertNamePart(`${side} last name`, last);
      return {
        full: joinNameParts(first, middle, last),
        first,
        middle: trimOrNull(middle),
        last,
      };
    }
    if (legacy) {
      assertMaxLen(`${side} name`, legacy, 100);
      return { full: legacy, first: null, middle: null, last: null };
    }
    throw new BadRequestException(
      `Provide ${side} first and last name (middle optional) or a full ${side} name.`,
    );
  }

  private mergeMarriage(prev: Marriage, patch: UpdateMarriageDto): CreateMarriageDto {
    return {
      husband_first_name: coalesce(patch.husband_first_name, prev.husband_first_name),
      husband_middle_name: coalesce(patch.husband_middle_name, prev.husband_middle_name),
      husband_last_name: coalesce(patch.husband_last_name, prev.husband_last_name),
      husband_name: coalesce(patch.husband_name, prev.husband_name),
      husband_age: patch.husband_age ?? prev.husband_age,
      husband_nationality: patch.husband_nationality ?? prev.husband_nationality,
      wife_first_name: coalesce(patch.wife_first_name, prev.wife_first_name),
      wife_middle_name: coalesce(patch.wife_middle_name, prev.wife_middle_name),
      wife_last_name: coalesce(patch.wife_last_name, prev.wife_last_name),
      wife_name: coalesce(patch.wife_name, prev.wife_name),
      wife_age: patch.wife_age ?? prev.wife_age,
      wife_nationality: patch.wife_nationality ?? prev.wife_nationality,
      date_of_marriage: patch.date_of_marriage ?? prev.date_of_marriage,
      city: patch.city ?? prev.city,
      kebele: patch.kebele ?? prev.kebele,
      house_number: patch.house_number !== undefined ? patch.house_number : prev.house_number,
      registration_date: patch.registration_date ?? prev.registration_date,
      created_by: patch.created_by ?? prev.created_by ?? undefined,
    };
  }

  async create(dto: CreateMarriageDto) {
    assertIsoDate('date_of_marriage', dto.date_of_marriage);
    assertIsoDate('registration_date', dto.registration_date);
    assertMaxLen('husband_nationality', dto.husband_nationality, 15);
    assertMaxLen('wife_nationality', dto.wife_nationality, 15);

    const h = this.resolveParty('husband', dto);
    const w = this.resolveParty('wife', dto);
    const marriage_regno = await this.sequences.nextMarriageRegno();

    const husbandDob = approximateDobFromAgeAtDate(dto.husband_age, dto.date_of_marriage);
    const wifeDob = approximateDobFromAgeAtDate(dto.wife_age, dto.date_of_marriage);

    const husband = h.first
      ? await this.persons.createFromStructured({
          first_name: h.first,
          middle_name: h.middle,
          last_name: h.last!,
          nationality: dto.husband_nationality,
          dateOfBirth: husbandDob,
          gender: 'Male',
          city: dto.city,
          kebele: dto.kebele,
          houseNumber: optionalHouse(dto.house_number),
        })
      : await this.persons.createFromFullName({
          fullName: h.full,
          nationality: dto.husband_nationality,
          dateOfBirth: husbandDob,
          gender: 'Male',
          city: dto.city,
          kebele: dto.kebele,
          houseNumber: optionalHouse(dto.house_number),
        });

    const wife = w.first
      ? await this.persons.createFromStructured({
          first_name: w.first,
          middle_name: w.middle,
          last_name: w.last!,
          nationality: dto.wife_nationality,
          dateOfBirth: wifeDob,
          gender: 'Female',
          city: dto.city,
          kebele: dto.kebele,
          houseNumber: optionalHouse(dto.house_number),
        })
      : await this.persons.createFromFullName({
          fullName: w.full,
          nationality: dto.wife_nationality,
          dateOfBirth: wifeDob,
          gender: 'Female',
          city: dto.city,
          kebele: dto.kebele,
          houseNumber: optionalHouse(dto.house_number),
        });

    const created = await this.prisma.marriage.create({
      data: {
        marriage_regno,
        husband_name: h.full,
        husband_first_name: h.first,
        husband_middle_name: h.middle,
        husband_last_name: h.last,
        husband_age: dto.husband_age,
        husband_nationality: dto.husband_nationality,
        wife_name: w.full,
        wife_first_name: w.first,
        wife_middle_name: w.middle,
        wife_last_name: w.last,
        wife_age: dto.wife_age,
        wife_nationality: dto.wife_nationality,
        date_of_marriage: dto.date_of_marriage,
        city: dto.city,
        kebele: dto.kebele,
        house_number: optionalHouse(dto.house_number),
        registration_date: dto.registration_date,
        created_by: dto.created_by ?? null,
        status: 'Pending',
        husband_person_id: husband.id,
        wife_person_id: wife.id,
      },
    });

    await this.audit.log({
      action: 'CREATE_MARRIAGE',
      entityType: 'Marriage',
      entityId: created.id,
      actor: dto.created_by ?? null,
      details: JSON.stringify({ marriage_regno }),
    });

    return created;
  }

  async update(id: string, dto: UpdateMarriageDto, actor?: string | null) {
    const prev = await this.findOne(id);
    const merged = this.mergeMarriage(prev, dto);
    const h = this.resolveParty('husband', merged);
    const w = this.resolveParty('wife', merged);

    const updated = await this.prisma.marriage.update({
      where: { id },
      data: {
        husband_name: h.full,
        husband_first_name: h.first,
        husband_middle_name: h.middle,
        husband_last_name: h.last,
        husband_age: merged.husband_age,
        husband_nationality: merged.husband_nationality,
        wife_name: w.full,
        wife_first_name: w.first,
        wife_middle_name: w.middle,
        wife_last_name: w.last,
        wife_age: merged.wife_age,
        wife_nationality: merged.wife_nationality,
        date_of_marriage: merged.date_of_marriage,
        city: merged.city,
        kebele: merged.kebele,
        house_number: optionalHouse(merged.house_number),
        registration_date: merged.registration_date,
        ...(dto.status != null && { status: dto.status }),
      },
    });

    const husbandDob = approximateDobFromAgeAtDate(merged.husband_age, merged.date_of_marriage);
    const wifeDob = approximateDobFromAgeAtDate(merged.wife_age, merged.date_of_marriage);

    if (prev.husband_person_id) {
      if (h.first && h.last) {
        await this.persons.updateStructuredPerson(prev.husband_person_id, {
          first_name: h.first,
          middle_name: h.middle,
          last_name: h.last,
          nationality: merged.husband_nationality,
          dateOfBirth: husbandDob,
          gender: 'Male',
          city: merged.city,
          kebele: merged.kebele,
          houseNumber: optionalHouse(merged.house_number),
        });
      } else {
        await this.persons.updateFromFullName(prev.husband_person_id, h.full, {
          nationality: merged.husband_nationality,
          dateOfBirth: husbandDob,
          gender: 'Male',
          city: merged.city,
          kebele: merged.kebele,
          houseNumber: optionalHouse(merged.house_number),
        });
      }
    }
    if (prev.wife_person_id) {
      if (w.first && w.last) {
        await this.persons.updateStructuredPerson(prev.wife_person_id, {
          first_name: w.first,
          middle_name: w.middle,
          last_name: w.last,
          nationality: merged.wife_nationality,
          dateOfBirth: wifeDob,
          gender: 'Female',
          city: merged.city,
          kebele: merged.kebele,
          houseNumber: optionalHouse(merged.house_number),
        });
      } else {
        await this.persons.updateFromFullName(prev.wife_person_id, w.full, {
          nationality: merged.wife_nationality,
          dateOfBirth: wifeDob,
          gender: 'Female',
          city: merged.city,
          kebele: merged.kebele,
          houseNumber: optionalHouse(merged.house_number),
        });
      }
    }

    await this.audit.log({
      action: 'UPDATE_MARRIAGE',
      entityType: 'Marriage',
      entityId: id,
      actor: actor ?? dto.created_by ?? prev.created_by ?? null,
      details: JSON.stringify({ marriage_regno: prev.marriage_regno, patch: dto }),
    });

    return updated;
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

  async updateStatus(id: string, dto: UpdateMarriageStatusDto, actor?: string | null) {
    const updated = await this.prisma.marriage.update({
      where: { id },
      data: { status: dto.status },
    });
    await this.audit.log({
      action: 'UPDATE_MARRIAGE_STATUS',
      entityType: 'Marriage',
      entityId: id,
      actor: actor ?? null,
      details: dto.status,
    });
    return updated;
  }
}
