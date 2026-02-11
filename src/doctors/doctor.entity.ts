import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Specialization } from '../specializations/specialization.entity';

export enum DoctorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: DoctorStatus,
    default: DoctorStatus.PENDING,
  })
  status: DoctorStatus;

  // ✅ MANY DOCTORS → MANY SPECIALIZATIONS
  @ManyToMany(() => Specialization, { eager: true })
  @JoinTable({
    name: 'doctor_specializations',
    joinColumn: { name: 'doctor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'specialization_id', referencedColumnName: 'id' },
  })
  specializations: Specialization[];
}
