import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/app/entities/event.entity';
import { UserEventEntity } from 'src/app/entities/user-event.entity';
import { UserEntity } from 'src/app/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserEventService {
  constructor(
    @InjectRepository(UserEventEntity)
    private readonly userEventEntity: Repository<UserEventEntity>,
  ) {}

  async create(user: UserEntity, event: EventEntity) {
    return await this.userEventEntity.save({
      user,
      event,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
