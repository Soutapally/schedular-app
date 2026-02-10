import { IsInt, IsArray, Min } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsInt()
  @Min(0)
  experience: number;

  @IsInt()
  fee: number;

  @IsArray()
  specializationIds: number[];
}
