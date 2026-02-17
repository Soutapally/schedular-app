import { IsArray, IsInt, IsString, Min } from 'class-validator';
export class SetAvailabilityDto {
  @IsArray()
  days: string[];

  @IsString()
  sessionLabel: string; // Morning / Evening

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsInt()
  slotDuration: number;

  @IsInt()
  maxPatientsPerSlot: number;
}
