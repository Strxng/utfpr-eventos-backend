import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule } from './jwt/jwt.module';
import { UserModule } from './app/endpoints/user/user.module';
import { CourseCampusModule } from './app/services/course-campus/course-campus.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './app/endpoints/event/event.module';
import { UserEventModule } from './app/services/user-event/user-event.module';
import { GenreModule } from './app/endpoints/genre/genre.module';
import { CampusModule } from './app/endpoints/campus/campus.module';
import { CourseModule } from './app/endpoints/course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.UTFPR_EVENTOS_DATABASE_PLUGIN,
      host: process.env.UTFPR_EVENTOS_DATABASE_HOST,
      port: parseInt(process.env.UTFPR_EVENTOS_DATABASE_PORT),
      username: process.env.UTFPR_EVENTOS_DATABASE_USER,
      password: process.env.UTFPR_EVENTOS_DATABASE_PASSWORD,
      database: process.env.UTFPR_EVENTOS_DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
      options: {
        encrypt: false,
      },
    } as TypeOrmModuleOptions),
    JwtModule,
    UserModule,
    GenreModule,
    CourseCampusModule,
    AuthModule,
    CampusModule,
    CourseModule,
    EventModule,
    UserEventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
