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
import { DivorcesService } from './divorces.service';
import { CreateDivorceDto } from './dto/create-divorce.dto';
import { UpdateDivorceStatusDto } from './dto/update-divorce-status.dto';

@Controller('divorces')
export class DivorcesController {
  constructor(private readonly divorcesService: DivorcesService) {}

  @Post()
  create(@Body() dto: CreateDivorceDto) {
    return this.divorcesService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.divorcesService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.divorcesService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDivorceStatusDto,
  ) {
    return this.divorcesService.updateStatus(id, dto);
  }
}
