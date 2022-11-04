import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampusEntity } from './campus.entity';
import { CourseEntity } from './course.entity';
import { EventEntity } from './event.entity';

@Entity({ name: 'course_campus' })
export class CourseCampusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CampusEntity, (campus) => campus.courseCampus)
  @JoinColumn({ name: 'campus_id' })
  campus: CampusEntity;

  @ManyToOne(() => CourseEntity, (course) => course.courseCampus)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @OneToMany(() => EventEntity, (event) => event.courseCampus)
  events: EventEntity[];

  @Column()
  code: string;

  @Column()
  period: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
