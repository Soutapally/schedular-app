import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorStatus } from './doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  async findByUserId(userId: number): Promise<Doctor | null> {
    return this.doctorRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async approveDoctor(doctorId: number) {
    const doctor = await this.doctorRepo.findOneBy({ id: doctorId });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.status = DoctorStatus.APPROVED;
    return this.doctorRepo.save(doctor);
  }
}
