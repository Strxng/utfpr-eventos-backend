import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampusEntity } from 'src/app/entities/campus.entity';
import { CampusService } from './campus.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampusEntity])],
  providers: [CampusService],
  exports: [CampusService],
})
export class CampusModule {}
