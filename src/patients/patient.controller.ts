//patient controller provides an api of onboarding to store the details of the 
// patient successfully

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patients')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('onboarding')
  completeOnboarding(
    @Req() req,
    @Body() dto: CreatePatientDto,
  ) {
    console.log('Authorization Header:', req.headers.authorization);
    console.log('JWT User:', req.user);
    return this.patientService.completeOnboarding(
      req.user.id,
      dto,
    );
  }
}
