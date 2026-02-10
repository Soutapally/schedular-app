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
import { Specialization } from '../specializations/specialization.entity';

@Injectable()
export class DoctorProfilesService {
  constructor(
    @InjectRepository(DoctorProfile)
    private readonly profileRepo: Repository<DoctorProfile>,

    @InjectRepository(Specialization)
    private readonly specializationRepo: Repository<Specialization>,

    private readonly doctorsService: DoctorsService,
  ) {}

  async upsertProfile(userId: number, dto: CreateDoctorProfileDto) {
    const doctor = await this.doctorsService.findByUserId(userId);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.status !== DoctorStatus.PENDING) {
      throw new ForbiddenException('Profile already submitted');
    }

    // ✅ Fetch specializations
    const specializations = await this.specializationRepo.findBy({
      id: dto.specializationIds as any,
    });

    let profile = await this.profileRepo.findOne({
      where: { doctor: { id: doctor.id } },
      relations: ['doctor', 'specializations'],
    });

    if (!profile) {
      profile = this.profileRepo.create({
        doctor,
        experience: dto.experience,
        fee: dto.fee,
        specializations,
      });
    } else {
      profile.experience = dto.experience;
      profile.fee = dto.fee;
      profile.specializations = specializations;
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
      relations: ['doctor', 'specializations'],
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return profile;
  }
}
