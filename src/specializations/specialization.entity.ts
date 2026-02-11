//Defines the specializations database table with a unique name field and auto-generated id.

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('specializations')
export class Specialization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
