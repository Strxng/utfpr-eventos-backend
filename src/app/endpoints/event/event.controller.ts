import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Delete,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { FavoriteEventDto } from './dto/favorite-event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { jwtPayload } from 'src/auth/auth.types';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllEvents(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('campusId') campusId: string,
    @Query('courseId') courseId: string,
    @Req() req,
  ) {
    return await this.eventService.getAllEvents({
      page: page || 1,
      limit,
      search,
      campusId,
      courseId,
      userId: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/popular')
  async getPopularEvents(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('campusId') campusId: string,
    @Query('courseId') courseId: string,
    @Req() req,
  ) {
    return await this.eventService.getPopularEvents({
      page: page || 1,
      limit,
      search,
      campusId,
      courseId,
      userId: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/week')
  async getWeekEvents(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('campusId') campusId: string,
    @Query('courseId') courseId: string,
    @Req() req,
  ) {
    return await this.eventService.getWeekEvents({
      page: page || 1,
      limit,
      search,
      campusId,
      courseId,
      userId: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorite')
  async favoriteEvent(
    @Body() favoriteEvent: FavoriteEventDto,
    @Req() req: jwtPayload,
  ) {
    return await this.eventService.favoriteEvent(
      favoriteEvent.eventId,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorite/:id')
  async unfavoriteEvent(@Param() params, @Req() req: jwtPayload) {
    return await this.eventService.unfavoriteEvent(params.id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorite')
  async getAllFavorites(@Req() req) {
    return await this.eventService.getAllFavoriteEvents(req.user.id);
  }
}
