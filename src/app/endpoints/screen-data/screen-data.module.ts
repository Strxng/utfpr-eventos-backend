import { Module } from '@nestjs/common';
import { ScreenDataService } from './screen-data.service';
import { ScreenDataController } from './screen-data.controller';
import { CampusModule } from 'src/app/services/campus/campus.module';
import { GenreModule } from 'src/app/services/genre/genre.module';

@Module({
  imports: [CampusModule, GenreModule],
  controllers: [ScreenDataController],
  providers: [ScreenDataService],
})
export class ScreenDataModule {}
