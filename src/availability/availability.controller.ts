//Availability controller provides api calls for creating an availability by doctors,updating the availabilities,
//getting the slot details of the availability

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AvailabilityService } from './availability.service';
import { SetAvailabilityDto } from './dto/set-availability.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}

  // CREATE AVAILABILITY
  @Post('availability')
  setAvailability(@Req() req, @Body() dto: SetAvailabilityDto) {
    return this.service.setAvailability(req.user.id, dto);
  }

  // GET MY AVAILABILITY
  @Get('availability/me')
  getMyAvailability(@Req() req) {
    return this.service.getMyAvailability(req.user.id);
  }


  // GET AVAILABILITY BY DOCTOR
  @Get('availability')
  getDoctorAvailability(@Query('doctorId') doctorId: number) {
    return this.service.getDoctorAvailability(doctorId);
  }

  // UPDATE AVAILABILITY
  @Put('availability/:id')
  updateAvailability(
    @Param('id') id: number,
    @Body() dto: SetAvailabilityDto,
  ) {
    return this.service.updateAvailability(id, dto);
  }

  // DELETE AVAILABILITY
  @Delete('availability/:id')
  deleteAvailability(@Param('id') id: number) {
    return this.service.deleteAvailability(id);
  }

  
  // GET SLOTS FOR DATE
  @Get('availability/slots')
  getSlots(
    @Query('doctorId') doctorId: number,
    @Query('date') date: string,
  ) {
    return this.service.getSlots(doctorId, date);
  }

  // GET SLOT DETAILS
  @Get('availability/slots/:slotId')
  getSlotDetails(@Param('slotId') slotId: number) {
    return this.service.getSlotDetails(slotId);
  }


  // DELETE SLOT
  @Delete('availability/slots/:slotId')
  deleteSlot(@Req() req, @Param('slotId') slotId: number) {
    return this.service.deleteSlot(req.user.id, slotId);
  }

}
