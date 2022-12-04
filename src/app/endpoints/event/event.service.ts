import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/app/entities/event.entity';
import { UserEventService } from 'src/app/services/user-event/user-event.service';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { PopularEvent } from './event.types';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly userEventService: UserEventService,
    private readonly userService: UserService,
  ) {}

  private getPopularEventsQueryString(userId: string) {
    return `
      select top 10
        e.id,
        e.name,
        e.image,
        e.description,
        e.local,
        e.start_date as startDate,
        e.end_date as endDate,
        co.id as courseId,
        co.name as course,
        c.name as campus,
        (select count(*) from user_event where event_id = e.id and deleted_at is null) as favorites,
        (select count(*) from user_event where user_id = '${userId}' and event_id = e.id and deleted_at is null) as isFavorite
      from events e
      inner join course_campus cc on cc.id = e.course_campus_id
      inner join campus c on c.id = cc.campus_id
      inner join courses co on co.id = cc.course_id
      where (e.start_date > getdate() or e.end_date > getdate())
      order by favorites desc
    `;
  }

  private getPopularEventsWithCategoryQueryString(
    categoryId: string,
    userId: string,
  ): string {
    return `
      select top 10
        e.id,
        e.name,
        e.image,
        e.description,
        e.local,
        e.start_date as startDate,
        e.end_date as endDate,
        co.id as courseId,
        co.name as course,
        c.name as campus,
        (select count(*) from user_event where event_id = e.id and deleted_at is null) as favorites,
        (select count(*) from user_event where user_id = '${userId}' and event_id = e.id and deleted_at is null) as isFavorite
      from events e
      inner join course_campus cc on cc.id = e.course_campus_id
      inner join campus c on c.id = cc.campus_id
      inner join courses co on co.id = cc.course_id
      where co.id = '${categoryId}' and (e.start_date > getdate() or e.end_date > getdate())
      order by favorites desc
    `;
  }

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

  async getPopularWeekEvents(categoryId = '', userId: string) {
    let popularEvents: PopularEvent[];
    if (categoryId) {
      popularEvents = await this.query(
        this.getPopularEventsWithCategoryQueryString(categoryId, userId),
      );
    } else {
      popularEvents = await this.query(
        this.getPopularEventsQueryString(userId),
      );
    }

    const formatedPopularEvents = popularEvents.map((event) => {
      return { ...event, isFavorite: event.isFavorite ? true : false };
    });

    const dateNow = new Date();
    const dateAfterWeek = new Date();
    dateAfterWeek.setDate(dateNow.getDate() + 7);

    let weekEvents: any;
    if (categoryId) {
      weekEvents = await this.find({
        relations: {
          courseCampus: {
            campus: true,
            course: true,
          },
        },
        where: {
          startDate: Between(dateNow, dateAfterWeek),
          courseCampus: {
            course: { id: categoryId },
          },
        },
      });
    } else {
      weekEvents = await this.find({
        relations: {
          courseCampus: {
            campus: true,
            course: true,
          },
        },
        where: {
          startDate: Between(dateNow, dateAfterWeek),
        },
      });
    }

    const formatedWeekEvents = weekEvents.map((event) => {
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
      };
    });

    return {
      popularEvents: formatedPopularEvents,
      weekEvents: formatedWeekEvents,
    };
  }
}
