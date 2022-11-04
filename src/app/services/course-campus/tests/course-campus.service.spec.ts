import { Test, TestingModule } from '@nestjs/testing';
import { CourseCampusService } from '../course-campus.service';

describe('CourseCampusService', () => {
  let service: CourseCampusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseCampusService],
    }).compile();

    service = module.get<CourseCampusService>(CourseCampusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
