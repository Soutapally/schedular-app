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

  @IsArray()
  specializations: string[];

}
