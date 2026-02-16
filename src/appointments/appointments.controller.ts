//Appointment controller will provides you the endpoints to book an appointment, cancel an appointment,
//and patients and doctor an view their upcoming appointments.


import {
  Controller,
  Post,
  Delete,
  Get,
  Put,
  Body,
  Req,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  // BOOK APPOINTMENT
  @Post()
  book(@Req() req, @Body() dto: BookAppointmentDto) {
    return this.service.bookAppointment(req.user.id, dto);
  }

  // CANCEL APPOINTMENT
  @Delete(':id')
  cancel(@Req() req, @Param('id') id: number) {
    return this.service.cancelAppointment(req.user.id, id);
  }


  // PATIENT VIEW
  @Get('patient')
  myAppointments(
    @Req() req,
    @Query('date') date?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getPatientAppointments(req.user.id, date, status);
  }

 
  // DOCTOR VIEW
  @Get('doctor')
  doctorAppointments(
    @Req() req,
    @Query('date') date?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getDoctorAppointments(req.user.id, date, status);
  }

  // RESCHEDULE APPOINTMENT
  @Put(':id/reschedule')
  reschedule(
    @Req() req,
    @Param('id') id: number,
    @Body('newSlotId') newSlotId: number,
  ) {
    return this.service.rescheduleAppointment(req.user.id, id, newSlotId);
  }
}
