import { Test, TestingModule } from '@nestjs/testing';
import { ScreenDataController } from '../screen-data.controller';
import { ScreenDataService } from '../screen-data.service';

describe('ScreenDataController', () => {
  let controller: ScreenDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreenDataController],
      providers: [ScreenDataService],
    }).compile();

    controller = module.get<ScreenDataController>(ScreenDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
