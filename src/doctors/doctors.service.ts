import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorStatus } from './doctor.entity';
import { DoctorProfile } from '../doctor-profiles/doctor-profile.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,

    @InjectRepository(DoctorProfile)
    private readonly profileRepo: Repository<DoctorProfile>,
  ) {}

  // ✅ Used by DoctorProfilesService
  async findByUserId(userId: number): Promise<Doctor | null> {
  return this.doctorRepo.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });
}


  // ✅ Admin approval flow
  async approveDoctor(doctorId: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { id: doctorId },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // 1️⃣ Approve doctor
    doctor.status = DoctorStatus.APPROVED;
    await this.doctorRepo.save(doctor);

    // 2️⃣ Verify doctor profile
    await this.profileRepo.update(
      { doctor: { id: doctor.id } },
      { isVerified: true },
    );

    return {
      message: 'Doctor approved successfully',
      doctorId: doctor.id,
    };
  }
}
