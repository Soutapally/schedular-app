//auth.controller.ts  - is the entry point for authentication related HTTP requests.

import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Patient login
  @Get('google/patient')
  @UseGuards(AuthGuard('google'))
  googlePatientLogin() {
   
  }

  // Doctor login
  @Get('google/doctor')
  @UseGuards(AuthGuard('google'))
  googleDoctorLogin() {
   
  }

  // Google redirects here
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req) {
    return this.authService.googleLogin(req.user);
  }
}

