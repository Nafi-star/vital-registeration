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
import { DivorcesService } from './divorces.service';
import { CreateDivorceDto } from './dto/create-divorce.dto';
import type { UpdateDivorceDto } from './dto/update-divorce.dto';
import { UpdateDivorceStatusDto } from './dto/update-divorce-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import type { AdminJwtUser } from '../auth/jwt-user';

@Controller('divorces')
export class DivorcesController {
  constructor(private readonly divorcesService: DivorcesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() user: AdminJwtUser, @Body() dto: CreateDivorceDto) {
    return this.divorcesService.create({
      ...dto,
      created_by: user.username,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('status') status?: string) {
    return this.divorcesService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.divorcesService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @User() user: AdminJwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDivorceStatusDto,
  ) {
    return this.divorcesService.updateStatus(id, dto, user.username);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @User() user: AdminJwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.divorcesService.update(id, dto as UpdateDivorceDto, user.username);
  }
}
