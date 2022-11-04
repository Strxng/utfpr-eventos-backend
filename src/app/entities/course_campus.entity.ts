import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampusEntity } from './campus.entity';
import { CourseEntity } from './course.entity';

@Entity({ name: 'course_campus' })
export class CourseCampusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CampusEntity, (campus) => campus.id)
  @JoinColumn({ name: 'campus_id' })
  campus: CampusEntity;

  @ManyToOne(() => CourseEntity, (course) => course.id)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
