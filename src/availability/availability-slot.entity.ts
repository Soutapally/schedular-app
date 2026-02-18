import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DoctorAvailability } from './doctor-availability.entity';

export enum SlotType {
  RECURRING = 'RECURRING',
  CUSTOM = 'CUSTOM',
}

@Entity('availability_slots')
export class AvailabilitySlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: number;

  @ManyToOne(() => DoctorAvailability, {
    onDelete: 'CASCADE',
    nullable: true, // only for recurring relation
  })
  @JoinColumn({ name: 'availabilityId' })
  availability: DoctorAvailability | null;

  @Column({
    type: 'enum',
    enum: SlotType,
    default: SlotType.RECURRING,
  })
  slotType: SlotType;

  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  bookedCount: number;
}
