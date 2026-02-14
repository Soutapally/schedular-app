//Availability service provides the logic of recurring availability schedules for doctors by 
// creating the subslots checks the overlap conditions and updates the availability.

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { DoctorAvailability } from './doctor-availability.entity';
import { AvailabilitySlot } from './availability-slot.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { SetAvailabilityDto } from './dto/set-availability.dto';

type SlotTime = {
  startTime: string;
  endTime: string;
};

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(DoctorAvailability)
    private readonly repo: Repository<DoctorAvailability>,

    @InjectRepository(AvailabilitySlot)
    private readonly slotRepo: Repository<AvailabilitySlot>,

    private readonly doctorsService: DoctorsService,
  ) {}

  // CREATE AVAILABILITY
  async setAvailability(userId: number, dto: SetAvailabilityDto) {
    const doctor = await this.doctorsService.findByUserId(userId);
    if (!doctor) throw new NotFoundException('Doctor not found');

    const results: DoctorAvailability[] = [];

    for (const day of dto.days) {
      await this.checkOverlap(doctor.id, day, dto.startTime, dto.endTime);

      const availability = this.repo.create({
        doctor,
        day,
        startTime: dto.startTime,
        endTime: dto.endTime,
        slotDuration: dto.slotDuration,
        maxPatientsPerSlot: dto.maxPatientsPerSlot,
      });

      const savedAvailability = await this.repo.save(availability);

      const slots = this.generateSlots(
        dto.startTime,
        dto.endTime,
        dto.slotDuration,
      );

      await this.createSlotsForNextDays(
        savedAvailability,
        slots,
        dto.maxPatientsPerSlot,
      );

      results.push(savedAvailability);
    }

    return results;
  }

  // GET DOCTOR AVAILABILITY
  async getDoctorAvailability(doctorId: number) {
    return this.repo.find({
      where: { doctor: { id: doctorId } },
      relations: ['doctor'],
    });
  }

  // UPDATE AVAILABILITY
  async updateAvailability(id: number, dto: SetAvailabilityDto) {
    const availability = await this.repo.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!availability) throw new NotFoundException('Availability not found');

    await this.checkOverlap(
      availability.doctor.id,
      availability.day,
      dto.startTime,
      dto.endTime,
    );

    Object.assign(availability, dto);
    await this.repo.save(availability);

    const today = new Date().toISOString().split('T')[0];

    // delete future slots
    await this.slotRepo.delete({
      availability: { id },
      date: MoreThanOrEqual(today),
    });

    const slots = this.generateSlots(
      dto.startTime,
      dto.endTime,
      dto.slotDuration,
    );

    await this.createSlotsForNextDays(
      availability,
      slots,
      dto.maxPatientsPerSlot,
    );

    return availability;
  }


  // DELETE AVAILABILITY
  async deleteAvailability(id: number) {
    const availability = await this.repo.findOne({ where: { id } });
    if (!availability) throw new NotFoundException();

    await this.slotRepo.delete({ availability: { id } });
    await this.repo.delete(id);

    return { message: 'Availability deleted successfully' };
  }

  // GET SLOTS
  async getSlots(doctorId: number, date: string) {
    const slots = await this.slotRepo
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.availability', 'availability')
      .leftJoinAndSelect('availability.doctor', 'doctor')
      .where('doctor.id = :doctorId', { doctorId })
      .andWhere('slot.date = :date', { date })
      .getMany();

    return slots.map((s) => ({
      slotId: s.id,
      time: `${s.startTime}-${s.endTime}`,
      available: s.capacity - s.bookedCount,
    }));
  }


  // SLOT DETAILS
  async getSlotDetails(slotId: number) {
    const slot = await this.slotRepo.findOne({
      where: { id: slotId },
      relations: ['availability', 'availability.doctor'],
    });

    if (!slot) throw new NotFoundException('Slot not found');

    return {
      slotId: slot.id,
      doctorId: slot.availability.doctor.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      bookedCount: slot.bookedCount,
      availableSpots: slot.capacity - slot.bookedCount,
    };
  }

//DELETE SLOTS OF THE LOGGED- IN USER 
  async deleteSlot(userId: number, slotId: number) {
  const doctor = await this.doctorsService.findByUserId(userId);
  if (!doctor) throw new NotFoundException('Doctor not found');

  const slot = await this.slotRepo.findOne({
    where: { id: slotId },
    relations: ['availability', 'availability.doctor'],
  });

  if (!slot) throw new NotFoundException('Slot not found');

  if (slot.availability.doctor.id !== doctor.id) {
    throw new BadRequestException('Not your slot');
  }

  if (slot.bookedCount > 0) {
    throw new BadRequestException('Cannot delete slot with bookings');
  }

  await this.slotRepo.delete(slotId);

  return { message: 'Slot deleted successfully' };
}

  // OVERLAP CHECK

  async checkOverlap(
    doctorId: number,
    day: string,
    start: string,
    end: string,
  ): Promise<void> {
    const existing = await this.repo
      .createQueryBuilder('a')
      .where('a.doctorId = :doctorId', { doctorId })
      .andWhere('a.day = :day', { day })
      .andWhere('a.startTime < :end AND a.endTime > :start', {
        start,
        end,
      })
      .getOne();

    if (existing) {
      throw new BadRequestException(
        'Availability overlaps with existing schedule',
      );
    }
  }


  // TIME HELPERS
  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private toTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}`;
  }

  // SLOT GENERATION
  generateSlots(start: string, end: string, duration: number): SlotTime[] {
    const slots: SlotTime[] = [];

    let current: number = this.toMinutes(start);
    const endMin = this.toMinutes(end);

    while (current + duration <= endMin) {
      slots.push({
        startTime: this.toTime(current),
        endTime: this.toTime(current + duration),
      });
      current += duration;
    }

    return slots;
  }

  // CREATE FUTURE SLOTS
  async createSlotsForNextDays(
    availability: DoctorAvailability,
    slots: SlotTime[],
    capacity: number,
  ): Promise<void> {
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      const dayName = date
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toUpperCase();

      if (dayName !== availability.day) continue;

      for (const slot of slots) {
        await this.slotRepo.save({
          availability,
          date: date.toISOString().split('T')[0],
          startTime: slot.startTime,
          endTime: slot.endTime,
          capacity,
          bookedCount: 0,
        });
      }
    }
  }

  // GET MY AVAILABILITY
  async getMyAvailability(userId: number) {
    const doctor = await this.doctorsService.findByUserId(userId);
    if (!doctor) throw new NotFoundException('Doctor not found');

    return this.repo.find({
      where: { doctor: { id: doctor.id } },
      relations: ['doctor'],
    });
  }

  
}
