import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DoctorAvailability } from './doctor-availability.entity';

@Entity('availability_slots')
export class AvailabilitySlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorAvailability, { onDelete: 'CASCADE' })
  availability: DoctorAvailability;

  @Column()
  date: string; // 2026-02-17

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  bookedCount: number;
}
