//Registers the availability entity, service, controller, and connects it with the Doctors 
// module.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorAvailability } from './doctor-availability.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { DoctorsModule } from '../doctors/doctors.module';
import { AvailabilitySlot } from './availability-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorAvailability, AvailabilitySlot]),
    DoctorsModule,
  ],
  providers: [AvailabilityService],
  controllers: [AvailabilityController],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
