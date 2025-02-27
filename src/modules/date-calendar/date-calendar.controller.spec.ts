import { Test, TestingModule } from '@nestjs/testing';
import { DateCalendarController } from './date-calendar.controller';

describe('DateCalendarController', () => {
  let controller: DateCalendarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DateCalendarController],
    }).compile();

    controller = module.get<DateCalendarController>(DateCalendarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
