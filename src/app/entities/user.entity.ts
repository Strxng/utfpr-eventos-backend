import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { GenreEntity } from './genre.entity';
import { CourseCampusEntity } from './course_campus.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'academic_registry', nullable: false })
  academicRegistry: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: false })
  birthdate: Date;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => GenreEntity, (genre) => genre.id)
  @JoinColumn({ name: 'genre_id' })
  genre: GenreEntity;

  @ManyToOne(() => CourseCampusEntity, (courseCampus) => courseCampus.id)
  @JoinColumn({ name: 'course_campus_id' })
  courseCampus: CourseCampusEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
