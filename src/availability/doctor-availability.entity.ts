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
  startTime: string;

  @Column()
  endTime: string;

 @Column({ nullable: true })
slotDuration: number;


  @Column({ nullable: true })
  maxPatientsPerSlot: number;
}
