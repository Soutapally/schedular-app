import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

@Entity('doctor_custom_availability')
export class DoctorCustomAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column()
  date: string; // 2026-03-10

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  slotDuration: number;

  @Column()
  maxPatientsPerSlot: number;
}
