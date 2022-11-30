import { Controller, Get, Query } from '@nestjs/common';
import { ScreenDataService } from './screen-data.service';

@Controller('screen-data')
export class ScreenDataController {
  constructor(private readonly screenDataService: ScreenDataService) {}

  @Get('/signup')
  async getSignupData() {
    return await this.screenDataService.getSignupData();
  }

  @Get('/home')
  async getHomeData(@Query('categoryId') categoryId: string) {
    return await this.screenDataService.getHomeData(categoryId);
  }
}
