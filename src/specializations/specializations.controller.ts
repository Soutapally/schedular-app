//Exposes API endpoints to create a specialization and retrieve all specializations.

import { Controller, Post, Body, Get } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';

@Controller('specializations')
export class SpecializationsController {
  constructor(private readonly service: SpecializationsService) {}

  @Post()
  create(@Body() dto: CreateSpecializationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
