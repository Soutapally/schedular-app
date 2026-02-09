//auth.service.ts - contains core authentication and onboarding bussiness logic.
//create or fetch user based on Google identity, create role specific profile(doctor/patient)
//Issues JWT access token for session management.

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User, UserRole } from '../users/user.entity';
import { Patient } from 'src/patients/patient.entity';
import { Doctor } from 'src/doctors/doctor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Patient)
  private readonly patientRepo: Repository<Patient>,

  @InjectRepository(Doctor)
  private readonly doctorRepo: Repository<Doctor>,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(googleUser: any) {
  let user = await this.userRepo.findOne({
    where: { googleId: googleUser.googleId },
  });

  if (!user) {
    user = await this.userRepo.save({
      name: googleUser.name,
      email: googleUser.email,
      googleId: googleUser.googleId,
      role: googleUser.role,
      isProfileCompleted: true,
    });

    if (user.role === UserRole.PATIENT) {
      await this.patientRepo.save({ user });
    }

    if (user.role === UserRole.DOCTOR) {
      await this.doctorRepo.save({ user });
    }
  }

  const accessToken = this.jwtService.sign({
    sub: user.id,
    role: user.role,
  });
console.log('JWT_SECRET:', process.env.JWT_SECRET);

  return { accessToken };
}

}
