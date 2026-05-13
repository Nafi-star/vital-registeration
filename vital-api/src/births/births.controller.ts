import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { BirthsService } from './births.service';
import { CreateBirthDto } from './dto/create-birth.dto';
import type { UpdateBirthDto } from './dto/update-birth.dto';
import { UpdateBirthStatusDto } from './dto/update-birth-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import type { AdminJwtUser } from '../auth/jwt-user';

@Controller('births')
export class BirthsController {
  constructor(private readonly birthsService: BirthsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() user: AdminJwtUser, @Body() dto: CreateBirthDto) {
    return this.birthsService.create({
      ...dto,
      created_by: user.username,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('status') status?: string) {
    return this.birthsService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.birthsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @User() user: AdminJwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBirthStatusDto,
  ) {
    return this.birthsService.updateStatus(id, dto, user.username);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @User() user: AdminJwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.birthsService.update(id, dto as UpdateBirthDto, user.username);
  }
}
