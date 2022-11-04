import { Module } from '@nestjs/common';
import { ScreenDataService } from './screen-data.service';
import { ScreenDataController } from './screen-data.controller';
import { CampusModule } from 'src/app/services/campus/campus.module';
import { GenreModule } from 'src/app/services/genre/genre.module';
import { CourseCampusModule } from 'src/app/services/course-campus/course-campus.module';

@Module({
  imports: [CampusModule, GenreModule, CourseCampusModule],
  controllers: [ScreenDataController],
  providers: [ScreenDataService],
})
export class ScreenDataModule {}
