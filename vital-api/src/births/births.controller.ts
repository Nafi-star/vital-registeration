import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BirthsService } from './births.service';
import { CreateBirthDto } from './dto/create-birth.dto';
import { UpdateBirthStatusDto } from './dto/update-birth-status.dto';

@Controller('births')
export class BirthsController {
  constructor(private readonly birthsService: BirthsService) {}

  @Post()
  create(@Body() dto: CreateBirthDto) {
    return this.birthsService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.birthsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.birthsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBirthStatusDto,
  ) {
    return this.birthsService.updateStatus(id, dto);
  }
}
