import { Test, TestingModule } from '@nestjs/testing';
import { ScreenDataService } from './screen-data.service';

describe('ScreenDataService', () => {
  let service: ScreenDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenDataService],
    }).compile();

    service = module.get<ScreenDataService>(ScreenDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
