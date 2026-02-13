import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Patient } from './patient.entity';
import { User } from '../users/user.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, User])],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
