import { Controller, Get } from '@nestjs/common';
import { CampusService } from './campus.service';

@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @Get('/')
  async findAll() {
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

    return formatedCampus;
  }
}
