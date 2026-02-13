//This service creates or updates a doctor’s profile (only if they are in PENDING status) 
// by validating specializations and saving the profile, and also allows the doctor to fetch
//  their own profile.
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DoctorProfile } from './doctor-profile.entity';
import { DoctorStatus } from '../doctors/doctor.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';

@Injectable()
export class DoctorProfilesService {
  constructor(
    @InjectRepository(DoctorProfile)
    private readonly profileRepo: Repository<DoctorProfile>,
    private readonly doctorsService: DoctorsService,
  ) {}

  async upsertProfile(userId: number, dto: CreateDoctorProfileDto) {
    const doctor = await this.doctorsService.findByUserId(userId);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.status !== DoctorStatus.PENDING) {
      throw new ForbiddenException(
        'Doctor profile already submitted or verified',
      );
    }

    if (!dto.specializations || dto.specializations.length === 0) {
      throw new BadRequestException('At least one specialization is required');
    }

    let profile = await this.profileRepo.findOne({
      where: { doctor: { id: doctor.id } },
      relations: ['doctor'],
    });

    if (!profile) {
      profile = this.profileRepo.create({
        doctor,
        experience: dto.experience,
        specializations: dto.specializations,
      });
    } else {
      profile.experience = dto.experience;
      profile.specializations = dto.specializations;
    }

    return this.profileRepo.save(profile);
  }

  async getMyProfile(userId: number) {
    const doctor = await this.doctorsService.findByUserId(userId);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const profile = await this.profileRepo.findOne({
      where: { doctor: { id: doctor.id } },
      relations: ['doctor'],
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return profile;
  }
}
