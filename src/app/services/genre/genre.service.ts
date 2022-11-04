import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreEntity } from 'src/app/entities/genre.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genresRepository: Repository<GenreEntity>,
  ) {}

  async findOne(options: FindOneOptions<GenreEntity>) {
    return await this.genresRepository.findOne(options);
  }

  async find(options?: FindManyOptions<GenreEntity>) {
    return await this.genresRepository.find(options);
  }
}
