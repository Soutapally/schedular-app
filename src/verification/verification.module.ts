//Registers the verification token entity and provides the verification service for use 
// in other modules.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationToken } from './verification-token.entity';
import { VerificationService } from './verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationToken])],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
