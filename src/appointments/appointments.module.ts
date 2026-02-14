import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AvailabilitySlot } from '../availability/availability-slot.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, AvailabilitySlot]), DoctorsModule],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
