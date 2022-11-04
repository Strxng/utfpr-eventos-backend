import { Injectable } from '@nestjs/common';
import { CampusService } from 'src/app/services/campus/campus.service';
import { CourseService } from 'src/app/services/course/course.service';
import { EventService } from 'src/app/services/event/event.service';
import { GenreService } from 'src/app/services/genre/genre.service';
import { Between } from 'typeorm';

@Injectable()
export class ScreenDataService {
  constructor(
    private readonly genreService: GenreService,
    private readonly campusService: CampusService,
    private readonly courseService: CourseService,
    private readonly eventService: EventService,
  ) {}

  private readonly popularEventsQueryString = `
    select top 10
      e.id,
      e.name,
      e.start_date,
      c.name as local,
      co.id as courseId,
      co.name as course,
      count(ue.id) as favorities
    from events e
    inner join user_event ue on e.id = ue.event_id
    inner join course_campus cc on cc.id = e.course_campus_id
    inner join campus c on c.id = cc.campus_id
    inner join courses co on co.id = cc.course_id
    group by e.id, e.name, e.start_date, c.name, co.id, co.name
    order by favorities
  `;

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

  async getHomeData() {
    const courses = await this.courseService.find({
      select: { id: true, name: true },
    });

    const popularEvents = await this.eventService.query(
      this.popularEventsQueryString,
    );

    const dateNow = new Date();
    const dateAfterWeek = new Date();
    dateAfterWeek.setDate(dateNow.getDate() + 7);

    const weekEvents = await this.eventService.find({
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

    const formatedWeekEvents = weekEvents.map((event) => {
      return {
        id: event.id,
        name: event.name,
        startDate: event.startDate,
        local: event.courseCampus.campus.city,
        courseId: event.courseCampus.course.id,
        course: event.courseCampus.course.name,
      };
    });

    return {
      courses,
      popularEvents,
      weekEvents: formatedWeekEvents,
    };
  }
}
