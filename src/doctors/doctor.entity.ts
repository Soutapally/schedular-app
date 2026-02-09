import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('doctor')
export class Doctor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User, user => user.doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  experience: number;

  @Column({ length: 50, nullable: true })
  licenseNo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fee: number;
}
