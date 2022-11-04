import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseCampusEntity } from 'src/app/entities/course_campus.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class CourseCampusService {
  constructor(
    @InjectRepository(CourseCampusEntity)
    private readonly courseCampusRepository: Repository<CourseCampusEntity>,
  ) {}

  async findOne(options: FindOneOptions<CourseCampusEntity>) {
    return await this.courseCampusRepository.findOne(options);
  }

  async find(options?: FindManyOptions<CourseCampusEntity>) {
    return await this.courseCampusRepository.find(options);
  }
}
