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
import { DeathsService } from './deaths.service';
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathStatusDto } from './dto/update-death-status.dto';

@Controller('deaths')
export class DeathsController {
  constructor(private readonly deathsService: DeathsService) {}

  @Post()
  create(@Body() dto: CreateDeathDto) {
    return this.deathsService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.deathsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deathsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeathStatusDto,
  ) {
    return this.deathsService.updateStatus(id, dto);
  }
}
