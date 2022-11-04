import { Injectable } from '@nestjs/common';
import { CampusService } from 'src/app/services/campus/campus.service';
import { CourseCampusService } from 'src/app/services/course-campus/course-campus.service';
import { GenreService } from 'src/app/services/genre/genre.service';

@Injectable()
export class ScreenDataService {
  constructor(
    private readonly genreService: GenreService,
    private readonly campusService: CampusService,
    private readonly courseCampusService: CourseCampusService,
  ) {}

  async getSignupData() {
    const genres = await this.genreService.find();
    const campus = await this.campusService.find();

    const campusCoursesPromises = campus.map(async (c) => {
      const courseCampus = await this.courseCampusService.find({
        relations: { course: true },
        where: { campus: { id: c.id } },
      });

      const courses = courseCampus.map((cc) => {
        return {
          id: cc.course.id,
          name: cc.course.name,
        };
      });

      return {
        id: c.id,
        name: c.name,
        courses,
      };
    });

    const campusCourses = await Promise.all(campusCoursesPromises);

    return {
      genres,
      campus: campusCourses,
    };
  }
}
