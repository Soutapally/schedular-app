import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { VerifyDto } from './dto/verify.dto';
import type { Request, Response } from 'express';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

@Post('signup')
signup(@Body() dto: SignupDto){
  return this.authService.signup(dto);
}

@Post('signin')
signin(@Body() dto: SigninDto) {
  return this.authService.signin(dto);
}

@Post('verify')
verify(@Body() dto: VerifyDto) {
  return this.authService.verify(dto);
}


  // ✅ SELECT ROLE (Redirects to correct Google route)
  @Get('select-role')
  selectRole(
    @Query('role') role: 'PATIENT' | 'DOCTOR',
    @Res() res: Response,
  ) {
    if (role === 'PATIENT') {
      return res.redirect('/auth/google/patient');
    }

    if (role === 'DOCTOR') {
      return res.redirect('/auth/google/doctor');
    }

    return res.status(400).json({ message: 'Invalid role' });
  }

  // ✅ GOOGLE PATIENT LOGIN
  @Get('google/patient')
  @UseGuards(AuthGuard('google'))
  googlePatientLogin() {
    // passport handles redirect
  }

  // ✅ GOOGLE DOCTOR LOGIN
  @Get('google/doctor')
  @UseGuards(AuthGuard('google'))
  googleDoctorLogin() {
    // passport handles redirect
  }

  // ✅ GOOGLE CALLBACK
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any) {
  return this.authService.googleLogin(req.user);
}

}
