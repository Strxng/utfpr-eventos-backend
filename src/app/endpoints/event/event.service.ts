import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/app/entities/event.entity';
import { UserEventEntity } from 'src/app/entities/user-event.entity';
import { UserEventService } from 'src/app/services/user-event/user-event.service';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
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
      relations: {
        courseCampus: { campus: true, course: true },
        userEvents: {
          user: true,
        },
      },
    });

    const events: EventResponse[] = response
      .filter((event) => event.endDate > new Date())
      .map((event) => {
        return {
          id: event.id,
          campus: event.courseCampus.campus.name,
          course: event.courseCampus.course.name,
          courseId: event.courseCampus.course.id,
          description: event.description,
          endDate: event.endDate,
          startDate: event.startDate,
          favorites: event.userEvents.length,
          image: event.image,
          isFavorite: !!event.userEvents.find(
            (userEvent) => userEvent.user.id === userId,
          ),
          local: event.local,
          name: event.name,
        };
      });

    const finishedEvents: EventResponse[] = response
      .filter((event) => event.endDate < new Date())
      .map((event) => {
        return {
          id: event.id,
          campus: event.courseCampus.campus.name,
          course: event.courseCampus.course.name,
          courseId: event.courseCampus.course.id,
          description: event.description,
          endDate: event.endDate,
          startDate: event.startDate,
          favorites: event.userEvents.length,
          image: event.image,
          isFavorite: !!event.userEvents.find(
            (userEvent) => userEvent.user.id === userId,
          ),
          local: event.local,
          name: event.name,
        };
      });

    return {
      events,
      finishedEvents,
    };
  }

  async getPopularEvents({
    page = 1,
    limit = 10,
    search = '',
    campusId = '',
    courseId = '',
    userId,
  }: SearchEventProps): Promise<EventResponse[]> {
    const where: FindOptionsWhere<EventEntity> = {
      name: Like(`%${search}%`),
    };

    if (campusId || courseId) {
      where.courseCampus = {};
      if (campusId) {
        where.courseCampus.campus = { id: campusId };
      }
      if (courseId) {
        where.courseCampus.course = { id: courseId };
      }
    }

    const popularEvents = await this.find({
      relations: {
        courseCampus: {
          campus: true,
          course: true,
        },
        userEvents: {
          user: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      where,
    });

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
    campusId = '',
    courseId = '',
    userId,
  }: SearchEventProps): Promise<EventResponse[]> {
    const dateNow = new Date();
    const dateAfterWeek = new Date();
    dateAfterWeek.setDate(dateNow.getDate() + 7);

    const where: FindOptionsWhere<EventEntity> = {
      startDate: Between(dateNow, dateAfterWeek),
      name: Like(`%${search}%`),
    };

    if (campusId || courseId) {
      where.courseCampus = {};
      if (campusId) {
        where.courseCampus.campus = { id: campusId };
      }
      if (courseId) {
        where.courseCampus.course = { id: courseId };
      }
    }

    const weekEvents = await this.find({
      relations: {
        courseCampus: {
          campus: true,
          course: true,
        },
        userEvents: {
          user: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      where,
    });

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

  async getAllEvents({
    page = 1,
    limit = 10,
    search = '',
    campusId = '',
    courseId = '',
    userId,
  }: SearchEventProps): Promise<EventResponse[]> {
    const where: FindOptionsWhere<EventEntity> = {
      name: Like(`%${search}%`),
    };

    if (campusId || courseId) {
      where.courseCampus = {};
      if (campusId) {
        where.courseCampus.campus = { id: campusId };
      }
      if (courseId) {
        where.courseCampus.course = { id: courseId };
      }
    }

    const weekEvents = await this.find({
      relations: {
        courseCampus: {
          campus: true,
          course: true,
        },
        userEvents: {
          user: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      where,
    });

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
