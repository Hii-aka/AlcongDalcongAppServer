import { Test, TestingModule } from '@nestjs/testing';
import { DateCalendarService } from './date-calendar.service';

describe('DateCalendarService', () => {
  let service: DateCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateCalendarService],
    }).compile();

    service = module.get<DateCalendarService>(DateCalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
