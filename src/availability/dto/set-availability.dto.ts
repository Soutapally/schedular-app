import { IsString } from 'class-validator';

export class SetAvailabilityDto {
  @IsString()
  day: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
