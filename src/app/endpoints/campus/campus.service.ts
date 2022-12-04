import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampusEntity } from 'src/app/entities/campus.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CampusService {
  constructor(
    @InjectRepository(CampusEntity)
    private readonly campusRepository: Repository<CampusEntity>,
  ) {}

  async find(options?: FindManyOptions<CampusEntity>) {
    return this.campusRepository.find(options);
  }
}
