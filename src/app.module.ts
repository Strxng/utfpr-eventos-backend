import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.UTFPR_EVENTOS_DATABASE_PLUGIN,
      host: process.env.UTFPR_EVENTOS_DATABASE_HOST,
      port: process.env.UTFPR_EVENTOS_DATABASE_PORT,
      username: process.env.UTFPR_EVENTOS_DATABASE_USER,
      password: process.env.UTFPR_EVENTOS_DATABASE_PASSWORD,
      database: process.env.UTFPR_EVENTOS_DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
    } as TypeOrmModuleOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
