import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AuthModule } from './auth/auth.module';
import { DoctorProfilesModule } from './doctor-profiles/doctor-profiles.module';
import { VerificationModule } from './verification/verification.module';
import { AvailabilityModule } from './availability/availability.module';
import { SpecializationsModule } from './specializations/specializations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true // dev only
    }),
    
    UsersModule,
    PatientsModule,
    DoctorsModule,
    AuthModule,
    DoctorsModule,
    DoctorProfilesModule,
    VerificationModule,
  AvailabilityModule,
  SpecializationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
