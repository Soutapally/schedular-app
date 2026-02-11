

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationToken, VerificationType } from './verification-token.entity';
import { Doctor } from '../doctors/doctor.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationToken)
    private readonly tokenRepo: Repository<VerificationToken>,
  ) {}

  async createDoctorVerification(doctor: Doctor) {
    const token = this.tokenRepo.create({
      doctor,
      token: randomUUID(),
      type: VerificationType.LICENSE,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    });

    return this.tokenRepo.save(token);
  }
}
