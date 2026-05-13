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
import { MarriagesService } from './marriages.service';
import { CreateMarriageDto } from './dto/create-marriage.dto';
import type { UpdateMarriageDto } from './dto/update-marriage.dto';
import { UpdateMarriageStatusDto } from './dto/update-marriage-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import type { AdminJwtUser } from '../auth/jwt-user';

@Controller('marriages')
export class MarriagesController {
  constructor(private readonly marriagesService: MarriagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() user: AdminJwtUser, @Body() dto: CreateMarriageDto) {
    return this.marriagesService.create({
      ...dto,
      created_by: user.username,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('status') status?: string) {
    return this.marriagesService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.marriagesService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @User() user: AdminJwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMarriageStatusDto,
  ) {
    return this.marriagesService.updateStatus(id, dto, user.username);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @User() user: AdminJwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.marriagesService.update(id, dto as UpdateMarriageDto, user.username);
  }
}
