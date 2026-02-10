//auth.service.ts - contains core authentication and onboarding bussiness logic.
//create or fetch user based on Google identity, create role specific profile(doctor/patient)
//Issues JWT access token for session management.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User, UserRole } from '../users/user.entity';
import { Patient } from '../patients/patient.entity';
import { Doctor } from '../doctors/doctor.entity';

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

  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    name: string;
    role: UserRole;
  }) {
    let user = await this.userRepo.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      user = this.userRepo.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        role: googleUser.role,
        isProfileCompleted: true,
      });

      user = await this.userRepo.save(user);

      if (user.role === UserRole.PATIENT) {
        await this.patientRepo.save({ user });
      }

      if (user.role === UserRole.DOCTOR) {
        await this.doctorRepo.save({ user });
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}

