import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorProfile } from './doctor-profile.entity';
import { DoctorProfilesService } from './doctor-profiles.service';
import { DoctorProfilesController } from './doctor-profiles.controller';
import { DoctorsModule } from '../doctors/doctors.module';
import { Specialization } from 'src/specializations/specialization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorProfile, Specialization]),
    DoctorsModule,
  ],
  providers: [DoctorProfilesService],
  controllers: [DoctorProfilesController],
})
export class DoctorProfilesModule {}
