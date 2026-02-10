import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorAvailability } from './doctor-availability.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { SetAvailabilityDto } from './dto/set-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(DoctorAvailability)
    private readonly repo: Repository<DoctorAvailability>,
    private readonly doctorsService: DoctorsService,
  ) {}

  async setAvailability(userId: number, dto: SetAvailabilityDto) {
    const doctor = await this.doctorsService.findByUserId(userId);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const availability = this.repo.create({
      doctor,
      day: dto.day,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    return this.repo.save(availability);
  }

  async getMyAvailability(userId: number) {
    const doctor = await this.doctorsService.findByUserId(userId);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.repo.find({
      where: { doctor: { id: doctor.id } },
      relations: ['doctor'],
    });
  }
}
