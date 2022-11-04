import { Injectable } from '@nestjs/common';
import { CampusService } from 'src/app/services/campus/campus.service';
import { GenreService } from 'src/app/services/genre/genre.service';

@Injectable()
export class ScreenDataService {
  constructor(
    private readonly genreService: GenreService,
    private readonly campusService: CampusService,
  ) {}

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
}
