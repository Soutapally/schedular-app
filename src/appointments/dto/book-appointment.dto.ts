import { IsNumber } from 'class-validator';

export class BookAppointmentDto {
  @IsNumber()
  slotId: number;
}
