import { IsString, IsNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  fullName: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: string;

  @IsString()
  phone: string;
}
