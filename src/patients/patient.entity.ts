import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User, user => user.patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
