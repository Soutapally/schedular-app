//Defines the doctor_availability table storing a doctor’s available day and time slots
//  linked to the Doctor entity.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

@Entity('doctor_availability')
export class DoctorAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column()
  day: string; // MONDAY

  @Column()
  startTime: string; // 09:00

  @Column()
  endTime: string; // 13:00
}
