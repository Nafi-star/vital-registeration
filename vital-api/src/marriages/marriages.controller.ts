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
import { MarriagesService } from './marriages.service';
import { CreateMarriageDto } from './dto/create-marriage.dto';
import { UpdateMarriageStatusDto } from './dto/update-marriage-status.dto';

@Controller('marriages')
export class MarriagesController {
  constructor(private readonly marriagesService: MarriagesService) {}

  @Post()
  create(@Body() dto: CreateMarriageDto) {
    return this.marriagesService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.marriagesService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.marriagesService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMarriageStatusDto,
  ) {
    return this.marriagesService.updateStatus(id, dto);
  }
}
