import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ScreenDataService } from './screen-data.service';

@Controller('screen-data')
export class ScreenDataController {
  constructor(private readonly screenDataService: ScreenDataService) {}

  @Get('/signup')
  async getSignupData() {
    return await this.screenDataService.getSignupData();
  }

  @Get('/home')
  @UseGuards(JwtAuthGuard)
  async getHomeData(@Query('categoryId') categoryId: string, @Req() req) {
    return await this.screenDataService.getHomeData(categoryId, req.user.id);
  }
}
