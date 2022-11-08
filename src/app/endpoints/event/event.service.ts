import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/app/entities/event.entity';
import { UserEventService } from 'src/app/services/user-event/user-event.service';
import { FindManyOptions, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly userEventService: UserEventService,
    private readonly userService: UserService,
  ) {}

  async query(query: string, parameters?: any[]) {
    return await this.eventRepository.query(query, parameters);
  }

  async find(options?: FindManyOptions<EventEntity>) {
    return await this.eventRepository.find(options);
  }

  async favoriteEvent(eventId: string, userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    const user = await this.userService.findOneOrFail({
      where: { id: userId },
    });

    return await this.userEventService.create(user, event);
  }
}
