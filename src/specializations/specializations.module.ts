import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialization } from './specialization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialization]),
  ],
  providers: [],
  controllers: [],
  exports: [
    TypeOrmModule, 
  ],
})
export class SpecializationsModule {}
