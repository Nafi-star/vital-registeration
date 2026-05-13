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
import { DeathsService } from './deaths.service';
import { CreateDeathDto } from './dto/create-death.dto';
import type { UpdateDeathDto } from './dto/update-death.dto';
import { UpdateDeathStatusDto } from './dto/update-death-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import type { AdminJwtUser } from '../auth/jwt-user';

@Controller('deaths')
export class DeathsController {
  constructor(private readonly deathsService: DeathsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() user: AdminJwtUser, @Body() dto: CreateDeathDto) {
    return this.deathsService.create({
      ...dto,
      created_by: user.username,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('status') status?: string) {
    return this.deathsService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deathsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @User() user: AdminJwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeathStatusDto,
  ) {
    return this.deathsService.updateStatus(id, dto, user.username);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @User() user: AdminJwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.deathsService.update(id, dto as UpdateDeathDto, user.username);
  }
}
