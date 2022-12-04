import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/app/entities/event.entity';
import { UserEventEntity } from 'src/app/entities/user-event.entity';
import { UserEventService } from 'src/app/services/user-event/user-event.service';
import { Between, FindManyOptions, Like, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { EventResponse, SearchEventProps } from './event.types';

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

  async unfavoriteEvent(eventId: string, userId: string) {
    return await this.userEventService.destroy(userId, eventId);
  }

  async getAllFavoriteEvents(userId: string) {
    const response = await this.find({
      where: { userEvents: { user: { id: userId } } },
      relations: { courseCampus: { campus: true } },
    });

    const events = response.filter((event) => event.endDate > new Date());

    const finishedEvents = response.filter(
      (event) => event.endDate < new Date(),
    );

    return {
      events,
      finishedEvents,
    };
  }

  async getPopularEvents({
    page = 1,
    limit = 10,
    search = '',
    categoryId = '',
    userId,
  }: SearchEventProps): Promise<EventResponse[]> {
    let popularEvents: any[];
    if (categoryId) {
      popularEvents = await this.find({
        relations: {
          courseCampus: {
            campus: true,
            course: true,
          },
          userEvents: {
            user: true,
          },
        },
        where: {
          name: Like(`%${search}%`),
          courseCampus: {
            course: { id: categoryId },
          },
        },
        take: limit,
        skip: page - 1,
      });
    } else {
      popularEvents = await this.find({
        relations: {
          courseCampus: {
            campus: true,
            course: true,
          },
          userEvents: {
            user: true,
          },
        },
        where: {
          name: Like(`%${search}%`),
        },
        take: limit,
        skip: page - 1,
      });
    }

    const formatedPopularEvents: EventResponse[] = popularEvents.map(
      (event: EventEntity) => {
        return {
          id: event.id,
          course: event.courseCampus.course.name,
          courseId: event.courseCampus.course.id,
          campus: event.courseCampus.campus.name,
          description: event.description,
          favorites: event.userEvents.length,
          image: event.image,
          isFavorite: !!event.userEvents.find(
            (userEvent) => userEvent.user.id === userId,
          ),
          local: event.local,
          name: event.name,
          endDate: event.endDate,
          startDate: event.startDate,
        };
      },
    );

    return formatedPopularEvents;
  }

  async getWeekEvents({
    page = 1,
    limit = 10,
    search = '',
    categoryId = '',
    userId,
  }: SearchEventProps): Promise<EventResponse[]> {
    const dateNow = new Date();
    const dateAfterWeek = new Date();
    dateAfterWeek.setDate(dateNow.getDate() + 7);

    let weekEvents: any[];
    if (categoryId) {
      weekEvents = await this.find({
        relations: {
          courseCampus: {
            campus: true,
            course: true,
          },
          userEvents: {
            user: true,
          },
        },
        where: {
          startDate: Between(dateNow, dateAfterWeek),
          name: Like(`%${search}%`),
          courseCampus: {
            course: { id: categoryId },
          },
        },
        take: limit,
        skip: page - 1,
      });
    } else {
      weekEvents = await this.find({
        relations: {
          courseCampus: {
            campus: true,
            course: true,
          },
          userEvents: {
            user: true,
          },
        },
        where: {
          startDate: Between(dateNow, dateAfterWeek),
          name: Like(`%${search}%`),
        },
        take: limit,
        skip: page - 1,
      });
    }

    const formatedWeekEvents: EventResponse[] = weekEvents.map(
      (event: EventEntity) => {
        const isFavorite = event.userEvents.find(
          (userEvent: UserEventEntity) => userEvent.user.id === userId,
        );

        return {
          id: event.id,
          name: event.name,
          image: event.image,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          local: event.courseCampus.campus.city,
          courseId: event.courseCampus.course.id,
          course: event.courseCampus.course.name,
          campus: event.courseCampus.campus.name,
          isFavorite: !!isFavorite,
          favorites: event.userEvents.length,
        };
      },
    );

    return formatedWeekEvents;
  }
}
