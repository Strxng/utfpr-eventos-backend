import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule } from './jwt/jwt.module';
import { UserModule } from './app/endpoints/user/user.module';
import { GenreModule } from './app/services/genre/genre.module';
import { CourseCampusModule } from './app/services/course-campus/course-campus.module';
import { AuthModule } from './auth/auth.module';
import { ScreenDataModule } from './app/endpoints/screen-data/screen-data.module';
import { CampusModule } from './app/services/campus/campus.module';
import { CourseModule } from './app/services/course/course.module';
import { EventModule } from './app/services/event/event.module';

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
    ScreenDataModule,
    CampusModule,
    CourseModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
