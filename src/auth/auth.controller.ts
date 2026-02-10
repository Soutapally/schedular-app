//auth.controller.ts  - is the entry point for authentication related HTTP requests.
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
   //Frontend calls this when user clicks Doctor / Patient
   
  @Get('select-role')
  selectRole(
    @Query('role') role: 'PATIENT' | 'DOCTOR',
    @Res() res: express.Response,
  ) {
    if (role === 'PATIENT') {
      return res.redirect('/auth/google/patient');
    }

    if (role === 'DOCTOR') {
      return res.redirect('/auth/google/doctor');
    }

    return res.status(400).json({ message: 'Invalid role' });
  }

   //Patient Google login
  
  @Get('google/patient')
  @UseGuards(AuthGuard('google'))
  googlePatientLogin() {
    // Passport handles redirect to Google
  }

   //Doctor Google login
  
  @Get('google/doctor')
  @UseGuards(AuthGuard('google'))
  googleDoctorLogin() {
    // Passport handles redirect to Google
  }

   //Google OAuth callback
  
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req) {
    return this.authService.googleLogin(req.user);
  }
}
