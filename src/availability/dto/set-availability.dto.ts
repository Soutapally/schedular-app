import { IsArray, IsInt, IsString, Min } from 'class-validator';

export class SetAvailabilityDto {
  @IsArray()
  days: string[]; // ["MONDAY", "TUESDAY"]

  @IsString()
  startTime: string; // "09:00"

  @IsString()
  endTime: string; // "13:00"

  @IsInt()
  @Min(5)
  slotDuration: number; // minutes

  @IsInt()
  @Min(1)
  maxPatientsPerSlot: number;
}
