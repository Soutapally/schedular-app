//Patient service provides the logic for the patient onboarding.

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from './patient.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async completeOnboarding(
    userId: number,
    dto: any,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('User ID from JWT:', userId);
console.log('User Profile Status:', user?.isProfileCompleted);


    if (user.isProfileCompleted) {
      throw new BadRequestException(
        'Profile already completed',
      );
    }

    const patient = this.patientRepo.create({
      ...dto,
      user,
    });

    await this.patientRepo.save(patient);

    user.isProfileCompleted = true;
    await this.userRepo.save(user);

    return {
      message: 'Patient onboarding completed successfully',
    };
  }
}
