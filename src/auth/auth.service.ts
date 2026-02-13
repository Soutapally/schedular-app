import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { generateOtp } from './services/otp.service';
import { MailService } from '../mail/mail.service';

import { User, UserRole } from '../users/user.entity';
import { Doctor, DoctorStatus } from '../doctors/doctor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,

    private readonly jwtService: JwtService,
     private readonly mailService: MailService,
  ) {}

  async signup(dto: any) {
  const { name, email, password, role } = dto;

  const existingUser = await this.userRepo.findOne({ where: { email } });
  if (existingUser) {
    throw new BadRequestException('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 🔐 Generate OTP
  const { otp, otpHash, otpExpiry } = await generateOtp();

  const user = this.userRepo.create({
    name,
    email,
    password: hashedPassword,
    role,
    isVerified: false,
    isProfileCompleted: false,
    otpHash,
    otpExpiry,
  });

  await this.userRepo.save(user);

  // 📧 Send OTP
  await this.mailService.sendOtpEmail(email, otp);

  return {
    message: 'Signup successful. OTP sent to email.',
  };
}


 
async verify(dto: any) {
  const { email, otp } = dto;

  const user = await this.userRepo.findOne({ where: { email } });
  if (!user || !user.otpHash || !user.otpExpiry) {
    throw new NotFoundException('OTP not found');
  }

  if (user.otpExpiry < new Date()) {
    throw new BadRequestException('OTP expired');
  }

  const valid = await bcrypt.compare(otp, user.otpHash);
  if (!valid) {
    throw new BadRequestException('Invalid OTP');
  }

  user.isVerified = true;
  user.otpHash = null;
  user.otpExpiry = null;

  await this.userRepo.save(user);

  return { message: 'User verified successfully' };
}



  async signin(dto: any) {
    const { email, password } = dto;

    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new BadRequestException('Please verify your account first');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      role: user.role,
      isProfileCompleted: user.isProfileCompleted,
    };
  }

  
  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    name: string;
    role: UserRole;
  }) {
    let user = await this.userRepo.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = this.userRepo.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        role: googleUser.role,
        isVerified: true,
        isProfileCompleted: false,
      });

      user = await this.userRepo.save(user);
    } else {
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        await this.userRepo.save(user);
      }
    }

    
    if (googleUser.role === UserRole.DOCTOR) {
      const doctorExists = await this.doctorRepo.findOne({
        where: { user: { id: user.id } },
      });

      if (!doctorExists) {
        await this.doctorRepo.save({
          user,
          status: DoctorStatus.PENDING,
        });
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      role: user.role,
      isProfileCompleted: user.isProfileCompleted,
    };
  }
}
