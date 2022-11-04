import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/app/entities/course.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  async find(options?: FindManyOptions<CourseEntity>) {
    return await this.courseRepository.find(options);
  }
}
