import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { FavoriteEventDto } from './dto/favorite-event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { jwtPayload } from 'src/auth/auth.types';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

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
}
