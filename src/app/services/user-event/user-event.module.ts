import { Module } from '@nestjs/common';
import { UserEventService } from './user-event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEventEntity } from 'src/app/entities/user-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEventEntity])],
  providers: [UserEventService],
  exports: [UserEventService],
})
export class UserEventModule {}
