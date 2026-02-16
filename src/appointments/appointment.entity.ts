import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AvailabilitySlot } from '../availability/availability-slot.entity';
import { User } from '../users/user.entity'; // adjust path if needed

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AvailabilitySlot, { onDelete: 'CASCADE' })
  slot: AvailabilitySlot;

  @ManyToOne(() => User)
  patient: User;

  @Column({ default: 'BOOKED' })
  status: 'BOOKED' | 'CANCELLED';

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
