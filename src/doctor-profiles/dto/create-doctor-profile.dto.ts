import {
  IsInt,
  IsPositive,
  IsArray,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateDoctorProfileDto {
  @IsInt()
  @IsPositive()
  experience: number;

  @IsInt()
  @IsPositive()
  fee: number;

  @IsString()
  @MinLength(5)
  licenseNo: string;

  @IsArray()
  specializationIds: number[];
}
