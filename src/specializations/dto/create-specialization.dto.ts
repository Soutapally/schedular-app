import { IsString, MinLength } from 'class-validator';

export class CreateSpecializationDto {
  @IsString()
  @MinLength(3)
  name: string;
}
