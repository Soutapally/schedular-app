//Handles business logic to create a specialization (preventing duplicates) and fetch 
// all specializations from the database.

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialization } from './specialization.entity';
import { CreateSpecializationDto } from './dto/create-specialization.dto';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(Specialization)
    private readonly repo: Repository<Specialization>,
  ) {}

  async create(dto: CreateSpecializationDto) {
    const existing = await this.repo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Specialization already exists');
    }

    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find();
  }
}
