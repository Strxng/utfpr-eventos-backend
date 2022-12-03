import { Injectable } from '@nestjs/common';
import { CampusService } from 'src/app/services/campus/campus.service';
import { CourseService } from 'src/app/services/course/course.service';
import { GenreService } from 'src/app/services/genre/genre.service';
import { Between } from 'typeorm';
import { EventService } from '../event/event.service';

interface PopularEvent {
  id: string;
  name: string;
  image: string;
  description: string;
  startDate: Date;
  endDate: Date;
  local: string;
  courseId: string;
  course: string;
  favorites: number;
  isFavorite: boolean;
}

@Injectable()
export class ScreenDataService {
  constructor(
    private readonly genreService: GenreService,
    private readonly campusService: CampusService,
    private readonly courseService: CourseService,
    private readonly eventService: EventService,
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

  async getSignupData() {
    const genres = await this.genreService.find({
      select: { id: true, name: true },
    });

    const campus = await this.campusService.find({
      relations: {
        courseCampus: {
          course: true,
        },
      },
    });

    const formatedCampus = campus.map((c) => {
      return {
        id: c.id,
        name: c.name,
        courses: c.courseCampus.map((cc) => {
          return {
            id: cc.course.id,
            name: cc.course.name,
          };
        }),
      };
    });

    return {
      genres,
      campus: formatedCampus,
    };
  }

  async getHomeData(categoryId = '', userId: string) {
    const courses = await this.courseService.find({
      select: { id: true, name: true },
    });

    let popularEvents: PopularEvent[];
    if (categoryId) {
      popularEvents = await this.eventService.query(
        this.getPopularEventsWithCategoryQueryString(categoryId, userId),
      );
    } else {
      popularEvents = await this.eventService.query(
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
      weekEvents = await this.eventService.find({
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
      weekEvents = await this.eventService.find({
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
      courses,
      popularEvents: formatedPopularEvents,
      weekEvents: formatedWeekEvents,
    };
  }
}
