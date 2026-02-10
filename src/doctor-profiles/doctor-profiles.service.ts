import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async upsertProfile(
    userId: number,
    data: CreateDoctorProfileDto,
  ) {
    const doctor = await this.doctorsService.findByUserId(userId);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.status !== DoctorStatus.PENDING) {
      throw new ForbiddenException(
        'Profile already submitted or doctor already verified',
      );
    }

    let profile = await this.profileRepo.findOne({
      where: { doctor: { id: doctor.id } },
      relations: ['doctor'],
    });

    if (!profile) {
      profile = this.profileRepo.create({
        doctor,
        experience: data.experience,
        licenseNo: data.licenseNo,
        fee: data.fee,
        specialization: data.specialization,
      });
    } else {
      profile.experience = data.experience;
      profile.licenseNo = data.licenseNo;
      profile.fee = data.fee;
      profile.specialization = data.specialization;
    }

    return this.profileRepo.save(profile);
  }

  // ✅ THIS WAS MISSING
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
