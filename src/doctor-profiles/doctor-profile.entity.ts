//Doctor profile entity stores the details of the doctor like experience, fee, license no, 
// specilizations.

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

@Entity('doctor_profiles')
export class DoctorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column()
  experience: number;

@Column('text', { array: true, nullable: true })
specializations: string[];

  @Column({ default: false })
  isVerified: boolean;
}
