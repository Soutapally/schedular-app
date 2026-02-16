//Appointment service will provides you the logic for the booking,rescheduling am appointment,

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { AvailabilitySlot } from '../availability/availability-slot.entity';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,

    @InjectRepository(AvailabilitySlot)
    private readonly slotRepo: Repository<AvailabilitySlot>,

    private readonly doctorsService: DoctorsService,
  ) {}

  // BOOK APPOINTMENT
  async bookAppointment(userId: number, dto: BookAppointmentDto) {
    const slot = await this.slotRepo.findOne({ where: { id: dto.slotId } });
    if (!slot) throw new NotFoundException('Slot not found');

    if (slot.bookedCount >= slot.capacity) {
      throw new BadRequestException('Slot is full');
    }

    const existing = await this.repo.findOne({
      where: {
        slot: { id: dto.slotId },
        patient: { id: userId },
        status: 'BOOKED',
      },
    });

    if (existing) {
      throw new BadRequestException('Already booked this slot');
    }

    const appointment = this.repo.create({
      slot,
      patient: { id: userId } as any,
    });

    await this.repo.save(appointment);

    slot.bookedCount += 1;
    await this.slotRepo.save(slot);

    return {
      message: 'Appointment booked successfully',
      appointmentId: appointment.id,
    };
  }

  // CANCEL APPOINTMENT
  async cancelAppointment(userId: number, appointmentId: number) {
    const appointment = await this.repo.findOne({
      where: { id: appointmentId },
      relations: ['slot', 'patient'],
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (appointment.patient.id !== userId) {
      throw new BadRequestException('Not your appointment');
    }

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException('Already cancelled');
    }

    appointment.status = 'CANCELLED';
    await this.repo.save(appointment);

    appointment.slot.bookedCount -= 1;
    await this.slotRepo.save(appointment.slot);

    return { message: 'Appointment cancelled successfully' };
  }

  // PATIENT APPOINTMENTS
  async getPatientAppointments(
    userId: number,
    date?: string,
    status?: string,
  ) {
    const qb = this.repo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.slot', 'slot')
      .leftJoinAndSelect('slot.availability', 'availability')
      .leftJoinAndSelect('availability.doctor', 'doctor')
      .where('appointment.patientId = :userId', { userId });

    if (date) {
      qb.andWhere('slot.date = :date', { date });
    }

    if (status === 'upcoming') {
      qb.andWhere('slot.date >= :today', {
        today: new Date().toISOString().split('T')[0],
      });
    }

    return qb.getMany();
  }

  // DOCTOR APPOINTMENTS
  async getDoctorAppointments(
    userId: number,
    date?: string,
    status?: string,
  ) {
    const doctor = await this.doctorsService.findByUserId(userId);
    if (!doctor) throw new NotFoundException('Doctor not found');

    const qb = this.repo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.slot', 'slot')
      .leftJoinAndSelect('slot.availability', 'availability')
      .leftJoinAndSelect('availability.doctor', 'doctor')
      .where('availability.doctorId = :doctorId', { doctorId: doctor.id });

    if (date) {
      qb.andWhere('slot.date = :date', { date });
    }

    if (status === 'upcoming') {
      qb.andWhere('slot.date >= :today', {
        today: new Date().toISOString().split('T')[0],
      });
    }

    return qb.getMany();
  }

  // RESCHEDULE
  async rescheduleAppointment(
    userId: number,
    appointmentId: number,
    newSlotId: number,
  ) {
    const appointment = await this.repo.findOne({
      where: { id: appointmentId },
      relations: ['slot', 'patient'],
    });

    if (!appointment) throw new NotFoundException();

    if (appointment.patient.id !== userId) {
      throw new BadRequestException('Not your appointment');
    }

    const newSlot = await this.slotRepo.findOne({
      where: { id: newSlotId },
    });

    if (!newSlot) throw new NotFoundException('New slot not found');

    if (newSlot.bookedCount >= newSlot.capacity) {
      throw new BadRequestException('New slot is full');
    }

    // decrement old slot
    appointment.slot.bookedCount -= 1;
    await this.slotRepo.save(appointment.slot);

    // assign new slot
    appointment.slot = newSlot;
    await this.repo.save(appointment);

    // increment new slot
    newSlot.bookedCount += 1;
    await this.slotRepo.save(newSlot);

    return { message: 'Appointment rescheduled successfully' };
  }
}
