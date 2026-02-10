import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
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

  @Column({ length: 50 })
  licenseNo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee: number;

  @Column()
  specialization: string;

  @Column({ default: false })
  isVerified: boolean;
}
