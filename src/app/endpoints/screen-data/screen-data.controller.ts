import { Controller, Get } from '@nestjs/common';
import { ScreenDataService } from './screen-data.service';

@Controller('screen-data')
export class ScreenDataController {
  constructor(private readonly screenDataService: ScreenDataService) {}

  @Get('/signup')
  async getSignupData() {
    return await this.screenDataService.getSignupData();
  }
}
