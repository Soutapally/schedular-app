//Provides JWT-protected endpoints for doctors to set their availability and fetch 
// their own availability.

import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AvailabilityService } from './availability.service';
import { SetAvailabilityDto } from './dto/set-availability.dto';

@UseGuards(JwtAuthGuard)
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}

  @Post()
  setAvailability(@Req() req, @Body() dto: SetAvailabilityDto) {
    return this.service.setAvailability(req.user.id, dto);
  }

  @Get('me')
  getMyAvailability(@Req() req) {
    return this.service.getMyAvailability(req.user.id);
  }
}
