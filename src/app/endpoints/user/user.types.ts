import { CourseCampusEntity } from 'src/app/entities/course_campus.entity';
import { GenreEntity } from 'src/app/entities/genre.entity';

export interface UserToSave {
  name: string;
  academicRegistry: string;
  email: string;
  phone: string;
  birthdate: Date;
  password: string;
  genre: GenreEntity;
  courseCampus: CourseCampusEntity;
}

export interface UserToReponse {
  id: string;
  name: string;
  academicRegistry: string;
  email: string;
  phone: string;
  birthdate: Date;
  genre: string;
  campus: string;
  course: string;
  createdAt: Date;
  updatedAt: Date;
}
