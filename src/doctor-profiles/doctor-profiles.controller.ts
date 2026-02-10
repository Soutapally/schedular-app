import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DoctorProfilesService } from './doctor-profiles.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';

@Controller('doctor-profiles') // ✅ THIS defines /doctor-profiles
@UseGuards(JwtAuthGuard)
export class DoctorProfilesController {
  constructor(
    private readonly doctorProfilesService: DoctorProfilesService,
  ) {}

  @Post()
  create(@Req() req, @Body() dto: CreateDoctorProfileDto) {
    return this.doctorProfilesService.upsertProfile(req.user.id, dto);
  }

  @Get('me')
  getMyProfile(@Req() req) {
    return this.doctorProfilesService.getMyProfile(req.user.id);
  }
}
