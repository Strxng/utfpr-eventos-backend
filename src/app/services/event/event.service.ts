import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/app/entities/event.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async query(query: string, parameters?: any[]) {
    return await this.eventRepository.query(query, parameters);
  }

  async find(options?: FindManyOptions<EventEntity>) {
    return await this.eventRepository.find(options);
  }
}
