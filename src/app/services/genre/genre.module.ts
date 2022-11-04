import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from 'src/app/entities/genre.entity';
import { GenreService } from './genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
