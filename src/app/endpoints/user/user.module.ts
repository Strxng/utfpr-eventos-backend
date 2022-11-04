import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GenreModule } from 'src/app/services/genre/genre.module';
import { CourseCampusModule } from 'src/app/services/course-campus/course-campus.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/entities/user.entity';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    GenreModule,
    CourseCampusModule,
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
