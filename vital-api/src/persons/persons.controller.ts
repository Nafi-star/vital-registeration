import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('persons')
@UseGuards(JwtAuthGuard)
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get('search')
  search(@Query('q') q?: string) {
    return this.personsService.searchByNameOrId(q ?? '');
  }

  @Get(':personPublicId/history')
  history(@Param('personPublicId') personPublicId: string) {
    return this.personsService.getHistoryByPublicId(personPublicId);
  }
}
