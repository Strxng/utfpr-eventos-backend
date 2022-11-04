import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCampusEntity } from 'src/app/entities/course_campus.entity';
import { CourseCampusService } from './course-campus.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourseCampusEntity])],
  providers: [CourseCampusService],
  exports: [CourseCampusService],
})
export class CourseCampusModule {}
