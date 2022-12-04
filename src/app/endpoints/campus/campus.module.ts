import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampusEntity } from 'src/app/entities/campus.entity';
import { CampusController } from './campus.controller';
import { CampusService } from './campus.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampusEntity])],
  controllers: [CampusController],
  providers: [CampusService],
  exports: [CampusService],
})
export class CampusModule {}
